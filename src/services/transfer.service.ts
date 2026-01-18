// services/transfer.service.ts
import { prisma } from '@/lib/prisma';
import withRetries from '@/lib/retry';

type TransferReceiptItem = {
    productId: string;
    quantityReceived: number;
    quantityDamaged: number;
    quantityExpired: number;
    comment?: string;
};

interface RecordInventoryParams {
    productId: string;
    locationId: string;
    delta: number;
    source: string;
    reference: string;
    createdById: string;
    metadata?: Record<string, any>;
}

/**
 * Option A unified inventory recording
 */
async function recordInventoryTransaction(params: RecordInventoryParams) {
    const { productId, locationId, delta, source, reference, createdById, metadata } = params;

    // Build the data object
    const data: any = {
        productId,
        locationId,
        date: new Date(),
        reference,
        createdById,
    };

    if (source === 'TRANSFER_IN_TRANSIT') {
        data.inTransitDelta = delta;
        data.delta = 0;
    } else {
        data.delta = delta;
    }

    if (source === 'TRANSFER_IN') {
        data.sourceType = 'TRANSFER_IN';
        data.transferReceiptItemId = null; // Replace null with actual relation if needed
    } else if (source === 'TRANSFER_OUT') {
        data.sourceType = 'TRANSFER_OUT';
    } else if (source === 'TRANSFER_IN_TRANSIT') {
        data.sourceType = 'TRANSFER_IN_TRANSIT';
    } else if (source === 'TRANSFER_DAMAGED') {
        data.sourceType = 'TRANSFER_DAMAGED';
    } else if (source === 'TRANSFER_EXPIRED') {
        data.sourceType = 'TRANSFER_EXPIRED';
    }

    // Include metadata if provided
    if (metadata) {
        data.metadata = metadata; // Ensure your Prisma schema has `metadata Json?`
    }

    await prisma.inventoryHistory.create({ data });
}


/**
 * Dispatch a transfer: subtract stock from source, mark in transit
 */
export async function dispatchTransfer(
    transferId: string,
    transporterId: string,
    driverName: string,
    driverPhoneNumber: string
) {
    console.log(`[Service] Dispatching transfer ${transferId}`);

    return withRetries(async () => {
        await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({
                where: { id: transferId },
                include: { items: true, fromLocation: true, toLocation: true },

            });

            if (!transfer) throw new Error(`Transfer ${transferId} not found`);

            // Update transfer status and transporter info
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

            // Subtract stock from source location and record TRANSFER_OUT
            for (const item of transfer.items) {
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId: item.productId, locationId: transfer.fromLocationId } },
                    update: { quantity: { decrement: item.quantity } },
                    create: { productId: item.productId, locationId: transfer.fromLocationId, quantity: 0, lowStockAt: 0, createdById: transfer.createdById, inTransit: 0 }
                });

                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId: transfer.fromLocationId,
                    delta: -item.quantity,
                    source: 'TRANSFER_OUT',
                    reference: `TRANSFER-${transfer.ibtNumber}`,
                    createdById: transfer.createdById,
                });
            }
            // Mark stock as in transit at destination and record TRANSFER_IN_TRANSIT
            for (const item of transfer.items) {
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId: item.productId, locationId: transfer.toLocationId } },
                    create: {
                        productId: item.productId,
                        locationId: transfer.toLocationId,
                        quantity: 0,
                        inTransit: item.quantity,
                        lowStockAt: 0,
                        createdById: transfer.createdById,
                    },
                    update: {
                        inTransit: { increment: item.quantity },
                    },
                });

                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId: transfer.toLocationId,
                    delta: 0, // in-transit does not change actual stock
                    source: 'TRANSFER_IN_TRANSIT',
                    reference: `TRANSFER-${transfer.ibtNumber}`,
                    createdById: transfer.createdById,
                });
            }
        }, { timeout: 120000 });
    }, 3, 100);
}

/** 
 * Receive a transfer: update inventory, record received, damaged, expired
 */
export async function receiveTransfer(
    transferId: string,
    receivedById: string,
    items: TransferReceiptItem[]
) {
    if (!items || items.length === 0) throw new Error('No items provided for receipt');
    return withRetries(async () => {
        await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({
                where: { id: transferId },
                include: { items: true, toLocation: true },
            });
            if (!transfer) throw new Error(`Transfer ${transferId} not found`);
            if (!transfer.toLocationId) throw new Error(`Transfer ${transferId} has no destination`);
            const toLocationId = transfer.toLocationId;

            // Update transfer status
            await tx.transfer.update({
                where: { id: transferId },
                data: { status: 'RECEIVED' }
            });

            // Ensure no existing receipt
            const existingReceipt = await tx.transferReceipt.findUnique({ where: { transferId } });
            if (existingReceipt) throw new Error(`Transfer ${transferId} already received`);

            // Create transfer receipt
            const receipt = await tx.transferReceipt.create({
                data: {
                    transferId,
                    receivedById,
                    items: {
                        create: items.map(i => ({
                            productId: i.productId,
                            quantityReceived: i.quantityReceived,
                            quantityDamaged: i.quantityDamaged,
                            quantityExpired: i.quantityExpired,
                            comment: i.comment || null,
                        }))
                    },
                },
                include: { items: true },
            });

            // Update inventory and record history
            for (const item of items) {
                const receiptItem = receipt.items.find(i => i.productId === item.productId);
                if (!receiptItem) throw new Error(`Receipt item not found for product ${item.productId}`);

                await tx.inventory.upsert({
                    where: { productId_locationId: { productId: item.productId, locationId: toLocationId } },
                    create: {
                        productId: item.productId,
                        locationId: toLocationId,
                        quantity: item.quantityReceived,
                        inTransit: 0,
                        lowStockAt: 0,
                        createdById: receivedById,
                    },
                    update: {
                        quantity: { increment: item.quantityReceived },
                        inTransit: { decrement: item.quantityReceived },
                    },
                });

                // Record received
                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId: toLocationId,
                    delta: item.quantityReceived,
                    source: 'TRANSFER_IN',
                    reference: `TRANSFER-${transfer.ibtNumber}`,
                    createdById: receivedById,
                    transferReceiptItemId: receiptItem.id,
                });

                // Record damaged
                if (item.quantityDamaged > 0) {
                    await recordInventoryTransaction({
                        productId: item.productId,
                        locationId: toLocationId,
                        delta: 0,
                        source: 'TRANSFER_DAMAGED',
                        reference: `TRANSFER-${transfer.ibtNumber}`,
                        createdById: receivedById,
                        metadata: { quantityDamaged: item.quantityDamaged },
                        transferReceiptItemId: receiptItem.id,
                    });
                }

                // Record expired
                if (item.quantityExpired > 0) {
                    await recordInventoryTransaction({
                        productId: item.productId,
                        locationId: toLocationId,
                        delta: 0,
                        source: 'TRANSFER_EXPIRED',
                        reference: `TRANSFER-${transfer.ibtNumber}`,
                        createdById: receivedById,
                        metadata: { quantityExpired: item.quantityExpired },
                        transferReceiptItemId: receiptItem.id,
                    });
                }
            }
        }, { timeout: 120000 });
    }, 3, 100);
}