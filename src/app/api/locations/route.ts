import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req) {
    try {
        const locations = await prisma.location.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ locations });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}