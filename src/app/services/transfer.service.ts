// services/transfer.service.ts
import { prisma } from '@/lib/prisma';

export async function dispatchTransfer(transferId: string, transporterId: string, driverName: string, driverPhoneNumber: string) {
    await prisma.$transaction(async (tx) => {
        const transfer = await tx.transfer.update({
            where: { id: transferId },
            data: { status: 'DISPATCHED', transporterId, driverName, driverPhoneNumber },
            include: { items: true, fromLocation: true },
        });

        // Subtract quantity from source location
        for (const item of transfer.items) {
            await tx.inventory.update({
                where: {
                    productId_locationId: {
                        productId: item.productId,
                        locationId: transfer.fromLocationId,
                    },
                },
                data: {
                    quantity: {
                        decrement: item.quantity,
                    },
                },
            });
        }
    });
}

export async function receiveTransfer(transferId: string, receivedById: string, items: TransferReceiptItem[]) {
    await prisma.$transaction(async (tx) => {
        const transfer = await tx.transfer.update({
            where: { id: transferId },
            data: { status: 'RECEIVED' },
            include: { items: true, toLocation: true },
        });

        // Create transfer receipt
        await tx.transferReceipt.create({
            data: {
                transferId,
                receivedById,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantityReceived: item.quantityReceived,
                        quantityDamaged: item.quantityDamaged,
                        quantityExpired: item.quantityExpired,
                        comment: item.comment,
                    })),
                },
            },
        });

        // Add quantity to destination location
        for (const item of items) {
            await tx.inventory.upsert({
                where: {
                    productId_locationId: {
                        productId: item.productId,
                        locationId: transfer.toLocationId,
                    },
                },
                update: {
                    quantity: {
                        increment: item.quantityReceived,
                    },
                },
                create: {

                    productId: item.productId,
                    locationId: transfer.toLocationId,
                    quantity: item.quantityReceived,
                    lowStockAt: 0,
                },
            });
        }
    });
}