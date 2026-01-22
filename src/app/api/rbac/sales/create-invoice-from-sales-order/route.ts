import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { salesOrderId, itemsToInvoice } = await req.json();
        if (!salesOrderId || !itemsToInvoice?.length) {
            return NextResponse.json({ error: "SalesOrderId and itemsToInvoice required" }, { status: 400 });
        }

        // Fetch the order
        const order = await prisma.salesOrder.findUnique({
            where: { id: salesOrderId },
            include: { items: true, customer: true, location: true },
        });
        if (!order) return NextResponse.json({ error: "Sales order not found" }, { status: 404 });

        // Determine status after invoicing
        const totalItems = order.items.reduce((sum, i) => sum + i.quantity, 0);
        const invoicedItems = itemsToInvoice.reduce((sum, i) => sum + i.quantity, 0);
        let orderStatus: "CONFIRMED" | "PARTIALLY_INVOICED" | "PENDING" = "PENDING";

        if (invoicedItems === 0) orderStatus = "PENDING";
        else if (invoicedItems < totalItems) orderStatus = "PARTIALLY_INVOICED";
        else orderStatus = "CONFIRMED";

        // Transactionally create Sale and update order
        const sale = await prisma.$transaction(async (tx) => {
            const newSale = await tx.sale.create({
                data: {
                    invoiceNumber: `INV-${Date.now()}`,
                    salesOrderId: order.id,
                    customerId: order.customerId,
                    locationId: order.locationId,
                    createdById: user.id,
                    status: "PENDING",
                    items: {
                        create: itemsToInvoice.map((i) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                            total: i.price * i.quantity,
                        })),
                    },
                },
                include: { items: true },
            });

            // Update order status
            await tx.salesOrder.update({
                where: { id: order.id },
                data: { status: orderStatus },
            });

            return newSale;
        });

        return NextResponse.json({ sale, orderStatus });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
