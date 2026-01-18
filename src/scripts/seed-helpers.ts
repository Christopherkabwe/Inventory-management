// scripts/seed-helpers.ts
import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { recordInventoryTransaction } from "@/lib/inventory";

const startDate = new Date("2024-01-01");
const endDate = new Date();

export function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

export function randomDate(): Date {
    return faker.date.between({ from: startDate, to: endDate });
}

export async function getNextSequence(key: string): Promise<string> {
    const year = startDate.getFullYear();
    const seq = await prisma.sequence.upsert({
        where: { id_year: { id: key, year } },
        update: { value: { increment: 1 } },
        create: { id: key, year, value: 1 },
    });
    return `${key}${String(seq.value).padStart(6, "0")}`;
}

export async function adjustInventory(
    tx,
    productId: string,
    locationId: string,
    delta: number,
    source: string,
    reference: string,
    createdById: string,
    metadata?: Record<string, any>
) {
    await tx.inventory.upsert({
        where: { productId_locationId: { productId, locationId } },
        update: { quantity: { increment: delta } },
        create: { productId, locationId, quantity: delta, lowStockAt: 10, createdById },
    });

    await recordInventoryTransaction({
        tx,
        productId,
        locationId,
        delta,
        source,
        reference,
        createdById,
        metadata,
    });
}
