import { NextRequest, NextResponse } from 'next/server';
import { logStockMovement } from '@/lib/stockMovement';

export async function POST(req: NextRequest) {
    const body = await req.json();

    const movement = await logStockMovement({
        inventoryId: body.inventoryId,
        type: body.type,
        quantity: body.quantity,
        createdBy: body.createdBy,
        saleId: body.saleId,
        customerId: body.customerId,
        fromLocationId: body.fromLocationId,
        toLocationId: body.toLocationId,
        reason: body.reason,
        physicalStock: body.physicalStock,
    });

    return NextResponse.json(movement);
}
