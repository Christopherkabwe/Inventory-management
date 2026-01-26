import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedOperations() {
    console.log("⏳ Seeding Operations...");

    const products = await prisma.productList.findMany();
    const locations = await prisma.location.findMany();
    const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });
    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });

    if (!products.length || !locations.length || !managers.length || !admins.length)
        throw new Error("Missing essential data for operations phase!");

    const inventoryMap: Record<string, any> = {};

    // --- INVENTORY ---
    for (const location of locations) {
        const productsForLocation = faker.helpers.arrayElements(products, 5);
        for (const product of productsForLocation) {
            const assignedUser = faker.helpers.arrayElement(managers);
            const createdBy = faker.helpers.arrayElement(admins);

            const inv = await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: faker.number.int({ min: 50, max: 150 }),
                    lowStockAt: 10,
                    assignedUserId: assignedUser.id,
                    createdById: createdBy.id,
                },
            });

            inventoryMap[`${product.id}-${location.id}`] = inv;
        }
    }
    console.log(`✅ Inventory created: ${Object.keys(inventoryMap).length}`);

    // --- PRODUCTIONS ---
    for (let i = 0; i < 10; i++) {
        const location = faker.helpers.arrayElement(locations);
        const production = await prisma.production.create({
            data: {
                productionNo: `PROD${i + 1}`.padStart(6, "0"),
                locationId: location.id,
                batchNumber: `BATCH${String(i + 1).padStart(4, "0")}`,
                notes: faker.lorem.sentence(),
                createdById: faker.helpers.arrayElement(managers).id,
            },
        });

        const prodProducts = faker.helpers.arrayElements(products, 3);
        for (const product of prodProducts) {
            await prisma.productionItem.create({
                data: {
                    productionId: production.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 10, max: 50 }),
                },
            });
        }
    }

    // --- ADJUSTMENTS ---
    for (const key in inventoryMap) {
        if (Math.random() > 0.7) {
            const inv = inventoryMap[key];
            const adj = await prisma.adjustment.create({
                data: {
                    adjustmentNo: `ADJ${Math.floor(Math.random() * 10000)}`,
                    locationId: inv.locationId,
                    type: faker.helpers.arrayElement(["DAMAGED", "EXPIRED", "MANUAL"]),
                    reason: "Random adjustment",
                    createdById: faker.helpers.arrayElement(managers).id,
                },
            });

            await prisma.adjustmentItem.create({
                data: {
                    adjustmentId: adj.id,
                    productId: inv.productId,
                    quantity: faker.number.int({ min: 1, max: 5 }),
                },
            });
        }
    }

    console.log("✅ Operations seeded (inventory, production, adjustments)");
}
