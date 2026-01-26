import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { nextSequence, incrementSequence } from "@/lib/sequence";

export async function GET() {
    const transfers = await prisma.transfer.findMany({
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
    return NextResponse.json(transfers);
}

export async function POST(request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }
        if (user.role !== 'ADMIN') {
            return NextResponse.json({ error: 'Only admins can create transfers' }, { status: 403 });
        }

        const { fromLocationId, toLocationId, transporterId, items } = await request.json();

        // Check if fromLocationId and toLocationId are the same
        if (fromLocationId === toLocationId) {
            return NextResponse.json({ error: 'Cannot transfer to the same location' }, { status: 400 });
        }

        // Generate ibtNumber using sequence
        const ibtNumber = await nextSequence("IBT");

        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber, // Use the generated ibtNumber
                fromLocation: { connect: { id: fromLocationId } },
                toLocation: { connect: { id: toLocationId } },
                transporter: { connect: { id: transporterId } },
                createdBy: { connect: { id: user.id } },
                items: {
                    create: items.map((item) => ({
                        product: { connect: { id: item.productId } },
                        quantity: item.quantity,
                    })),
                },
            },
        });
        await incrementSequence("IBT");
        return NextResponse.json(transfer);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 });
    }
}
