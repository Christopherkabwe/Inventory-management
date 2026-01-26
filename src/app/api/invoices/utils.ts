import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

// Properly type `tx` as Prisma.TransactionClient
export async function runTransaction<T>(
    actions: (tx: Prisma.TransactionClient) => Promise<T>
): Promise<T> {
    return prisma.$transaction(actions);
}
