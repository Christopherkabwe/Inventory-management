// app/api/transfers/[id]/receive/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { receivedById, items } = await request.json();

    if (!receivedById || !items) {
        return NextResponse.json({ message: 'Invalid request body' }, { status: 400 });
    }

    if (!Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ message: 'Invalid items array' }, { status: 400 });
    }

    try {
        const transfer = await prisma.transfer.update({
            where: { id: String(id) },
            data: {
                status: 'RECEIVED',
                receipt: {
                    create: {
                        receivedBy: {
                            connect: { id: receivedById },
                        },
                        items: {
                            create: items.map((item) => ({
                                product: { connect: { id: item.productId } },
                                quantityReceived: item.quantityReceived,
                                quantityDamaged: item.quantityDamaged,
                                quantityExpired: item.quantityExpired,
                                comment: item.comment,
                            })),
                        },
                    },
                },
            },
        });

        return NextResponse.json(transfer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Error receiving transfer' }, { status: 500 });
    }
}