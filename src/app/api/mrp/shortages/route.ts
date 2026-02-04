// app/api/mrp/shortages/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // 1️⃣ Get all raw materials / items needed for draft productions
        const draftProductions = await prisma.production.findMany({
            where: { status: "DRAFT" },
            include: { items: { include: { product: true } } },
        });

        // 2️⃣ Aggregate required quantities per product
        const required: Record<string, number> = {};
        draftProductions.forEach(prod => {
            prod.items.forEach(item => {
                required[item.productId] = (required[item.productId] || 0) + item.quantity;
            });
        });

        // 3️⃣ Get inventory levels
        const inventories = await prisma.inventory.findMany();
        const inventoryMap = inventories.reduce((acc, inv) => {
            acc[inv.productId] = (acc[inv.productId] || 0) + inv.quantity;
            return acc;
        }, {} as Record<string, number>);

        // 4️⃣ Fetch full product objects
        const productIds = Object.keys(required);
        const products = await prisma.productList.findMany({
            where: { id: { in: productIds } },
        });
        const productMap = Object.fromEntries(products.map(p => [p.id, p]));

        // 5️⃣ Build shortages array with full product object
        const shortages = Object.entries(required).map(([productId, qty]) => {
            const available = inventoryMap[productId] || 0;
            const netShortage = Math.max(qty - available, 0);

            return {
                productId,
                netShortage,
                action: netShortage <= 0 ? "OK" : "BUY",
                product: productMap[productId], // full product object
                available,
            };
        });

        return NextResponse.json(shortages);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to calculate shortages" }, { status: 500 });
    }
}
