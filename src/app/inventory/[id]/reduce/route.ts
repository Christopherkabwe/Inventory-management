import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { useStackApp } from "@stackframe/stack";

export async function POST(req, { params }) {
    const stackApp = useStackApp();
    const user = stackApp.useUser();
    const userId = user?.id;

    const { id } = params;
    const { location, quantity } = await req.json();


    try {
        // Find the inventory item
        const inventory = await prisma.inventory.findFirst({
            where: { productId: id, location },
        });

        if (!inventory || inventory.quantity < quantity) {
            return NextResponse.json({ error: `Not enough stock in ${location}. Available: ${inventory?.quantity || 0}.` }, { status: 400 });
        }

        // Reduce quantity
        await prisma.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: { decrement: quantity },
                updatedAt: new Date(),
                updatedBy: userId,
            },
        });

        return NextResponse.json({ success: true });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update inventory.' }, { status: 500 });
    }
}