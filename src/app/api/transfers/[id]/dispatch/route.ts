// app/api/transfers/[id]/dispatch/route.ts
export const dynamic = 'force-dynamic';

import { NextRequest, NextResponse } from 'next/server';
import { PrismaClientKnownRequestError } from '@/generated/prisma/runtime/client';
import { dispatchTransfer } from '@/services/transfer.service';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const data = await request.json();
    console.log('Request data:', data);

    const { transporterId, driverName, driverPhoneNumber } = data;

    if (!transporterId || !driverName || !driverPhoneNumber) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    try {
        await dispatchTransfer(id, transporterId, driverName, driverPhoneNumber);
        return NextResponse.json({ message: 'Transfer dispatched successfully' });
    } catch (error) {
        console.error(error);
        if (error instanceof PrismaClientKnownRequestError && error.code === 'P2034') {
            return NextResponse.json({ message: 'Transaction timed out' }, { status: 500 });
        }
        return NextResponse.json({ message: 'Error dispatching transfer' }, { status: 500 });
    }
}
