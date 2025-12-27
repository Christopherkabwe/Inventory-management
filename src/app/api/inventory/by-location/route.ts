import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get('locationId');

    if (!locationId) {
        return NextResponse.json({ error: 'locationId required' }, { status: 400 });
    }

    const inventory = await prisma.inventory.findMany({
        where: { locationId },
        include: {
            product: {
                select: { id: true, name: true },
            },
        },
        orderBy: { product: { name: 'asc' } },
    });

    return NextResponse.json({ inventory });
}
