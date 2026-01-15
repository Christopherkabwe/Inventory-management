// app/api/products/[id]/stock/route.ts
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const url = new URL(req.url);
    const locationId = url.searchParams.get('locationId');

    if (!locationId) {
        return NextResponse.json({ error: 'locationId is required' }, { status: 400 });
    }

    const stock = await prisma.inventory.findUnique({
        where: {
            productId_locationId: {
                productId: id,
                locationId,
            },
        },
    });

    return NextResponse.json(stock ? stock.quantity : 0);
}