import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type Params = { params: { id: string } };

// -------------------- PUT /api/locations/:id --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const { name, address } = await req.json();
        if (!name) {
            return NextResponse.json({ error: 'Name is required' }, { status: 400 });
        }

        const updatedLocation = await prisma.location.update({
            where: { id },
            data: { name, address },
        });

        return NextResponse.json({ success: true, location: updatedLocation });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to update location', details: (e as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE /api/locations/:id --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        await prisma.location.delete({ where: { id } });
        return NextResponse.json({ success: true, message: 'Location deleted' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete location', details: (e as Error).message }, { status: 500 });
    }
}
