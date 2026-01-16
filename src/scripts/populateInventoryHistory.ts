import { prisma } from "@/lib/prisma";

async function populateInventoryHistory() {
    const historyCount = await prisma.inventoryHistory.count();
    if (historyCount === 0) {
        const inventories = await prisma.inventory.findMany();

        for (const inventory of inventories) {
            await prisma.inventoryHistory.create({
                data: {
                    productId: inventory.productId,
                    locationId: inventory.locationId,
                    date: new Date(),
                    quantity: inventory.quantity,
                },
            });
        }

        console.log("Inventory history populated successfully!");
    } else {
        console.log("Inventory history is already populated.");
    }
}

populateInventoryHistory();