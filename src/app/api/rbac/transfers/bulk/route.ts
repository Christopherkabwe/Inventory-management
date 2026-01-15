import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const session = await getServerSession();
    const items = await req.json();

    return prisma.$transaction(async (tx) => {
        for (const t of items) {
            const inv = await tx.inventory.findUnique({
                where: { productId_locationId: { productId: t.productId, locationId: t.fromLocationId } },
            });

            if (!inv || inv.quantity < t.quantity) {
                throw new Error("Insufficient stock");
            }

            await tx.inventory.update({
                where: { productId_locationId: { productId: t.productId, locationId: t.fromLocationId } },
                data: { quantity: { decrement: t.quantity } },
            });

            await tx.inventory.upsert({
                where: { productId_locationId: { productId: t.productId, locationId: t.toLocationId } },
                update: { quantity: { increment: t.quantity } },
                create: {
                    productId: t.productId,
                    locationId: t.toLocationId,
                    quantity: t.quantity,
                    lowStockAt: 10,
                    createdById: session.user.id,
                },
            });
        }

        return NextResponse.json({ success: true });
    });
}
