import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params; // Await the params Promise
    try {
        const { productId, customerId, quantity, salePrice, totalAmount, userId } = await req.json();
        const updatedSale = await prisma.sale.update({
            where: { id },
            data: {
                quantity,
                salePrice,
                totalAmount,
                product: { connect: { id: productId } }, // Update relation
                customer: { connect: { id: customerId } }, // Update relation
            },
        });
        return NextResponse.json(updatedSale);
    } catch (e) {
        console.error("Error updating sale:", e);
        return NextResponse.json({ error: 'Failed to update sale', details: e.message }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        await prisma.sale.delete({
            where: { id },
        });
        return NextResponse.json({ success: true, message: 'Sale deleted' });
    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Failed to delete sale' }, { status: 500 });
    }
}
