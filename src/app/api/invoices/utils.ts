import { prisma } from "@/lib/prisma";

export async function runTransaction(actions: (tx: typeof prisma) => Promise<any>) {
    return prisma.$transaction(actions);
}
