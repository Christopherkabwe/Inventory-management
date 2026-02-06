// /api/grn/[id]/status
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import withRetries from "@/lib/retry";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;

    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const receiveItems: { grnItemId: string; quantity: number }[] =
            body.items ?? [];

        if (!receiveItems.length)
            return NextResponse.json({ error: "No items provided" }, { status: 400 });

        /* ====================================================
           1️⃣ LOAD EVERYTHING OUTSIDE TRANSACTION
        ==================================================== */
        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: {
                po: true,
                items: {
                    include: {
                        poItem: true
                    }
                }
            }
        });

        if (!grn) throw new Error("GRN not found");
        if (grn.locked) throw new Error("GRN is locked");
        if (grn.status === "CLOSED") throw new Error("GRN already closed");

        const poItemIds = [...new Set(grn.items.map(i => i.poItemId))];

        const receivedAgg = await prisma.gRNItem.groupBy({
            by: ["poItemId"],
            where: { poItemId: { in: poItemIds } },
            _sum: { quantityReceived: true }
        });

        const receivedMap = new Map(
            receivedAgg.map(r => [
                r.poItemId,
                r._sum.quantityReceived ?? 0
            ])
        );

        /* ====================================================
           2️⃣ PREPARE ALL DB OPERATIONS
        ==================================================== */
        const grnItemUpdates: any[] = [];
        const inventoryUpserts: any[] = [];
        const historyRows: any[] = [];

        const inventoryMap = new Map<
            string,
            { productId: string; locationId: string; qty: number }
        >();

        for (const entry of receiveItems) {
            if (entry.quantity <= 0) continue;

            const grnItem = grn.items.find(i => i.id === entry.grnItemId);
            if (!grnItem) continue;

            const poQty = grnItem.poItem.quantity;
            const alreadyReceived = receivedMap.get(grnItem.poItemId) ?? 0;
            const remaining = poQty - alreadyReceived;

            if (remaining <= 0) continue;

            const receivable = Math.min(entry.quantity, remaining);

            receivedMap.set(grnItem.poItemId, alreadyReceived + receivable);

            grnItemUpdates.push(
                prisma.gRNItem.update({
                    where: { id: grnItem.id },
                    data: { quantityReceived: { increment: receivable } }
                })
            );

            const invKey = `${grnItem.poItem.productId}|${grn.locationId}`;
            const inv = inventoryMap.get(invKey);

            inventoryMap.set(invKey, {
                productId: grnItem.poItem.productId,
                locationId: grn.locationId,
                qty: (inv?.qty ?? 0) + receivable
            });

            historyRows.push({
                productId: grnItem.poItem.productId,
                locationId: grn.locationId,
                date: new Date(),
                delta: receivable,
                sourceType: "PURCHASE_RECEIPT",
                reference: grn.grnNumber,
                createdById: user.id,
                metadata: {
                    grnId: grn.id,
                    grnItemId: grnItem.id,
                    poId: grn.poId
                }
            });
        }

        for (const inv of inventoryMap.values()) {
            inventoryUpserts.push(
                prisma.inventory.upsert({
                    where: {
                        productId_locationId: {
                            productId: inv.productId,
                            locationId: inv.locationId
                        }
                    },
                    update: { quantity: { increment: inv.qty } },
                    create: {
                        productId: inv.productId,
                        locationId: inv.locationId,
                        quantity: inv.qty,
                        lowStockAt: 0,
                        createdById: user.id
                    }
                })
            );
        }

        /* ====================================================
           3️⃣ FINAL STATUS CHECKS (OUTSIDE TX)
        ==================================================== */
        // Get all PO items
        const poItems = await prisma.purchaseOrderItem.findMany({
            where: { purchaseOrderId: grn.poId }
        });

        // Get totals received per PO item across ALL GRNs
        const receivedTotals = await prisma.gRNItem.groupBy({
            by: ["poItemId"],
            where: {
                poItemId: { in: poItems.map(p => p.id) }
            },
            _sum: {
                quantityReceived: true
            }
        });

        const receivedTotalsMap = new Map(
            receivedTotals.map(r => [
                r.poItemId,
                r._sum.quantityReceived ?? 0
            ])
        );

        // Determine status
        const poComplete = poItems.every(item => {
            const newTotal = receivedMap.get(item.id)
                ?? receivedTotalsMap.get(item.id)
                ?? 0;

            return newTotal >= item.quantity;
        });

        // Build final totals map (future state)
        const finalTotalsMap = new Map<string, number>();

        for (const item of poItems) {
            const alreadyReceived = receivedTotalsMap.get(item.id) ?? 0;
            const newReceived = receivedMap.get(item.id) ?? alreadyReceived;

            finalTotalsMap.set(item.id, newReceived);
        }

        // Totals
        const totalOrderedPo = poItems.reduce((s, i) => s + i.quantity, 0);

        const totalReceivedAll = [...finalTotalsMap.values()]
            .reduce((a, b) => a + b, 0);

        // Determine PO status
        let poStatus: "SENT" | "PARTIALLY_RECEIVED" | "RECEIVED" = "SENT";

        if (totalReceivedAll === 0) poStatus = "SENT";
        else if (totalReceivedAll < totalOrderedPo) poStatus = "PARTIALLY_RECEIVED";
        else poStatus = "RECEIVED";


        const refreshedItems = grn.items.map(i => ({
            ...i,
            quantityReceived: receivedMap.get(i.poItemId) ?? 0
        }));

        const totalReceived = refreshedItems.reduce(
            (sum, i) => sum + (i.quantityReceived ?? 0),
            0
        );

        const totalOrdered = refreshedItems.reduce(
            (sum, i) => sum + i.poItem.quantity,
            0
        );

        const fullyReceived = totalReceived >= totalOrdered;

        /* ====================================================
           4️⃣ EXECUTE FAST BATCH TRANSACTION
        ==================================================== */
        await withRetries(() =>
            prisma.$transaction([
                ...grnItemUpdates,
                ...inventoryUpserts,
                historyRows.length
                    ? prisma.inventoryHistory.createMany({ data: historyRows })
                    : prisma.$executeRaw`SELECT 1`,
                prisma.gRN.update({
                    where: { id: grn.id },
                    data: {
                        status: fullyReceived
                            ? "RECEIVED"
                            : "PARTIALLY_RECEIVED",
                        locked: false
                    }
                }),
                prisma.purchaseOrder.update({
                    where: { id: grn.poId },
                    data: { status: poStatus }
                }),

                ...poItems.map(item =>
                    prisma.purchaseOrderItem.update({
                        where: { id: item.id },
                        data: {
                            receivedQuantity: finalTotalsMap.get(item.id) ?? 0
                        }
                    })
                )
            ])
        );

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message ?? "Failed to receive GRN" },
            { status: 500 }
        );
    }
}
