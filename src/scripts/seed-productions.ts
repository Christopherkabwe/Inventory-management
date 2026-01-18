import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedProductions() {
    console.log("🏭 Seeding productions...");

    const products = await prisma.productList.findMany();
    const locations = await prisma.location.findMany();
    const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });

    for (let i = 0; i < 10; i++) {
        const location = locations[Math.floor(Math.random() * locations.length)];
        const production = await prisma.production.create({
            data: {
                productionNo: `PROD${Date.now()}${i}`,
                locationId: location.id,
                createdById: managers[0].id,
            },
        });

        const prodItems = faker.helpers.arrayElements(products, 3);
        for (const product of prodItems) {
            const qty = faker.number.int({ min: 10, max: 50 });
            await prisma.productionItem.create({
                data: {
                    productionId: production.id,
                    productId: product.id,
                    quantity: qty,
                },
            });

            await prisma.inventory.update({
                where: { productId_locationId: { productId: product.id, locationId: location.id } },
                data: { quantity: { increment: qty } },
            });
        }
    }

    console.log("✅ Productions done");
}
