// app/api/transfers/[id]/dispatch/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { transporterId, driverName } = await request.json();

    if (!transporterId || !driverName) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    try {
        const transfer = await prisma.transfer.update({
            where: { id: String(id) },
            data: {
                status: 'DISPATCHED',
                transporter: {
                    update: {
                        driverName,
                    },
                },
            },
        });
        return NextResponse.json(transfer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error dispatching transfer' }, { status: 500 });
    }
}
