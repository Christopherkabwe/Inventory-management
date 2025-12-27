import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const startDateParam = url.searchParams.get('startDate'); // e.g., "2025-12-24"
        const endDateParam = url.searchParams.get('endDate');     // e.g., "2025-12-25"

        const startDate = startDateParam ? new Date(startDateParam) : null;
        const endDate = endDateParam ? new Date(endDateParam) : null;

        // 1️⃣ Get all movements, ordered chronologically
        const movements = await prisma.stockMovement.findMany({
            include: {
                inventory: {
                    include: { product: true, location: true },
                },
            },
            orderBy: { createdAt: 'asc' },
        });

        const reportMap = new Map<string, any>();

        movements.forEach(mv => {
            const key = `${mv.inventory.product.name}-${mv.inventory.location.name}`;

            if (!reportMap.has(key)) {
                reportMap.set(key, {
                    productName: mv.inventory.product.name,
                    locationName: mv.inventory.location.name,
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
                    closingStock: mv.openingStock ?? 0,
                });
            }

            const item = reportMap.get(key);

            // --- 2️⃣ Calculate opening stock ---
            // Movements before startDate affect opening stock
            if (startDate && mv.createdAt < startDate) {
                switch (mv.type) {
                    case 'RECEIPT': item.closingStock += mv.quantity; break;
                    case 'SALE': item.closingStock -= mv.quantity; break;
                    case 'TRANSFER_IN': item.closingStock += mv.quantity; break;
                    case 'TRANSFER_OUT': item.closingStock -= mv.quantity; break;
                    case 'RETURN': item.closingStock += mv.quantity; break;
                    case 'DAMAGED': break; // info only
                    case 'EXPIRED': break;
                    case 'REBAG_GAIN': item.closingStock += mv.quantity; break;
                    case 'REBAG_LOSS': item.closingStock -= mv.quantity; break;
                }
                item.openingStock = item.closingStock;
                return; // skip adding to period totals
            }

            // --- 3️⃣ Aggregate movements within range ---
            if ((!startDate || mv.createdAt >= startDate) && (!endDate || mv.createdAt <= endDate)) {
                switch (mv.type) {
                    case 'RECEIPT': item.receipts += mv.quantity; item.closingStock += mv.quantity; break;
                    case 'SALE': item.sales += mv.quantity; item.closingStock -= mv.quantity; break;
                    case 'TRANSFER_IN': item.transfersIn += mv.quantity; item.closingStock += mv.quantity; break;
                    case 'TRANSFER_OUT': item.transfersOut += mv.quantity; item.closingStock -= mv.quantity; break;
                    case 'RETURN': item.returns += mv.quantity; item.closingStock += mv.quantity; break;
                    case 'DAMAGED': item.damaged += mv.quantity; break;
                    case 'EXPIRED': item.expired += mv.quantity; break;
                    case 'REBAG_GAIN': item.rebagGain += mv.quantity; item.closingStock += mv.quantity; break;
                    case 'REBAG_LOSS': item.rebagLoss += mv.quantity; item.closingStock -= mv.quantity; break;
                }
            }

            // --- 4️⃣ Movements after endDate do not affect period totals, but do affect future closing stock ---
            if (endDate && mv.createdAt > endDate) {
                switch (mv.type) {
                    case 'RECEIPT': item.closingStock += mv.quantity; break;
                    case 'SALE': item.closingStock -= mv.quantity; break;
                    case 'TRANSFER_IN': item.closingStock += mv.quantity; break;
                    case 'TRANSFER_OUT': item.closingStock -= mv.quantity; break;
                    case 'RETURN': item.closingStock += mv.quantity; break;
                    case 'DAMAGED': break;
                    case 'EXPIRED': break;
                    case 'REBAG_GAIN': item.closingStock += mv.quantity; break;
                    case 'REBAG_LOSS': item.closingStock -= mv.quantity; break;
                }
            }
        });

        return NextResponse.json(Array.from(reportMap.values()));
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: 'Failed to generate stock report' }, { status: 500 });
    }
}
