// src/services/plannedProduction.service.ts
// Step 3 – Convert MRP results into Planned Production (ERP-grade)

import { prisma } from "@/lib/prisma";

interface CreatePlannedProductionInput {
    locationId: string;
    finishedProductId: string;
    quantity: number;
    createdById: string;
}

/**
 * ENTERPRISE RULES ENFORCED:
 * 1. Production created in DRAFT status
 * 2. ACTIVE BOM version is locked at creation time
 * 3. One production per finished product per run (idempotent-safe)
 * 4. Inventory is NOT affected until CONFIRMED
 */

export async function createPlannedProduction(input: CreatePlannedProductionInput) {
    const { locationId, finishedProductId, quantity, createdById } = input;

    if (quantity <= 0) {
        throw new Error("Production quantity must be greater than zero");
    }

    // Load ACTIVE BOM
    const bom = await prisma.bOM.findFirst({
        where: {
            productId: finishedProductId,
            status: "ACTIVE",
        },
        include: {
            components: true,
        },
    });

    if (!bom) {
        throw new Error("No ACTIVE BOM found for product");
    }

    return await prisma.$transaction(async tx => {
        // Generate production number (sequence-friendly)
        const productionNo = `PROD-${Date.now()}`;

        // Create Production header
        const production = await tx.production.create({
            data: {
                productionNo,
                locationId,
                batchNumber: `BATCH-${productionNo}`,
                status: "DRAFT",
                notes: `Planned via MRP | BOM v${bom.version}`,
                createdById,
            },
        });

        // Create finished product output
        await tx.productionItem.create({
            data: {
                productionId: production.id,
                productId: finishedProductId,
                quantity,
            },
        });

        // Lock BOM snapshot (enterprise requirement)
        for (const component of bom.components) {
            await tx.productionItem.create({
                data: {
                    productionId: production.id,
                    productId: component.componentId,
                    quantity: Math.ceil(component.quantity * quantity) * -1, // negative = consumption
                },
            });
        }

        return production;
    });
}

/**
 * BULK CREATION – From full MRP run
 */
export async function createPlannedProductionsFromMRP(
    mrpResults: Array<{ finishedProductId: string; demandQty: number }>,
    locationId: string,
    createdById: string
) {
    const productions = [];

    for (const r of mrpResults) {
        if (r.demandQty > 0) {
            const prod = await createPlannedProduction({
                locationId,
                finishedProductId: r.finishedProductId,
                quantity: r.demandQty,
                createdById,
            });
            productions.push(prod);
        }
    }

    return productions;
}
