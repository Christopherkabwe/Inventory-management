// src/modules/purchasing/purchaseOrder.service.ts

import { prisma } from "@/lib/prisma";

export interface CreatePurchaseOrderInput {
    supplierId: string;
    locationId: string;
    createdById: string;
    notes?: string;
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice: number;
        uom: string;
    }>;
}

/**
 * ENTERPRISE RULES
 * - PO created in DRAFT status
 * - Supplier & Location are locked
 * - No inventory or accounting impact
 * - All writes are transactional
 */
export async function createPurchaseOrder(data: CreatePurchaseOrderInput) {
    if (!data.items || data.items.length === 0) {
        throw new Error("Purchase Order must have at least one item");
    }

    if (data.items.some(i => i.quantity <= 0)) {
        throw new Error("Item quantity must be greater than zero");
    }

    return prisma.$transaction(async (tx) => {
        // Defensive checks (clearer errors than Prisma relation failure)
        await tx.supplier.findUniqueOrThrow({
            where: { id: data.supplierId },
        });

        await tx.location.findUniqueOrThrow({
            where: { id: data.locationId },
        });

        const po = await tx.purchaseOrder.create({
            data: {
                poNumber: `PO-${Date.now()}`,
                status: "DRAFT",
                notes: data.notes,
                createdById: data.createdById,
                supplierId: data.supplierId,   // ✅ use scalar field
                locationId: data.locationId,   // ✅ use scalar field
                items: {
                    create: data.items.map(item => ({
                        productId: item.productId, // ✅ use scalar field
                        quantity: item.quantity,
                        unitPrice: item.unitPrice,
                        uom: item.uom,
                    })),
                },
            },
            include: {
                supplier: true,
                location: true,
                items: { include: { product: true } },
            },
        });

        return po;
    });
}
