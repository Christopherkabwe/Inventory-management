import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// -------------------- GET /api/locations --------------------
export async function GET(req: NextRequest) {
    try {
        const locations = await prisma.location.findMany({
            select: { id: true, name: true },
            orderBy: { name: 'asc' },
        });
        return NextResponse.json({ success: true, locations });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 });
    }
}

// -------------------- POST /api/locations --------------------
export async function POST(req: NextRequest) {
    try {
        const { name, address, createdBy } = await req.json();
        if (!name || !createdBy) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const location = await prisma.location.create({
            data: { name, address, createdBy },
        });

        return NextResponse.json({ success: true, location }, { status: 201 });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to create location', details: (e as Error).message }, { status: 500 });
    }
}
