import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        const locations = await prisma.location.findMany({
            where: { createdBy: userId },
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ locations });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}