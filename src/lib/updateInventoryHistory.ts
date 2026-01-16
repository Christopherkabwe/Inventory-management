import { prisma } from "@/lib/prisma";

export async function updateInventoryHistory(productId: string, locationId: string, quantity: number, date: Date) {
    const existingHistory = await prisma.inventoryHistory.findFirst({
        where: {
            productId,
            locationId,
            date,
        },
    });

    if (existingHistory) {
        await prisma.inventoryHistory.update({
            where: {
                id: existingHistory.id,
            },
            data: {
                quantity,
            },
        });
    } else {
        await prisma.inventoryHistory.create({
            data: {
                productId,
                locationId,
                date,
                quantity,
            },
        });
    }
}