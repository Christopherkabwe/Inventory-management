import { prisma } from "@/lib/prisma";

export const generateNumber = (prefix: string) => `${prefix}-${Date.now()}`;

export async function runTransaction(actions: (tx: typeof prisma) => Promise<any>) {
    return prisma.$transaction(actions);
}
