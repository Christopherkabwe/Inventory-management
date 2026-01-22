import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });

    const order = await prisma.salesOrder.findUnique({
        where: { id },
        include: {
            location: true,
            customer: true,
            createdBy: { select: { id: true, fullName: true } },
            items: { include: { product: true } },
        },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json(order);
}

export async function PUT(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { customerId, locationId, items } = body;

    if (!customerId || !locationId || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    try {
        const updatedOrder = await prisma.$transaction(async (tx) => {
            // 1️⃣ Update main order fields
            const order = await tx.salesOrder.update({
                where: { id },
                data: {
                    customer: { connect: { id: customerId } },
                    location: { connect: { id: locationId } },
                    updatedAt: new Date(), // explicitly update timestamp
                },
            });

            // 2️⃣ Handle order items
            const existingItems = await tx.salesOrderItem.findMany({ where: { salesOrderId: id } });
            const existingProductIds = existingItems.map(i => i.productId);
            const newProductIds = items.map(i => i.productId);

            // Items to delete
            const itemsToDelete = existingItems.filter(i => !newProductIds.includes(i.productId));
            if (itemsToDelete.length > 0) {
                await tx.salesOrderItem.deleteMany({
                    where: { salesOrderId: id, productId: { in: itemsToDelete.map(i => i.productId) } },
                });
            }

            // Items to add
            const itemsToAdd = items.filter(i => !existingProductIds.includes(i.productId));
            if (itemsToAdd.length > 0) {
                await tx.salesOrderItem.createMany({
                    data: itemsToAdd.map(i => ({
                        salesOrderId: id,
                        productId: i.productId,
                        quantity: i.quantity,
                    })),
                });
            }

            // Items to update
            const itemsToUpdate = items.filter(i => existingProductIds.includes(i.productId));
            for (const item of itemsToUpdate) {
                await tx.salesOrderItem.updateMany({
                    where: { salesOrderId: id, productId: item.productId },
                    data: { quantity: item.quantity, updatedAt: new Date() },
                });
            }

            return order;
        });

        return NextResponse.json(updatedOrder);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Failed to update sales order" }, { status: 500 });
    }
}

export async function DELETE(
    _: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!id) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });

    try {
        await prisma.$transaction([
            prisma.salesOrderItem.deleteMany({ where: { salesOrderId: id } }),
            prisma.salesOrder.delete({ where: { id } }),
        ]);

        return NextResponse.json({ success: true });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Failed to delete sales order" }, { status: 500 });
    }
}
