// app/api/transfers/[id]/receive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { receiveTransfer } from '@/services/transfer.service';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const data = await request.json();

    const { receivedById, items } = data;

    if (!receivedById || !items?.length) {
        console.error('[API] Invalid request body', data);
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    try {
        await receiveTransfer(id, receivedById, items);
        console.log(`[API] Transfer ${id} received successfully`);
        return NextResponse.json({ message: 'Transfer received successfully' });
    } catch (error) {
        console.error(`[API] receiveTransfer failed for transferId=${id}:`, error);
        return NextResponse.json({ message: error?.message || 'Error receiving transfer' }, { status: 500 });
    }
}
