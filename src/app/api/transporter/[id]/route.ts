import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------- PUT /api/transfers/:id --------------------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const { fromLocationId, toLocationId, transporterId, items, createdBy } = await req.json();

        if (!fromLocationId || !toLocationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true } });
            if (!transfer) throw new Error("Transfer not found");

            // Map old vs new for inventory adjustment
            const oldMap = new Map(transfer.items.map((i) => [i.productId, i.quantity]));
            const newMap = new Map(items.map((i: any) => [i.productId, i.quantity]));
            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;

                // Adjust source inventory
                const srcInventory = await tx.inventory.findFirst({ where: { productId, locationId: fromLocationId } });
                if (!srcInventory || srcInventory.quantity < delta) throw new Error(`Insufficient stock for product ${productId}`);
                await tx.inventory.update({ where: { id: srcInventory.id }, data: { quantity: { decrement: delta } } });

                // Adjust destination inventory
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId, locationId: toLocationId } },
                    update: { quantity: { increment: delta } },
                    create: { productId, locationId: toLocationId, quantity: delta, lowStockAt: 0, createdBy },
                });
            }

            // Delete old TransferItems and create new ones
            await tx.transferItem.deleteMany({ where: { transferId: id } });
            for (const item of items) {
                await tx.transferItem.create({
                    data: { transferId: id, productId: item.productId, quantity: item.quantity },
                });
            }

            return tx.transfer.update({
                where: { id },
                data: { fromLocationId, toLocationId, transporterId },
                include: { items: true },
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Update transfer failed:", error);
        return NextResponse.json({ error: "Failed to update transfer" }, { status: 500 });
    }
}

// -------------------- DELETE /api/transfers/:id --------------------
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true } });
            if (!transfer) throw new Error("Transfer not found");

            // Rollback inventories
            for (const item of transfer.items) {
                const srcInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.fromLocationId } });
                const destInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.toLocationId } });

                if (!destInventory || destInventory.quantity < item.quantity) throw new Error(`Insufficient stock to rollback product ${item.productId}`);

                // Restore source
                await tx.inventory.update({ where: { id: srcInventory?.id }, data: { quantity: { increment: item.quantity } } });

                // Reduce destination
                await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { decrement: item.quantity } } });
            }

            await tx.transferItem.deleteMany({ where: { transferId: id } });
            await tx.transfer.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Transfer deleted" });
    } catch (error) {
        console.error("Delete transfer failed:", error);
        return NextResponse.json({ error: "Failed to delete transfer" }, { status: 500 });
    }
}
