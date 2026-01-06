// app/api/productions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

type Params = { params: { id: string } };

/* PUT /api/productions/:id */
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        // 1️⃣ Authenticate user
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const userId = user.id;

        // 2️⃣ Parse request
        const body = await req.json();
        const { batchNumber, items } = body;

        if (!batchNumber || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // 3️⃣ Transaction: update production and items
        const updatedProduction = await prisma.$transaction(async (tx) => {
            // Update batch number
            await tx.production.update({
                where: { id },
                data: { batchNumber, updatedAt: new Date() },
            });

            // Upsert items and track inventory changes
            for (const item of items) {
                if (item.id && item.id.startsWith("new-")) {
                    // Add new item
                    await tx.productionItem.create({
                        data: {
                            productionId: id,
                            productId: item.productId,
                            quantity: item.quantity,
                        },
                    });

                    // Update inventory
                    await tx.inventory.upsert({
                        where: { productId_locationId: { productId: item.productId, locationId: item.locationId } },
                        update: { quantity: { increment: item.quantity } },
                        create: {
                            productId: item.productId,
                            locationId: item.locationId,
                            quantity: item.quantity,
                            lowStockAt: 0,
                            createdById: userId,
                        },
                    });
                } else if (item.id) {
                    // Update existing item
                    const existing = await tx.productionItem.findUnique({ where: { id: item.id } });
                    if (!existing) throw new Error("Production item not found");

                    const diff = item.quantity - existing.quantity;

                    await tx.productionItem.update({
                        where: { id: item.id },
                        data: { quantity: item.quantity },
                    });

                    // Adjust inventory based on quantity difference
                    if (diff !== 0) {
                        await tx.inventory.update({
                            where: { productId_locationId: { productId: existing.productId, locationId: item.locationId } },
                            data: { quantity: { increment: diff } },
                        });
                    }
                }
            }

            // Remove items that are no longer present
            const existingItemIds = (await tx.productionItem.findMany({ where: { productionId: id }, select: { id: true } }))
                .map(i => i.id);
            const incomingItemIds = items.filter(i => i.id && !i.id.startsWith("new-")).map(i => i.id);
            const itemsToDelete = existingItemIds.filter(i => !incomingItemIds.includes(i));
            if (itemsToDelete.length > 0) {
                // Rollback inventory for deleted items
                for (const delId of itemsToDelete) {
                    const itemToDelete = await tx.productionItem.findUnique({ where: { id: delId } });
                    if (!itemToDelete) continue;

                    await tx.inventory.update({
                        where: { productId_locationId: { productId: itemToDelete.productId, locationId: itemToDelete.locationId } },
                        data: { quantity: { decrement: itemToDelete.quantity } },
                    });
                }
                await tx.productionItem.deleteMany({ where: { id: { in: itemsToDelete } } });
            }

            // Return updated production
            return tx.production.findUnique({
                where: { id },
                include: { items: { include: { product: true } }, location: true, createdBy: true },
            });
        });

        return NextResponse.json({ production: updatedProduction });
    } catch (err) {
        console.error("Update production failed:", err);
        return NextResponse.json({ error: "Failed to update production" }, { status: 500 });
    }
}

/* DELETE /api/productions/:id */
export async function DELETE(_: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        await prisma.$transaction(async (tx) => {
            const production = await tx.production.findUnique({
                where: { id },
                include: { items: true },
            });

            if (!production) throw new Error("Production not found");

            // Rollback inventory for each item
            for (const item of production.items) {
                await tx.inventory.update({
                    where: { productId_locationId: { productId: item.productId, locationId: item.locationId } },
                    data: { quantity: { decrement: item.quantity } },
                });
            }

            // Delete items and production
            await tx.productionItem.deleteMany({ where: { productionId: id } });
            await tx.production.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Delete production failed:", err);
        return NextResponse.json({ error: "Failed to delete production" }, { status: 500 });
    }
}
