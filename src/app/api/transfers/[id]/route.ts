// app/api/transfers/[id]/route.ts
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const transfer = await prisma.transfer.findUnique({
        where: { id },
        include: {
            fromLocation: true,
            toLocation: true,
            transporter: true,
            items: {
                include: {
                    product: true,
                },
            },
        },
    });
    return NextResponse.json(transfer);
}

export async function PUT(request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { fromLocationId, toLocationId, transporterId, items } = await request.json();
    const transfer = await prisma.transfer.update({
        where: { id },
        data: {
            fromLocation: { connect: { id: fromLocationId } },
            toLocation: { connect: { id: toLocationId } },
            transporter: {
                connect: { id: transporterId },
            },
            items: {
                deleteMany: {},
                create: items.map((item) => ({
                    product: { connect: { id: item.productId } },
                    quantity: item.quantity,
                })),
            },
        },
    });
    return NextResponse.json(transfer);
}

export async function DELETE(request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    await prisma.transfer.delete({ where: { id } });
    return NextResponse.json({ message: 'Transfer deleted successfully' });
}