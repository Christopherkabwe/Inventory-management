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
            return NextResponse.json(
                { error: "No items provided" },
                { status: 400 }
            );

        await withRetries(() =>
            prisma.$transaction(async tx => {
                /* ----------------------------------------------------
                   Load GRN
                ---------------------------------------------------- */
                const grn = await tx.gRN.findUnique({
                    where: { id },
                    include: {
                        po: true,
                        items: {
                            include: {
                                poItem: { include: { product: true } }
                            }
                        }
                    }
                });

                if (!grn) throw new Error("GRN not found");
                if (grn.locked) throw new Error("GRN is locked");
                if (grn.status === "CLOSED") throw new Error("GRN already closed");

                /* ----------------------------------------------------
                   Pre-calc total received PER PO ITEM
                ---------------------------------------------------- */
                const poItemIds = [...new Set(grn.items.map(i => i.poItemId))];

                const receivedAgg = await tx.gRNItem.groupBy({
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

                /* ----------------------------------------------------
                   Prepare batch operations
                ---------------------------------------------------- */
                const inventoryChanges = new Map<
                    string,
                    { productId: string; locationId: string; qty: number }
                >();

                const historyRows: any[] = [];

                for (const entry of receiveItems) {
                    if (entry.quantity <= 0) continue;

                    const grnItem = grn.items.find(i => i.id === entry.grnItemId);
                    if (!grnItem) continue;

                    const poQty = grnItem.poItem.quantity;
                    const alreadyReceived = receivedMap.get(grnItem.poItemId) ?? 0;
                    const remaining = poQty - alreadyReceived;

                    if (remaining <= 0) continue;

                    const receivable = Math.min(entry.quantity, remaining);

                    // update GRN item
                    await tx.gRNItem.update({
                        where: { id: grnItem.id },
                        data: { quantityReceived: { increment: receivable } }
                    });

                    receivedMap.set(
                        grnItem.poItemId,
                        alreadyReceived + receivable
                    );

                    // inventory
                    const key = `${grnItem.poItem.productId}|${grn.locationId}`;
                    const existing = inventoryChanges.get(key);

                    inventoryChanges.set(key, {
                        productId: grnItem.poItem.productId,
                        locationId: grn.locationId,
                        qty: (existing?.qty ?? 0) + receivable
                    });

                    // history
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

                /* ----------------------------------------------------
                   Apply inventory changes
                ---------------------------------------------------- */
                for (const inv of inventoryChanges.values()) {
                    await tx.inventory.upsert({
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
                    });
                }

                if (historyRows.length) {
                    await tx.inventoryHistory.createMany({ data: historyRows });
                }

                /* ----------------------------------------------------
                   Update GRN status
                ---------------------------------------------------- */
                const refreshedItems = await tx.gRNItem.findMany({
                    where: { grnId: grn.id },
                    include: { poItem: true }
                });

                const fullyReceived = refreshedItems.every(
                    i => i.quantityReceived >= i.poItem.quantity
                );

                await tx.gRN.update({
                    where: { id: grn.id },
                    data: {
                        status: fullyReceived
                            ? "RECEIVED"
                            : "PARTIALLY_RECEIVED",
                        locked: fullyReceived
                    }
                });

                /* ----------------------------------------------------
                   FIXED PO COMPLETION CHECK
                ---------------------------------------------------- */
                const poItems = await tx.purchaseOrderItem.findMany({
                    where: { purchaseOrderId: grn.poId }
                });

                const poComplete = poItems.every(item => {
                    const totalReceived = receivedMap.get(item.id) ?? 0;
                    return totalReceived >= item.quantity;
                });

                if (poComplete) {
                    await tx.purchaseOrder.update({
                        where: { id: grn.poId },
                        data: { status: "RECEIVED" }
                    });
                }
            })
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
