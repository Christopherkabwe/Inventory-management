import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const url = new URL(req.url);
    const locationId = url.searchParams.get("locationId");
    const horizon = Number(url.searchParams.get("horizon") || 14);
    if (!locationId) return NextResponse.json([], { status: 400 });

    // 1️⃣ Get all relevant sales order items
    const salesItems = await prisma.salesOrderItem.findMany({
        where: {
            salesOrder: {
                locationId,
                status: { in: ["CONFIRMED", "PARTIALLY_INVOICED"] },
            },
        },
        include: { product: true },
    });

    // 2️⃣ Group by productId and sum quantities
    const groupedSales = salesItems.reduce<Record<string, { product: typeof salesItems[0]["product"], quantity: number }>>((acc, si) => {
        if (!acc[si.productId]) {
            acc[si.productId] = { product: si.product, quantity: 0 };
        }
        acc[si.productId].quantity += si.quantity;
        return acc;
    }, {});

    // 3️⃣ Inventory snapshot
    const inventory = await prisma.inventory.findMany({
        where: { locationId },
    });
    const inventoryMap = Object.fromEntries(
        inventory.map(i => [i.productId, i.quantity + (i.inTransit || 0)])
    );

    // 4️⃣ Build MRP results per finished product
    const mrpResults = await Promise.all(
        Object.entries(groupedSales).map(async ([productId, { product, quantity }]) => {
            const netQty = Math.max(quantity - (inventoryMap[productId] || 0), 0);

            // Load BOM components
            const bom = await prisma.bOM.findFirst({
                where: { productId, status: "ACTIVE" },
                include: { components: { include: { component: true } } },
            });

            const components = bom?.components.map(c => {
                const stock = inventoryMap[c.componentId] || 0;
                const required = c.quantity * netQty;
                return {
                    componentId: c.componentId,
                    componentName: c.component.name,
                    type: c.component.type,
                    grossRequired: required,
                    onHand: stock,
                    inTransit: 0,
                    netRequired: Math.max(required - stock, 0),
                };
            }) || [];

            return {
                finishedProductId: productId,
                finishedProductName: product.name,
                demandQty: quantity,
                components,
            };
        })
    );
    return NextResponse.json(mrpResults);
}


