// /api/grn/[id]/status
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import withRetries from "@/lib/retry";
import { GRNStatus } from "@/generated/prisma";
import { PurchaseOrderStatus } from "@/generated/prisma";

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
           1️⃣ LOAD GRN WITH ITEMS
        ==================================================== */
        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: {
                po: true,
                items: { include: { poItem: true } },
            },
        });

        if (!grn) throw new Error("GRN not found");
        if (grn.locked) throw new Error("GRN is locked");
        if (grn.status === "CLOSED") throw new Error("GRN already closed");

        /* ====================================================
           2️⃣ CALCULATE DELTAS, INVENTORY & HISTORY
        ==================================================== */
        const grnItemDeltas: { id: string; delta: number }[] = [];
        const inventoryMap = new Map<string, { productId: string; locationId: string; qty: number }>();
        const historyRows: any[] = [];
        const poItemDeltas = new Map<string, number>();
        for (const entry of receiveItems) {
            if (entry.quantity <= 0) continue;

            const grnItem = grn.items.find(i => i.id === entry.grnItemId);
            if (!grnItem) continue;

            const expected = grnItem.quantityExpected ?? grnItem.poItem.quantity;
            const remainingForItem = expected - grnItem.quantityReceived;

            if (remainingForItem <= 0) continue;

            const receivable = Math.min(entry.quantity, remainingForItem);

            poItemDeltas.set(
                grnItem.poItemId,
                (poItemDeltas.get(grnItem.poItemId) ?? 0) + receivable
            );

            grnItemDeltas.push({ id: grnItem.id, delta: receivable });

            // Inventory map
            const invKey = `${grnItem.poItem.productId}|${grn.locationId}`;
            const inv = inventoryMap.get(invKey);
            inventoryMap.set(invKey, {
                productId: grnItem.poItem.productId,
                locationId: grn.locationId,
                qty: (inv?.qty ?? 0) + receivable,
            });

            // Inventory history
            historyRows.push({
                productId: grnItem.poItem.productId,
                locationId: grn.locationId,
                date: new Date(),
                delta: receivable,
                sourceType: "PURCHASE_RECEIPT",
                reference: grn.grnNumber,
                createdById: user.id,
                metadata: { grnId: grn.id, grnItemId: grnItem.id, poId: grn.poId },
            });
        }

        /* ====================================================
           3️⃣ CALCULATE PO ITEM TOTALS & PO STATUS
        ==================================================== */
        const poItems = await prisma.purchaseOrderItem.findMany({
            where: { purchaseOrderId: grn.poId },
        });


        const totalOrderedPo = poItems.reduce((s, i) => s + i.quantity, 0);
        const receivedDelta = [...poItemDeltas.values()].reduce((s, d) => s + d, 0);
        const totalNetReceivedPo =
            poItems.reduce((s, i) => s + (i.receivedQuantity - i.returnedQuantity), 0) + receivedDelta;

        let poStatus: PurchaseOrderStatus = "SENT";
        if (totalNetReceivedPo === 0) poStatus = "SENT";
        else if (totalNetReceivedPo < totalOrderedPo) poStatus = "PARTIALLY_RECEIVED";
        else poStatus = "RECEIVED";

        const fullyReceived = totalNetReceivedPo >= totalOrderedPo;

        const refreshedGrnItems = await prisma.gRNItem.findMany({
            where: { grnId: grn.id },
        });

        let receivedAny = false;
        let receivedAll = true;

        for (const item of refreshedGrnItems) {
            const expected = item.quantityExpected ?? 0;
            const delta =
                grnItemDeltas.find(d => d.id === item.id)?.delta ?? 0;

            const received = item.quantityReceived + delta;

            if (received > 0) receivedAny = true;
            if (received < expected) receivedAll = false;
        }

        let grnStatus: GRNStatus = "DRAFT";

        if (receivedAny && !receivedAll) grnStatus = "PARTIALLY_RECEIVED";
        if (receivedAll && refreshedGrnItems.length > 0) grnStatus = "RECEIVED";

        /* ====================================================
           4️⃣ EXECUTE TRANSACTIONS (CHUNKED FOR LARGE GRNs)
        ==================================================== */
        // 4a. Update GRN items, GRN status, PO items, PO status in one small transaction
        await prisma.$transaction(async tx => {
            if (grnItemDeltas.length) {
                const values = grnItemDeltas.map(d => `('${d.id}', ${d.delta})`).join(",");
                await tx.$executeRawUnsafe(`
          UPDATE "GRNItem" g
          SET "quantityReceived" = g."quantityReceived" + d.delta
          FROM (VALUES ${values}) AS d(id, delta)
          WHERE g.id = d.id
        `);
            }

            await tx.gRN.update({
                where: { id: grn.id },
                data: {
                    status: grnStatus,
                    locked: false
                },
            });

            for (const [poItemId, delta] of poItemDeltas.entries()) {
                await tx.purchaseOrderItem.update({
                    where: { id: poItemId },
                    data: {
                        receivedQuantity: {
                            increment: delta,
                        },
                    },
                });
            }
            await tx.purchaseOrder.update({
                where: { id: grn.poId },
                data: { status: poStatus },
            });
        });

        // 4b. Inventory upserts (concurrent, outside transaction)
        await Promise.all([...inventoryMap.values()].map(inv =>
            prisma.inventory.upsert({
                where: { productId_locationId: { productId: inv.productId, locationId: inv.locationId } },
                update: { quantity: { increment: inv.qty } },
                create: { productId: inv.productId, locationId: inv.locationId, quantity: inv.qty, lowStockAt: 0, createdById: user.id },
            })
        ));

        // 4c. Inventory history (concurrent)
        if (historyRows.length) {
            await prisma.inventoryHistory.createMany({ data: historyRows });
        }

        return NextResponse.json({ success: true, fullyReceived });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message ?? "Failed to receive GRN" },
            { status: 500 }
        );
    }
}
