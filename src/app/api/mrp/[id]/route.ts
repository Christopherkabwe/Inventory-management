// app/api/mrp/route.ts
// STEP 2 BACKEND — MRP CALCULATION API

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const locationId = searchParams.get("locationId");
    const horizon = Number(searchParams.get("horizon") ?? 30);

    if (!locationId) {
        return NextResponse.json({ error: "locationId required" }, { status: 400 });
    }

    // 1️⃣ Demand = confirmed sales orders within horizon
    const demandItems = await prisma.salesOrderItem.findMany({
        where: {
            salesOrder: {
                locationId,
                status: { in: ["CONFIRMED", "PARTIALLY_INVOICED"] },
                createdAt: { gte: new Date(Date.now() - horizon * 86400000) },
            },
        },
        include: { product: true },
    });

    // Aggregate demand per product
    const demandMap: Record<string, number> = {};
    for (const item of demandItems) {
        demandMap[item.productId] = (demandMap[item.productId] ?? 0) + item.quantity;
    }

    // 2️⃣ Inventory snapshot
    const inventory = await prisma.inventory.findMany({
        where: { locationId },
    });

    const inventoryMap = Object.fromEntries(
        inventory.map(i => [i.productId, i.quantity])
    );

    // 3️⃣ BOM explosion
    const results = [] as any[];

    for (const [productId, demandQty] of Object.entries(demandMap)) {
        const onHand = inventoryMap[productId] ?? 0;
        const netQty = Math.max(demandQty - onHand, 0);

        results.push({
            productId,
            demandQty,
            onHand,
            netQty,
            action: netQty === 0 ? "OK" : "PRODUCE",
        });

        if (netQty > 0) {
            const bom = await prisma.bOM.findFirst({
                where: { productId, status: "ACTIVE" },
                include: { components: true },
            });

            if (bom) {
                for (const c of bom.components) {
                    const required = c.quantity * netQty;
                    const compStock = inventoryMap[c.componentId] ?? 0;
                    const compNet = Math.max(required - compStock, 0);

                    results.push({
                        productId: c.componentId,
                        demandQty: required,
                        onHand: compStock,
                        netQty: compNet,
                        action: compNet === 0 ? "OK" : "BUY",
                        parentProductId: productId,
                    });
                }
            }
        }
    }

    return NextResponse.json({
        locationId,
        horizon,
        rows: results,
    });
}
