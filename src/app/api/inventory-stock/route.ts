import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const inventoryHistory = await prisma.inventoryHistory.findMany({
        include: {
            product: true,
            location: true,
        },
    });

    const rows = inventoryHistory.map((h) => ({
        date: h.date,
        productId: h.productId,
        locationId: h.locationId,
        locationName: h.location.name,
        sku: h.product.sku,
        product: h.product.name,
        category: h.product.category,
        packSize: h.product.packSize,
        weightValue: h.product.weightValue,
        weightUnit: h.product.weightUnit,
        delta: h.delta,
        sourceType: h.sourceType,
        reference: h.reference,
    }));

    // Sort for correct ledger math
    rows.sort((a, b) => {
        if (a.productId !== b.productId) return a.productId.localeCompare(b.productId);
        if (a.locationId !== b.locationId) return a.locationId.localeCompare(b.locationId);
        return a.date.getTime() - b.date.getTime();
    });

    // Running balance per product + location
    const balanceMap = new Map<string, number>();
    const result = rows.map((r) => {
        const key = `${r.productId}-${r.locationId}`;
        const prevBalance = balanceMap.get(key) ?? 0;
        const balance = prevBalance + r.delta;
        balanceMap.set(key, balance);
        const unitWeightKg = r.weightUnit === "KG" ? r.weightValue : r.weightValue / 1000;
        return {
            ...r,
            balance,
            tonnage: (r.delta * unitWeightKg) / 1000,
        };
    });

    return Response.json(result);
}