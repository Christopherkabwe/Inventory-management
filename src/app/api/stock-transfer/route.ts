import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { productId, fromLocationId, toLocationId, quantity, createdBy, reason } = await req.json();

        if (!productId || !fromLocationId || !toLocationId || quantity <= 0) {
            return NextResponse.json({ error: 'Invalid transfer data' }, { status: 400 });
        }

        if (fromLocationId === toLocationId) {
            return NextResponse.json({ error: 'Cannot transfer to the same location' }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // ✅ Get source inventory
            const fromInventory = await tx.inventory.findUnique({
                where: { productId_locationId: { productId, locationId: fromLocationId } },
            });
            if (!fromInventory || fromInventory.quantity < quantity) {
                throw new Error('Insufficient stock at source location');
            }

            // ✅ Get or create destination inventory
            let toInventory = await tx.inventory.findUnique({
                where: { productId_locationId: { productId, locationId: toLocationId } },
            });
            if (!toInventory) {
                toInventory = await tx.inventory.create({
                    data: {
                        productId,
                        locationId: toLocationId,
                        quantity: 0,
                        lowStockAt: 0,
                        createdBy: createdBy || 'system',
                    },
                });
            }

            // ✅ Update quantities
            const updatedFromInventory = await tx.inventory.update({
                where: { id: fromInventory.id },
                data: { quantity: { decrement: quantity } },
            });

            const updatedToInventory = await tx.inventory.update({
                where: { id: toInventory.id },
                data: { quantity: { increment: quantity } },
            });

            // ✅ Log stock movements
            await tx.stockMovement.createMany({
                data: [
                    {
                        inventoryId: fromInventory.id,
                        type: 'TRANSFER_OUT',
                        quantity,
                        openingStock: fromInventory.quantity,
                        closingStock: updatedFromInventory.quantity,
                        fromLocationId,
                        toLocationId,
                        reason: reason || null,
                        createdBy: createdBy || 'system',
                    },
                    {
                        inventoryId: toInventory.id,
                        type: 'TRANSFER_IN',
                        quantity,
                        openingStock: toInventory.quantity,
                        closingStock: updatedToInventory.quantity,
                        fromLocationId,
                        toLocationId,
                        reason: reason || null,
                        createdBy: createdBy || 'system',
                    },
                ],
            });

            return { success: true };
        });

        return NextResponse.json(result);
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message || 'Stock transfer failed' }, { status: 500 });
    }
}
