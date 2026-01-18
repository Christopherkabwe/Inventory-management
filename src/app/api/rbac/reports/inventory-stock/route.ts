// app/api/reports/inventory-stock/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);


    // 2️⃣ Fetch products and locations
    try {
        const [products, locations] = await Promise.all([
            prisma.productList.findMany(),
            prisma.location.findMany(),
        ]);
    } catch (error) {
        console.error(error);
    }

    // 3️⃣ Fetch all transactions affecting inventory
    const [
        inventoryHistory,
        saleItems,
        transferReceiptItems,
        productionItems,
        adjustmentItems,
        saleReturns,
    ] = await Promise.all([
        prisma.inventoryHistory.findMany({
            include: { product: true, location: true },
            orderBy: { date: "asc" },
        }),
        prisma.saleItem.findMany({
            include: { sale: { include: { location: true } }, product: true },
            orderBy: { updatedAt: "asc" },
        }),
        prisma.transferReceiptItem.findMany({
            include: {
                transferReceipt: {
                    include: {
                        transfer: { include: { toLocation: true } }
                    }
                }, product: true
            },
            orderBy: { updatedAt: "asc" },
        }),
        prisma.productionItem.findMany({
            include: { production: { include: { location: true } }, product: true },
            orderBy: { updatedAt: "asc" },
        }),
        prisma.adjustmentItem.findMany({
            include: { adjustment: { include: { location: true } }, product: true },
            orderBy: { updatedAt: "asc" },
        }),
        prisma.saleReturn.findMany({
            include: { product: true, location: true },
            orderBy: { updatedAt: "asc" },
        }),
    ]);

    // 4️⃣ Combine all transactions into unified records
    type Row = {
        date: string;
        productId: string;
        locationId: string;
        locationName: string;
        sku: string;
        product: string;
        category?: string | null;
        packSize: number;
        weightValue: number;
        weightUnit: string;
        delta: number;
        reference: string;
    };

    const rows: Row[] = [];

    // Helper to push row
    const pushRow = (
        date: Date,
        product: any,
        location: any,
        delta: number,
        reference: string
    ) => {
        if (!product || !location) return;
        rows.push({
            date: date.toISOString(),
            productId: product.id,
            locationId: location.id,
            locationName: location.name,
            sku: product.sku,
            product: product.name,
            category: product.category,
            packSize: product.packSize,
            weightValue: product.weightValue,
            weightUnit: product.weightUnit,
            delta,
            reference,
        });
    };

    // Inventory history
    inventoryHistory.forEach((h) => pushRow(h.date, h.product, h.location, h.quantity, "SYSTEM"));

    // Sales
    saleItems.forEach((s) =>
        pushRow(s.sale.saleDate, s.product, s.sale.location, -s.quantity, `SALE-${s.sale.invoiceNumber}`)
    );

    // Transfers received (stock in)
    transferReceiptItems.forEach((t) => {
        const location = t.transferReceipt.transfer.toLocation;
        pushRow(
            t.transferReceipt.receivedAt,
            t.product,
            location,
            t.quantityReceived,
            `TRANSFER-${t.transferReceipt.transfer.ibtNumber}`
        );
    });

    // Production (stock in)
    productionItems.forEach((p) =>
        pushRow(p.production.createdAt, p.product, p.production.location, p.quantity, `PRODUCTION-${p.production.productionNo}`)
    );

    // Adjustments (stock in/out)
    adjustmentItems.forEach((a) => {
        const delta = a.adjustment.type === "DAMAGED" || a.adjustment.type === "EXPIRED" ? -a.quantity : a.quantity;
        pushRow(a.adjustment.createdAt, a.product, a.adjustment.location, delta, `ADJUSTMENT-${a.adjustment.adjustmentNo}`);
    });

    // Sale returns (stock in)
    saleReturns.forEach((r) =>
        pushRow(r.createdAt, r.product, r.location, r.quantity, `RETURN-${r.returnNumber}`)
    );

    // 5️⃣ Sort all rows by product + location + date
    rows.sort((a, b) => {
        if (a.productId !== b.productId) return a.productId.localeCompare(b.productId);
        if (a.locationId !== b.locationId) return a.locationId.localeCompare(b.locationId);
        return a.date.localeCompare(b.date);
    });

    // 6️⃣ Compute running balance & tonnage
    const result: any[] = [];
    const balanceMap = new Map<string, number>();

    rows.forEach((r) => {
        const key = `${r.productId}-${r.locationId}`;
        const prevBalance = balanceMap.get(key) ?? 0;
        const balance = prevBalance + r.delta;
        balanceMap.set(key, balance);

        const unitWeightKg = r.weightUnit === "KG" ? r.weightValue : r.weightValue / 1000;
        result.push({
            ...r,
            balance,
            tonnage: (r.delta * unitWeightKg) / 1000,
        });
    });
    console.log(result);
    return Response.json(result);
}
