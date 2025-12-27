import { PrismaClient, StockMovementType } from '../generated/prisma';

const prisma = new PrismaClient();

type MovementType =
    | 'RECEIPT'
    | 'SALE'
    | 'TRANSFER_IN'
    | 'TRANSFER_OUT'
    | 'RETURN'
    | 'DAMAGED'
    | 'REBAG_GAIN'
    | 'REBAG_LOSS'
    | 'EXPIRED'
    | 'ADJUSTMENT';

interface StockMovementInput {
    inventoryId: string;
    type: MovementType;
    quantity: number;
    createdBy: string;
    saleId?: string;
    customerId?: string;
    fromLocationId?: string;
    toLocationId?: string;
    reason?: string;
    physicalStock?: number; // optional, for stocktake
}

export async function logStockMovement(input: StockMovementInput) {
    const inventory = await prisma.inventory.findUnique({
        where: { id: input.inventoryId },
    });

    if (!inventory) throw new Error('Inventory not found');

    let newQuantity = inventory.quantity;

    // Adjust quantity based on movement type
    switch (input.type) {
        case 'RECEIPT':
        case 'TRANSFER_IN':
        case 'RETURN':
        case 'REBAG_GAIN':
            newQuantity += input.quantity;
            break;

        case 'SALE':
        case 'TRANSFER_OUT':
        case 'DAMAGED':
        case 'REBAG_LOSS':
        case 'EXPIRED':
        case 'ADJUSTMENT':
            newQuantity -= input.quantity;
            break;

        default:
            throw new Error('Invalid movement type');
    }

    // Create StockMovement record
    const movement = await prisma.stockMovement.create({
        data: {
            inventoryId: input.inventoryId,
            type: input.type,
            quantity: input.quantity,
            openingStock: inventory.quantity,
            closingStock: newQuantity,
            physicalStock: input.physicalStock ?? null,
            createdBy: input.createdBy,
            saleId: input.saleId,
            customerId: input.customerId,
            fromLocationId: input.fromLocationId,
            toLocationId: input.toLocationId,
            reason: input.reason,
        },
    });

    // Update Inventory quantity
    await prisma.inventory.update({
        where: { id: inventory.id },
        data: { quantity: newQuantity },
    });

    return movement;
}
