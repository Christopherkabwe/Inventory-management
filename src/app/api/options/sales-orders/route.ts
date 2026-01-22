import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ==============================
   GET: Sales Orders for Invoicing
============================== */

// GET: /api/options/sales-orders?locationId=...&customerId=...
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const locationId = searchParams.get("locationId");
        const customerId = searchParams.get("customerId"); // optional

        if (!locationId) return NextResponse.json({ data: [] });

        const where: any = {
            locationId,
            status: { in: ["PENDING", "PARTIALLY_INVOICED"] },
        };
        if (customerId) where.customerId = customerId;

        const orders = await prisma.salesOrder.findMany({
            where,
            include: { items: { include: { product: true } } },
            orderBy: { createdAt: "desc" },
        });

        const result = orders.map(o => ({
            id: o.id,
            orderNumber: o.orderNumber,
            customerId: o.customerId,
            items: o.items.map(i => ({
                productId: i.productId,
                quantity: i.quantity,
                quantityInvoiced: i.quantityInvoiced ?? 0,
                product: { name: i.product.name, price: i.product.price },
            })),
        }));

        return NextResponse.json({ data: result });
    } catch (err) {
        console.error("Sales order fetch error:", err);
        return NextResponse.json({ error: "Failed to load sales orders" }, { status: 500 });
    }
}
