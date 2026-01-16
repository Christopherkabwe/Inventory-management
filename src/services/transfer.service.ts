// services/transfer.service.ts
import { prisma } from '@/lib/prisma';
import { updateInventoryHistory } from '@/lib/updateInventoryHistory';
import withRetries from '@/lib/retry';

type TransferReceiptItem = {
    productId: string;
    quantityReceived: number;
    quantityDamaged: number;
    quantityExpired: number;
    comment?: string;
};

export async function dispatchTransfer(
    transferId: string,
    transporterId: string,
    driverName: string,
    driverPhoneNumber: string
) {
    console.log(`[Service] Dispatching transfer ${transferId}`);

    return withRetries(async () => {
        await prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch the transfer first
            const transfer = await tx.transfer.findUnique({
                where: { id: transferId },
                include: { items: true, fromLocation: true, toLocation: true },
            });

            if (!transfer) throw new Error(`Transfer ${transferId} not found`);

            // 2️⃣ Update transfer status and transporter
            await tx.transfer.update({
                where: { id: transferId },
                data: {
                    status: 'DISPATCHED',
                    transporter: {
                        connect: { id: transporterId },
                        update: { driverName, driverPhoneNumber },
                    },
                },
            });

            console.log(`[Service] Transfer ${transferId} marked as DISPATCHED`);

            // 3️⃣ Subtract from source location inventory (sequentially to avoid locks)
            for (const item of transfer.items) {
                await tx.inventory.update({
                    where: {
                        productId_locationId: {
                            productId: item.productId,
                            locationId: transfer.fromLocationId,
                        },
                    },
                    data: {
                        quantity: { decrement: item.quantity },
                    },
                });

                // Update Inventory History
                await updateInventoryHistory(item.productId, transfer.fromLocationId, -item.quantity, new Date());

                console.log(`[Service] Subtracted ${item.quantity} of ${item.productId} from source location`);
            }

            // 4️⃣ Mark as in transit in destination location
            for (const item of transfer.items) {
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId: item.productId, locationId: transfer.toLocationId } },
                    create: {
                        productId: item.productId,
                        locationId: transfer.toLocationId,
                        quantity: 0,       // no actual stock yet
                        inTransit: item.quantity, // mark as in transit
                        lowStockAt: 0,
                        createdById: transfer.createdById,
                    },
                    update: {
                        inTransit: { increment: item.quantity },
                    },
                });

                await updateInventoryHistory(item.productId, transfer.toLocationId, 0, new Date());
                console.log(`[Service] Marked ${item.quantity} of ${item.productId} as in transit`);
            }
        }, { timeout: 120000 });
    }, 3, 100);
}

export async function receiveTransfer(
    transferId: string,
    receivedById: string,
    items: TransferReceiptItem[]
) {
    if (!items || items.length === 0) throw new Error('No items provided for receipt');
    console.log(`[Service] Receiving transfer ${transferId} by user ${receivedById}`);

    return withRetries(async () => {
        await prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch transfer
            const transfer = await tx.transfer.findUnique({
                where: { id: transferId },
                include: { items: true, toLocation: true },
            });
            if (!transfer) throw new Error(`Transfer ${transferId} not found`);
            if (!transfer.toLocationId) throw new Error(`Transfer ${transferId} has no destination location`);

            const toLocationId = transfer.toLocationId;

            // 2️⃣ Update transfer status
            await tx.transfer.update({ where: { id: transferId }, data: { status: 'RECEIVED' } });
            console.log(`[Service] Transfer ${transferId} marked as RECEIVED`);

            // 3️⃣ Check if receipt already exists
            const existingReceipt = await tx.transferReceipt.findUnique({ where: { transferId } });
            if (existingReceipt) throw new Error(`Transfer ${transferId} already received`);

            // 4️⃣ Create transfer receipt
            await tx.transferReceipt.create({
                data: {
                    transferId,
                    receivedById,
                    items: {
                        create: items.map((i) => ({
                            productId: i.productId,
                            quantityReceived: i.quantityReceived,
                            quantityDamaged: i.quantityDamaged,
                            quantityExpired: i.quantityExpired,
                            comment: i.comment || null,
                        })),
                    },
                },
            });
            console.log(`[Service] Transfer receipt created for ${transferId}`);

            // 5️⃣ Update or create inventory sequentially
            for (const item of items) {
                const inv = await tx.inventory.findUnique({
                    where: { productId_locationId: { productId: item.productId, locationId: toLocationId } },
                });

                if (inv) {
                    await tx.inventory.update({
                        where: { productId_locationId: { productId: item.productId, locationId: toLocationId } },
                        data: {
                            quantity: { increment: item.quantityReceived },
                            inTransit: { decrement: item.quantityReceived }, // subtract from transit
                        },
                    });

                    // Update Inventory History
                    await updateInventoryHistory(item.productId, toLocationId, item.quantityReceived, new Date());

                    console.log(`[Service] Updated inventory for ${item.productId}`);

                } else {
                    await tx.inventory.create({
                        data: {
                            productId: item.productId,
                            locationId: toLocationId,
                            quantity: item.quantityReceived,
                            inTransit: 0,
                            lowStockAt: 0,
                            createdById: receivedById,
                        },
                    });

                    // New productId added to  Inventory History
                    await updateInventoryHistory(item.productId, toLocationId, item.quantityReceived, new Date());

                    console.log(`[Service] Created inventory for ${item.productId}`);
                }
            }
        }, { timeout: 120000 }); // longer timeout for safety
    }, 3, 100); // retries + delay
}