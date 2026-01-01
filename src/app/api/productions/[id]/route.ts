import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

/* PUT /api/productions/:id */
export async function PUT(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const body = await req.json();
        const { batchNumber, items } = body;

        if (!batchNumber || !Array.isArray(items)) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const updatedProduction = await prisma.$transaction(async (tx) => {
            // Update batch number
            await tx.production.update({
                where: { id },
                data: { batchNumber },
            });

            // Upsert items
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
                } else if (item.id) {
                    // Upsert existing item
                    await tx.productionItem.upsert({
                        where: { id: item.id },
                        update: { quantity: item.quantity },
                        create: { productionId: id, productId: item.productId, quantity: item.quantity },
                    });
                }
            }


            // Remove items that are no longer present
            const existingItemIds = (
                await tx.productionItem.findMany({ where: { productionId: id }, select: { id: true } })
            ).map(i => i.id);

            const incomingItemIds = items.filter(i => i.id && !i.id.startsWith("new-")).map(i => i.id);

            const itemsToDelete = existingItemIds.filter(id => !incomingItemIds.includes(id));
            if (itemsToDelete.length > 0) {
                await tx.productionItem.deleteMany({ where: { id: { in: itemsToDelete } } });
            }

            // Return updated production with items and product info
            return tx.production.findUnique({
                where: { id },
                include: { items: { include: { product: true } } },
            });
        });

        return NextResponse.json({ production: updatedProduction });
    } catch (err) {
        console.error("Update production failed:", err);
        return NextResponse.json({ error: "Failed to update production" }, { status: 500 });
    }
}

/* DELETE /api/productions/:id */
export async function DELETE(_: Request, { params }: Params) {
    const { id } = params;

    try {
        await prisma.$transaction(async (tx) => {
            const production = await tx.production.findUnique({
                where: { id },
                include: { items: true },
            });

            if (!production) throw new Error("Production not found");

            // Rollback inventory for each item
            for (const item of production.items) {
                const inventory = await tx.inventory.findFirst({
                    where: { productId: item.productId },
                    orderBy: { createdAt: "desc" },
                });

                if (!inventory) throw new Error(`Inventory not found for product ${item.productId}`);
                if (inventory.quantity < item.quantity) throw new Error("Insufficient inventory to rollback");

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { decrement: item.quantity } },
                });
            }

            // Delete production items and production
            await tx.productionItem.deleteMany({ where: { productionId: id } });
            await tx.production.delete({ where: { id } });
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error("Delete production failed:", err);
        return NextResponse.json({ error: "Failed to delete production" }, { status: 500 });
    }
}
