// src/services/purchasePlanning.service.ts
// Step 4 – Purchase Planning Engine (MRP → PO-ready)

import { prisma } from "@/lib/prisma";

export interface PurchaseRequirement {
    productId: string;
    productCode: string;
    productName: string;
    category: "RAW" | "PACKAGING";
    requiredQty: number;
    availableQty: number;
    netQty: number;
    preferredSupplierId?: string;
    uom: string;
}

/**
 * RULES:
 * - Only RAW & PACKAGING items
 * - Aggregated by product
 * - Net shortage only (positive qty)
 * - PO module compatible (supplier + UOM ready)
 */

export async function generatePurchasePlan(locationId: string) {
    // 1. Load shortages from MRP net requirements
    const shortages = await prisma.mrpNetRequirement.findMany({
        where: {
            locationId,
            netQty: { gt: 0 },
            product: {
                category: { in: ["RAW", "PACKAGING"] },
            },
        },
        include: {
            product: {
                include: {
                    preferredSupplier: true,
                    uom: true,
                },
            },
        });

    const plan: PurchaseRequirement[] = [];

    for (const r of shortages) {
        plan.push({
            productId: r.productId,
            productCode: r.product.code,
            productName: r.product.name,
            category: r.product.category as "RAW" | "PACKAGING",
            requiredQty: r.grossQty,
            availableQty: r.availableQty,
            netQty: r.netQty,
            preferredSupplierId: r.product.preferredSupplierId ?? undefined,
            uom: r.product.uom.code,
        });
    }

    return plan;
}

/**
 * OPTIONAL EXTENSION:
 * Group purchase plan by supplier (PO header ready)
 */
export function groupPurchasePlanBySupplier(plan: PurchaseRequirement[]) {
    return plan.reduce<Record<string, PurchaseRequirement[]>>((acc, item) => {
        const key = item.preferredSupplierId ?? "UNASSIGNED";
        acc[key] = acc[key] || [];
        acc[key].push(item);
        return acc;
    }, {});
}

/**
 * FUTURE:
 * - Convert grouped plan into PurchaseOrder + PurchaseOrderItem
 * - Lead time offset (planned delivery date)
 * - MOQ / Pack size rounding
 * - Multi-supplier price selection
 */
