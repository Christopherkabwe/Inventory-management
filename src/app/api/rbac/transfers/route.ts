import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { productId, fromLocationId, toLocationId, quantity } = body;

    if (!productId || !fromLocationId || !toLocationId || quantity <= 0) {
        return NextResponse.json({ success: false, error: "Invalid data" }, { status: 400 });
    }

    if (fromLocationId === toLocationId) {
        return NextResponse.json({ success: false, error: "Locations must differ" }, { status: 400 });
    }

    return prisma.$transaction(async (tx) => {
        const inventory = await tx.inventory.findUnique({
            where: { productId_locationId: { productId, locationId: fromLocationId } },
        });

        if (!inventory || inventory.quantity < quantity) {
            throw new Error("Insufficient stock");
        }

        const ibtNumber = `IBT-${Date.now()}`;

        const transfer = await tx.transfer.create({
            data: {
                ibtNumber,
                fromLocationId,
                toLocationId,
                createdById: session.user.id,
                items: {
                    create: [{ productId, quantity }],
                },
            },
            include: {
                items: { include: { product: true } },
                fromLocation: true,
                toLocation: true,
            },
        });

        await tx.inventory.update({
            where: { productId_locationId: { productId, locationId: fromLocationId } },
            data: { quantity: { decrement: quantity } },
        });

        await tx.inventory.upsert({
            where: { productId_locationId: { productId, locationId: toLocationId } },
            update: { quantity: { increment: quantity } },
            create: {
                productId,
                locationId: toLocationId,
                quantity,
                lowStockAt: 10,
                createdById: session.user.id,
            },
        });

        return NextResponse.json({ success: true, data: transfer });
    });
}
