import { prisma } from "@/lib/prisma";

async function populateInventoryHistory() {
    const historyCount = await prisma.inventoryHistory.count();
    if (historyCount > 0) {
        console.log("Inventory history is already populated.");
        return;
    }

    const inventories = await prisma.inventory.findMany({
        include: { product: true, location: true },
    });

    for (const inventory of inventories) {
        await prisma.inventoryHistory.create({
            data: {
                productId: inventory.productId,
                locationId: inventory.locationId,
                date: new Date(), // now
                delta: inventory.quantity, // initial stock
                sourceType: "INITIAL", // Prisma enum value
                reference: "SEED",
                createdById: inventory.createdById,
            },
        });
    }

    console.log("✅ Inventory history populated successfully!");
}

// Run only if this file is executed directly

populateInventoryHistory()
    .catch(e => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());