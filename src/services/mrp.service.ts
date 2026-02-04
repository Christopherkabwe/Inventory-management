// src/services/mrp.service.ts
// Enterprise-grade MRP calculation service

import { prisma } from "@/lib/prisma";

export interface MRPComponentResult {
    componentId: string;
    componentName: string;
    type: string;
    grossRequired: number;
    onHand: number;
    inTransit: number;
    netRequired: number;
}

export interface MRPResult {
    finishedProductId: string;
    finishedProductName: string;
    demandQty: number;
    components: MRPComponentResult[];
}

/**
 * STEP 1: Load confirmed demand
 */
async function loadDemand(locationId: string) {
    const orders = await prisma.salesOrder.findMany({
        where: {
            status: "CONFIRMED",
            locationId,
        },
        include: {
            items: {
                include: { product: true },
            },
        },
    });

    const demandMap = new Map<string, number>();

    for (const order of orders) {
        for (const item of order.items) {
            const openQty = item.quantity - item.quantityInvoiced;
            demandMap.set(item.productId, (demandMap.get(item.productId) ?? 0) + openQty);
        }
    }

    return demandMap;
}

/**
 * STEP 2: Recursive BOM explosion
 */
async function explodeBOM(
    productId: string,
    requiredQty: number,
    result: Map<string, number>
) {
    const bom = await prisma.bOM.findFirst({
        where: {
            productId,
            status: "ACTIVE",
        },
        include: {
            components: true,
        },
    });

    if (!bom) return;

    for (const item of bom.components) {
        const qty = item.quantity * requiredQty;
        result.set(item.componentId, (result.get(item.componentId) ?? 0) + qty);

        // multi-level BOM support
        await explodeBOM(item.componentId, qty, result);
    }
}

/**
 * STEP 3: Inventory netting
 */
async function netInventory(
    locationId: string,
    requirements: Map<string, number>
): Promise<MRPComponentResult[]> {
    const inventory = await prisma.inventory.findMany({
        where: { locationId },
        include: { product: true },
    });

    const invMap = new Map(inventory.map(i => [i.productId, i]));

    const results: MRPComponentResult[] = [];

    for (const [componentId, grossRequired] of requirements.entries()) {
        const inv = invMap.get(componentId);

        const onHand = inv?.quantity ?? 0;
        const inTransit = inv?.inTransit ?? 0;
        const netRequired = Math.max(0, Math.ceil(grossRequired - (onHand + inTransit)));

        results.push({
            componentId,
            componentName: inv?.product.name ?? "Unknown",
            type: inv?.product.type ?? "UNKNOWN",
            grossRequired: Math.ceil(grossRequired),
            onHand,
            inTransit,
            netRequired,
        });
    }

    return results;
}

/**
 * MAIN MRP ENTRY POINT
 */
export async function runMRP(locationId: string): Promise<MRPResult[]> {
    const demand = await loadDemand(locationId);

    const results: MRPResult[] = [];

    for (const [productId, demandQty] of demand.entries()) {
        const product = await prisma.productList.findUnique({
            where: { id: productId },
        });

        if (!product) continue;

        const requirements = new Map<string, number>();
        await explodeBOM(productId, demandQty, requirements);

        const components = await netInventory(locationId, requirements);

        results.push({
            finishedProductId: productId,
            finishedProductName: product.name,
            demandQty,
            components,
        });
    }

    return results;
}
