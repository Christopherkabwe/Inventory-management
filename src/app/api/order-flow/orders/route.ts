import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence } from "@/lib/sequence";

/* ---------------- GET: List Sales Orders ---------------- */
export async function GET() {
    try {
        const orders = await prisma.salesOrder.findMany({
            include: {
                customer: true,
                location: true,
                createdBy: true,
                items: { include: { product: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        // Map for frontend display
        const result = orders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerName: o.customer?.name || "-",
            locationName: o.location?.name || "-",
            createdBy: o.createdBy?.fullName || "-",
            status: o.status,
            createdAt: o.createdAt,
            items: o.items.map(i => ({
                productName: i.product?.name || "-",
                quantity: i.quantity,
            })),
        }));

        return NextResponse.json({ orders: result });
    } catch (err) {
        console.error("SalesOrders list fetch error:", err);
        return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
    }
}

/* ---------------- POST: Create Sales Order ---------------- */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { customerId, locationId, items } = body;

        if (!customerId || !locationId || !items?.length) {
            return NextResponse.json(
                { error: "Customer, location, and items are required" },
                { status: 400 }
            );
        }

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Generate order number

        const orderNumber = await nextSequence("SO", true);

        const order = await prisma.salesOrder.create({
            data: {
                orderNumber,
                status: "PENDING",
                customer: { connect: { id: customerId } },
                location: { connect: { id: locationId } }, // use selected location
                createdBy: { connect: { id: user.id } },
                items: {
                    create: items.map((i: any) => ({
                        product: { connect: { id: i.productId } },
                        quantity: i.quantity,
                    })),
                },
            },
            include: {
                customer: true,
                location: true,
                createdBy: true,
                items: { include: { product: true } },
            },
        });

        return NextResponse.json(order, { status: 201 });
    } catch (err) {
        console.error("Create sales order error:", err);
        return NextResponse.json({ error: "Failed to create sales order" }, { status: 500 });
    }
}
