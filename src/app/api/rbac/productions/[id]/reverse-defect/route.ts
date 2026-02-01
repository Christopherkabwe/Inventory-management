import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordInventoryTransaction } from "@/lib/inventory";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const defect = await prisma.productionDefect.findUnique({
        where: { id: id },
        include: { production: true },
    });

    if (!defect) return NextResponse.json({ error: "Defect not found" }, { status: 404 });

    if (defect.production.status === "LOCKED") {
        return NextResponse.json({ error: "Cannot reverse defect for locked production" }, { status: 400 });
    }

    // ================= TRANSACTION =================
    try {
        await prisma.$transaction(async (tx) => {
            // If defect was scrapped, rollback inventory
            if (defect.disposition === "SCRAPPED") {
                const inventory = await tx.inventory.findUnique({
                    where: {
                        productId_locationId: {
                            productId: defect.productId,
                            locationId: defect.production.locationId,
                        },
                    },
                });

                if (!inventory) {
                    throw new Error("Inventory record missing for rollback");
                }

                await tx.inventory.update({
                    where: {
                        productId_locationId: {
                            productId: defect.productId,
                            locationId: defect.production.locationId,
                        },
                    },
                    data: {
                        quantity: { increment: defect.quantity },
                    },
                });

                await recordInventoryTransaction({
                    productId: defect.productId,
                    locationId: defect.production.locationId,
                    delta: defect.quantity,
                    source: "REVERSED_PRODUCTION_DEFECT",
                    reference: defect.production.productionNo,
                    createdById: user.id,
                    productionDefectId: defect.id,
                    metadata: {
                        defectType: defect.defectType,
                        disposition: defect.disposition,
                        reason: "Reversal",
                    },
                });
            }

            // Delete defect record
            await tx.productionDefect.delete({
                where: { id: defect.id },
            });
        });

        return NextResponse.json({ success: true }, { status: 200 });
    } catch (err: any) {
        return NextResponse.json({ error: err.message || "Failed to reverse defect" }, { status: 500 });
    }
}
