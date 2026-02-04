import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const user = await getCurrentUser();

        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: {
                po: true,
                items: {
                    include: {
                        poItem: {
                            include: {
                                product: true,
                                purchaseOrder: true
                            }
                        }
                    }
                }
            }
        });

        if (!grn) {
            return NextResponse.json({ error: "GRN not found" }, { status: 404 });
        }

        if (grn.status === "RECEIVED") {
            return NextResponse.json({ error: "GRN already received" }, { status: 400 });
        }

        await prisma.$transaction(async (tx) => {

            for (const item of grn.items) {

                const productId = item.poItem.productId;
                const locationId = grn.po.locationId;
                const qty = item.quantityReceived;

                // ---------------------
                // 1️⃣ Update inventory
                // ---------------------

                const existing = await tx.inventory.findUnique({
                    where: {
                        productId_locationId: {
                            productId,
                            locationId
                        }
                    }
                });

                if (existing) {
                    await tx.inventory.update({
                        where: { id: existing.id },
                        data: {
                            quantity: { increment: qty }
                        }
                    });
                } else {
                    await tx.inventory.create({
                        data: {
                            productId,
                            locationId,
                            quantity: qty,
                            lowStockAt: 0,
                            createdById: user.id
                        }
                    });
                }

                // ---------------------
                // 2️⃣ Inventory History
                // ---------------------

                await tx.inventoryHistory.create({
                    data: {
                        productId,
                        locationId,
                        date: new Date(),
                        delta: qty,
                        sourceType: "PURCHASE_RECEIPT",
                        reference: grn.grnNumber,
                        createdById: user.id,
                        metadata: {
                            grnId: grn.id
                        }
                    }
                });
            }

            // ---------------------
            // 3️⃣ Update GRN status
            // ---------------------

            await tx.gRN.update({
                where: { id },
                data: { status: "RECEIVED" }
            });

            // ---------------------
            // 4️⃣ Update PO Status
            // ---------------------

            await tx.purchaseOrder.update({
                where: { id: grn.poId },
                data: { status: "RECEIVED" }
            });

        });

        return NextResponse.json({ success: true });

    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to receive GRN" }, { status: 500 });
    }
}
