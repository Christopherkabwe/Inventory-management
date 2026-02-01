import { prisma } from "@/lib/prisma";
import InventoryStockClient from "@/app/(pages)/inventory/inventory-history/InventoryHistoryClient";

export default async function InventoryStockPage() {
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
        createdAt: h.createdAt,
    }));

    // Sort for correct ledger math
    rows.sort((a, b) => {
        // 1️⃣ Sort by date first, newest first
        const dateDiff = b.createdAt.getTime() - a.createdAt.getTime();
        if (dateDiff !== 0) return dateDiff;

        // 2️⃣ Then by reference (ascending)
        if (a.reference !== b.reference) return a.reference.localeCompare(b.reference);

        // 3️⃣ Then by productId (ascending)
        if (a.productId !== b.productId) return a.productId.localeCompare(b.productId);

        // 4️⃣ Then by locationId (ascending)
        if (a.locationId !== b.locationId) return a.locationId.localeCompare(b.locationId);

        return 0; // completely equal
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

    return <InventoryStockClient rows={result} />;
}