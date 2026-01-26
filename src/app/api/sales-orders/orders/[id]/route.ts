import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
    _: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;
    if (!id) return NextResponse.json({ error: "Order ID is required" }, { status: 400 });

    // Fetch the sales order and its items
    const order = await prisma.salesOrder.findUnique({
        where: { id },
        include: {
            location: true,
            customer: true,
            createdBy: { select: { id: true, fullName: true } },
            items: { include: { product: true } },
            invoices: { include: { items: true } }, // Sale is your "invoice"
        },
    });

    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    // Map items to include invoiced and pending quantities
    const itemsWithPending = order.items.map(orderItem => {
        // Sum of quantities invoiced for this product across all linked Sale records
        const invoicedQty = order.invoices.reduce((sum, invoice) => {
            const saleItem = invoice.items.find(si => si.productId === orderItem.productId);
            return sum + (saleItem?.quantity ?? 0);
        }, 0);

        const pendingQty = orderItem.quantity - invoicedQty;

        return {
            ...orderItem,
            invoicedQty,
            pendingQty,
        };
    });

    return NextResponse.json({ ...order, items: itemsWithPending });
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
                    updatedAt: new Date(),
                },
            });

            // 2️⃣ Handle order items
            const existingItems = await tx.salesOrderItem.findMany({ where: { salesOrderId: id } });
            const existingProductIds = existingItems.map(i => i.productId);
            const newProductIds = items.map(i => i.productId);

            // Fetch all invoiced quantities for this order
            const invoices = await tx.sale.findMany({
                where: { salesOrderId: id },
                include: { items: true },
            });

            // Helper to get total invoiced quantity for a product
            const getInvoicedQty = (productId: string) => {
                return invoices.reduce((sum, invoice) => {
                    const si = invoice.items.find(i => i.productId === productId);
                    return sum + (si?.quantity ?? 0);
                }, 0);
            };

            // Items to delete: only allow deletion if nothing has been invoiced
            const itemsToDelete = existingItems.filter(
                i => !newProductIds.includes(i.productId)
            );

            for (const item of itemsToDelete) {
                const invoicedQty = getInvoicedQty(item.productId);
                if (invoicedQty > 0) {
                    throw new Error(
                        `Cannot delete product ${item.productId} because ${invoicedQty} has already been invoiced`
                    );
                }
            }

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
                const existingItem = existingItems.find(i => i.productId === item.productId)!;
                const invoicedQty = getInvoicedQty(item.productId);

                if (item.quantity < invoicedQty) {
                    throw new Error(
                        `Cannot reduce quantity of product ${item.productId} below invoiced quantity (${invoicedQty})`
                    );
                }

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
        // 1️⃣ Check if the order exists
        const order = await prisma.salesOrder.findUnique({
            where: { id },
            include: { invoices: true },
        });

        if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

        // 2️⃣ Prevent deletion if any invoices exist
        if (order.invoices.length > 0) {
            return NextResponse.json(
                { error: `Cannot delete order ${order.orderNumber} because it has ${order.invoices.length} invoice(s)` },
                { status: 400 }
            );
        }

        // 3️⃣ Safe to delete: remove order items and then the order
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
