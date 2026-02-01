import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { recordInventoryTransaction } from "@/lib/inventory"; // ✅ use Option A

interface Params {
    params: { id: string };
}

export async function GET(
    _req: Request,
    context: { params: { id: string } }
) {
    try {
        const { id } = await context.params;

        const production = await prisma.production.findUnique({
            where: { id },
            include: {
                location: true,
                createdBy: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                defects: {
                    include: {
                        product: true,
                        recordedBy: true,
                    },
                },
            },
        });

        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(production);
    } catch (error) {
        console.error("GET production error:", error);
        return NextResponse.json(
            { error: "Failed to fetch production" },
            { status: 500 }
        );
    }
}
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { notes, items } = await req.json();

        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "At least one item is required" },
                { status: 400 }
            );
        }

        const safeItems = items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
        }));

        if (safeItems.some(i => !i.productId || i.quantity <= 0)) {
            return NextResponse.json(
                { error: "Invalid product or quantity" },
                { status: 400 }
            );
        }

        const production = await prisma.production.findUnique({
            where: { id },
            include: { items: true },
        });

        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }

        /* ===============================
           1️⃣ TRANSACTION (DATA + INVENTORY ONLY)
           =============================== */
        const updatedProduction = await prisma.$transaction(async (tx) => {
            // Rollback old inventory
            for (const item of production.items) {
                await tx.inventory.updateMany({
                    where: {
                        productId: item.productId,
                        locationId: production.locationId,
                    },
                    data: {
                        quantity: { decrement: item.quantity },
                    },
                });
            }

            // Update production + replace items
            const prod = await tx.production.update({
                where: { id },
                data: {
                    notes,
                    items: {
                        deleteMany: {},
                        create: safeItems,
                    },
                },
                include: {
                    items: true,
                    location: true,
                    createdBy: true,
                },
            });

            // Apply new inventory
            for (const item of safeItems) {
                await tx.inventory.upsert({
                    where: {
                        productId_locationId: {
                            productId: item.productId,
                            locationId: production.locationId,
                        },
                    },
                    update: {
                        quantity: { increment: item.quantity },
                    },
                    create: {
                        productId: item.productId,
                        locationId: production.locationId,
                        quantity: item.quantity,
                        lowStockAt: 10,
                        createdById: user.id,
                    },
                });
            }

            return prod;
        });

        /* ===============================
           2️⃣ INVENTORY HISTORY (AFTER COMMIT)
           =============================== */

        // Old items rollback history
        for (const item of production.items) {
            await recordInventoryTransaction({
                productId: item.productId,
                locationId: production.locationId,
                delta: -item.quantity,
                source: "PRODUCTION",
                reference: production.productionNo,
                createdById: user.id,
                metadata: { oldQuantity: item.quantity },
            });
        }

        // New items applied history
        for (const item of safeItems) {
            await recordInventoryTransaction({
                productId: item.productId,
                locationId: production.locationId,
                delta: item.quantity,
                source: "PRODUCTION",
                reference: updatedProduction.productionNo,
                createdById: user.id,
                metadata: { notes },
            });
        }

        return NextResponse.json({ data: updatedProduction });

    } catch (error: any) {
        console.error("🔥 PUT production FAILED", error);
        return NextResponse.json(
            { error: error.message ?? "Failed to update production" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const productionId = id;
        const production = await prisma.production.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });

        await prisma.$transaction(async (tx) => {
            // Rollback inventory
            for (const item of production.items) {
                await tx.inventory.updateMany({
                    where: { productId: item.productId, locationId: production.locationId },
                    data: { quantity: { decrement: item.quantity } },
                });

                await recordInventoryTransaction({
                    tx,
                    productId: item.productId,
                    locationId: production.locationId,
                    delta: -item.quantity,
                    source: "PRODUCTION",
                    reference: production.productionNo,
                    createdById: user.id,
                    metadata: {},
                });
            }

            // Delete production
            await tx.production.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE production error:", error);
        return NextResponse.json({ error: "Failed to delete production" }, { status: 500 });
    }
}
