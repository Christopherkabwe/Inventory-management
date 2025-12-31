import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/transfers/:id
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    try {
        const transfer = await prisma.transfer.findUnique({
            where: { id },
            include: {
                product: true,
                fromLocation: true,
                toLocation: true,
            },
        });
        if (!transfer) {
            return NextResponse.json({ error: "Transfer not found" }, { status: 404 });
        }
        return NextResponse.json({ transfer });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch transfer" }, { status: 500 });
    }
}

// PUT /api/transfers/:id
export async function PUT(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 });
    }

    const { productId, fromLocationId, toLocationId, quantity } = await req.json();

    const transfer = await prisma.transfer.update({
        where: { id },
        data: {
            productId,
            fromLocationId,
            toLocationId,
            quantity: Number(quantity),
        },
        include: { product: true, fromLocation: true, toLocation: true },
    });

    return NextResponse.json({ transfer });
}

// DELETE /api/transfers/:id
export async function DELETE(req: Request, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    console.log('Deleting transfer with ID:', id);
    if (!id) return NextResponse.json({ error: "Missing transfer ID" }, { status: 400 });

    try {
        await prisma.transfer.delete({ where: { id } });
        return NextResponse.json({ message: "Transfer deleted successfully" });
    } catch (err) {
        console.error('Error deleting transfer:', err);
        return NextResponse.json({ error: "Failed to delete transfer" }, { status: 500 });
    }
}
