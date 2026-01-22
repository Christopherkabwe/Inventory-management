import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> } // <-- note Promise
) {
    // ✅ unwrap the promise
    const { id } = await params;

    if (!id) {
        return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    const order = await prisma.salesOrder.findUnique({
        where: { id },
        include: {
            location: true,
            customer: true,
            createdBy: { select: { id: true, fullName: true } },
            items: { include: { product: true } },
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
}
