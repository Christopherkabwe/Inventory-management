import { prisma } from './prisma';

export async function getStockReport({ startDate, endDate }: { startDate?: Date; endDate?: Date }) {
    const stockMovements = await prisma.stockMovement.findMany({
        where: {
            createdAt: {
                gte: startDate,
                lte: endDate,
            },
        },
        include: {
            inventory: {
                include: { product: true, location: true },
            },
            sale: true,
            customer: true,
            fromLocation: true,
            toLocation: true,
        },
        orderBy: { createdAt: 'asc' },
    });

    const report: Record<string, any> = {};

    for (const move of stockMovements) {
        const key = `${move.inventory.product.id}-${move.inventory.location.id}`;
        if (!report[key]) {
            report[key] = {
                productId: move.inventory.product.id,
                productName: move.inventory.product.name,
                locationId: move.inventory.location.id,
                locationName: move.inventory.location.name,
                openingStock: 0,
                receipts: 0,
                sales: 0,
                transfersIn: 0,
                transfersOut: 0,
                returns: 0,
                damaged: 0,
                expired: 0,
                rebagGain: 0,
                rebagLoss: 0,
                closingStock: 0,
            };
        }

        const r = report[key];

        // Set openingStock from first movement if null
        if (!r.openingStock && move.openingStock !== null) r.openingStock = move.openingStock;

        switch (move.type) {
            case 'RECEIPT': r.receipts += move.quantity; break;
            case 'SALE': r.sales += move.quantity; break;
            case 'TRANSFER_IN': r.transfersIn += move.quantity; break;
            case 'TRANSFER_OUT': r.transfersOut += move.quantity; break;
            case 'RETURN': r.returns += move.quantity; break;
            case 'DAMAGED': r.damaged += move.quantity; break;
            case 'EXPIRED': r.expired += move.quantity; break;
            case 'REBAG_GAIN': r.rebagGain += move.quantity; break;
            case 'REBAG_LOSS': r.rebagLoss += move.quantity; break;
        }

        // Last movement closingStock
        if (move.closingStock !== null) r.closingStock = move.closingStock;
    }

    return Object.values(report);
}
