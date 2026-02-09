// /api/grn/[id]/returns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    const grnId = id;

    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const body = await req.json();
        const items: { grnItemId: string; quantity: number }[] = body.items ?? [];

        if (!items.length)
            return NextResponse.json(
                { error: "No return items provided" },
                { status: 400 }
            );

        /* ----------------------------------------------------
           Load GRN + Items (OUTSIDE transaction)
        ---------------------------------------------------- */
        const grn = await prisma.gRN.findUnique({
            where: { id: grnId },
            include: {
                items: {
                    include: {
                        poItem: true
                    }
                }
            }
        });

        if (!grn) throw new Error("GRN not found");
        if (grn.locked || grn.status === "CLOSED")
            throw new Error("GRN is locked");

        /* ----------------------------------------------------
           Validate quantities
        ---------------------------------------------------- */
        for (const item of items) {
            const grnItem = grn.items.find(i => i.id === item.grnItemId);
            if (!grnItem) throw new Error("Invalid GRN item");

            if (item.quantity <= 0)
                throw new Error("Return quantity must be greater than zero");

            const maxReturnable =
                grnItem.quantityReceived - grnItem.returnedQuantity;

            if (item.quantity > maxReturnable) {
                throw new Error(
                    `Cannot return ${item.quantity}. Max allowed is ${maxReturnable}`
                );
            }
        }

        /* ----------------------------------------------------
           Prepare batch operations
        ---------------------------------------------------- */
        const inventoryOps: any[] = [];
        const grnItemOps: any[] = [];
        const historyRows: any[] = [];
        const poItemOps: any[] = [];

        for (const item of items) {
            const grnItem = grn.items.find(i => i.id === item.grnItemId)!;
            const qty = item.quantity;

            // decrement inventory
            inventoryOps.push(
                prisma.inventory.update({
                    where: {
                        productId_locationId: {
                            productId: grnItem.poItem.productId,
                            locationId: grn.locationId
                        }
                    },
                    data: {
                        quantity: { decrement: qty }
                    }
                })
            );

            // increment returned quantity
            grnItemOps.push(
                prisma.gRNItem.update({
                    where: { id: grnItem.id },
                    data: {
                        returnedQuantity: { increment: qty }
                    }
                }),
            );
            // increment returned quantity on PurchaseOrderItem
            poItemOps.push(
                prisma.purchaseOrderItem.update({
                    where: { id: grnItem.poItemId },
                    data: {
                        returnedQuantity: { increment: qty }
                    }
                })
            );

            // inventory history
            historyRows.push({
                productId: grnItem.poItem.productId,
                locationId: grn.locationId,
                date: new Date(),
                delta: -qty,
                sourceType: "PURCHASE_RETURN",
                reference: `SUPPLIER_RETURN-${grn.grnNumber}`,
                createdById: user.id,
                metadata: {
                    grnId: grn.id,
                    grnItemId: grnItem.id
                }
            });
        }

        /* ----------------------------------------------------
           Commit transaction
        ---------------------------------------------------- */
        await prisma.$transaction([
            prisma.supplierReturn.create({
                data: {
                    returnNo: `RTV-${Date.now()}`,
                    grnId: grn.id,
                    reason: body.reason ?? null,
                    createdById: user.id,
                    items: {
                        create: items.map(i => ({
                            grnItemId: i.grnItemId,
                            quantity: i.quantity
                        }))
                    }
                }
            }),

            ...grnItemOps,
            ...poItemOps,
            ...inventoryOps,

            prisma.inventoryHistory.createMany({
                data: historyRows
            })
        ]);

        /* ----------------------------------------------------
   Recalculate PO status after return
---------------------------------------------------- */

        const poItems = await prisma.purchaseOrderItem.findMany({
            where: { purchaseOrderId: grn.poId }
        });

        const totalOrdered = poItems.reduce((s, i) => s + i.quantity, 0);

        const totalEffectiveReceived = poItems.reduce(
            (s, i) => s + (i.receivedQuantity - i.returnedQuantity),
            0
        );

        let newStatus: "SENT" | "PARTIALLY_RECEIVED" | "RECEIVED" = "SENT";

        if (totalEffectiveReceived === 0) {
            newStatus = "SENT";
        } else if (totalEffectiveReceived < totalOrdered) {
            newStatus = "PARTIALLY_RECEIVED";
        } else {
            newStatus = "RECEIVED";
        }

        await prisma.purchaseOrder.update({
            where: { id: grn.poId },
            data: { status: newStatus }
        });

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message ?? "Failed to process supplier return" },
            { status: 500 }
        );
    }
}
