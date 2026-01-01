import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// -------------------- UPDATE TRANSFER --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const { fromLocationId, toLocationId, transporterId, items, updatedBy } = await req.json();

        if (!fromLocationId || !toLocationId || !items?.length || !updatedBy) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedTransfer = await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true } });
            if (!transfer) throw new Error("Transfer not found");

            const oldMap = new Map(transfer.items.map(i => [i.productId, i.quantity]));
            const newMap = new Map(items.map((i: any) => [i.productId, i.quantity]));
            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;

                const sourceInventory = await tx.inventory.findFirst({ where: { productId, locationId: fromLocationId } });
                if (!sourceInventory) throw new Error(`Source inventory not found for ${productId}`);
                if (delta > 0 && sourceInventory.quantity < delta) throw new Error(`Insufficient stock at source for ${productId}`);

                const destInventory = await tx.inventory.findFirst({ where: { productId, locationId: toLocationId } });

                // Update inventories
                await tx.inventory.update({ where: { id: sourceInventory.id }, data: { quantity: { decrement: delta } } });
                if (destInventory) {
                    await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { increment: delta } } });
                } else if (delta !== 0) {
                    await tx.inventory.create({ data: { productId, locationId: toLocationId, quantity: delta, lowStockAt: 0, createdBy: updatedBy } });
                }
            }

            await tx.transferItem.deleteMany({ where: { transferId: id } });
            for (const item of items) {
                await tx.transferItem.create({ data: { transferId: id, productId: item.productId, quantity: item.quantity } });
            }

            return tx.transfer.update({
                where: { id },
                data: { fromLocationId, toLocationId, transporterId },
                include: { items: { include: { product: true } }, fromLocation: true, toLocation: true, transporter: true },
            });
        });

        return NextResponse.json(updatedTransfer);
    } catch (error) {
        console.error("Update transfer failed:", error);
        return NextResponse.json({ error: "Failed to update transfer", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE TRANSFER --------------------
export async function DELETE(_: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true } });
            if (!transfer) throw new Error("Transfer not found");

            for (const item of transfer.items) {
                const sourceInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.fromLocationId } });
                if (!sourceInventory) throw new Error(`Source inventory not found for ${item.productId}`);
                await tx.inventory.update({ where: { id: sourceInventory.id }, data: { quantity: { increment: item.quantity } } });

                const destInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.toLocationId } });
                if (!destInventory || destInventory.quantity < item.quantity) throw new Error(`Destination inventory insufficient for ${item.productId}`);
                await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { decrement: item.quantity } } });
            }

            await tx.transferItem.deleteMany({ where: { transferId: id } });
            await tx.transfer.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Transfer deleted" });
    } catch (error) {
        console.error("Delete transfer failed:", error);
        return NextResponse.json({ error: "Failed to delete transfer", details: (error as Error).message }, { status: 500 });
    }
}
