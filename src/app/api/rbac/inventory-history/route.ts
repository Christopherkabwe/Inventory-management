import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);

    const products = searchParams.getAll("products");
    const categories = searchParams.getAll("categories");
    const locations = searchParams.getAll("locations");
    const search = searchParams.get("search")?.toLowerCase() || "";

    // STEP 1 — RBAC filter
    const baseWhere: any = {
        ...(user.role !== "ADMIN" && { locationId: user.locationId }),
    };

    // STEP 2 — fetch full history
    const history = await prisma.inventoryHistory.findMany({
        where: baseWhere,
        include: { product: true, location: true },
        orderBy: [
            { productId: "asc" },
            { locationId: "asc" },
            { date: "asc" }, // ASC for delta calculation
        ],
    });

    // STEP 3 — group by product + location
    const grouped = new Map<string, typeof history>();
    history.forEach((h) => {
        const key = `${h.productId}-${h.locationId}`;
        if (!grouped.has(key)) grouped.set(key, []);
        grouped.get(key)!.push(h);
    });

    // STEP 4 — compute delta & tonnage
    let rows: any[] = [];
    for (const records of grouped.values()) {
        for (let i = 0; i < records.length; i++) {
            const h = records[i];
            const prev = i > 0 ? records[i - 1] : null;
            const delta = prev ? h.quantity - prev.quantity : h.quantity;

            const unitWeightKg =
                h.product.weightUnit === "KG"
                    ? h.product.weightValue
                    : h.product.weightValue / 1000;

            rows.push({
                date: h.date,
                productId: h.productId,
                locationId: h.locationId,
                sku: h.product.sku,
                product: h.product.name,
                category: h.product.category,
                packSize: h.product.packSize,
                weightValue: h.product.weightValue,
                weightUnit: h.product.weightUnit,
                location: h.location.name,
                delta,
                balance: h.quantity,
                tonnage: (delta * unitWeightKg) / 1000,
                reference: "SYSTEM",
            });
        }
    }

    // STEP 5 — apply filters
    if (products.length) rows = rows.filter((r) => products.includes(r.productId));
    if (locations.length) rows = rows.filter((r) => locations.includes(r.locationId));
    if (categories.length) rows = rows.filter((r) => categories.includes(r.category));
    if (search) rows = rows.filter(
        (r) => r.product.toLowerCase().includes(search) || r.sku.toLowerCase().includes(search)
    );

    return Response.json(rows);
}
