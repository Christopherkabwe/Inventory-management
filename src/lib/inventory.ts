import { prisma } from '@/lib/prisma'; // path to your prisma.ts
import type { Prisma } from '@/generated/prisma';
import { InventorySource } from '@/generated/prisma';

interface RecordInventoryParams {
    tx?: Prisma.TransactionClient; //typeof prisma;
    productId: string;
    locationId: string;
    delta: number;
    source: InventorySource;
    reference: string;
    createdById: string;
    metadata?: Record<string, any>;
    productionDefectId?: string;
}

/**
 * Record inventory transaction
 */
export async function recordInventoryTransaction(params: RecordInventoryParams) {
    const { tx, productId, locationId, delta, source, reference, createdById, metadata } = params;
    const client = tx || prisma;

    await client.inventoryHistory.create({
        data: {
            productId,
            locationId,
            delta,
            sourceType: source,       // ✅ Prisma enum
            reference,
            createdById,
            metadata: metadata ? JSON.stringify(metadata) : undefined,
            date: new Date(),
            createdAt: new Date(),
            updatedAt: new Date(),
        },
    });
}
