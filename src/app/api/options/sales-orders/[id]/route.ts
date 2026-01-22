import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/options/sales-orders/:id
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const order = await prisma.salesOrder.findUnique({
            where: { id },
            include: {
                customer: true,
                location: true,
                items: {
                    include: {
                        product: true,
                    },
                },
            },
        });

        if (!order) {
            return NextResponse.json({ error: "Sales order not found" }, { status: 404 });
        }

        // Map to simpler structure for frontend
        const result = {
            id: order.id,
            orderNumber: order.orderNumber,
            customerId: order.customerId,
            locationId: order.locationId,
            customer: {
                id: order.customer.id,
                name: order.customer.name,
                email: order.customer.email,
                phone: order.customer.phone,
                address: order.customer.address,
            },
            location: {
                id: order.location.id,
                name: order.location.name,
            },
            items: order.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                quantityInvoiced: i.quantityInvoiced ?? 0,
                product: {
                    id: i.product.id,
                    name: i.product.name,
                    price: i.product.price,
                    weightValue: i.product.weightValue,
                    weightUnit: i.product.weightUnit,
                },
            })),
        };

        return NextResponse.json(result);
    } catch (err) {
        console.error("Error fetching sales order by ID:", err);
        return NextResponse.json({ error: "Failed to load sales order" }, { status: 500 });
    }
}
