import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedTransfers() {
    console.log("🚚 Seeding transfers...");

    const locations = await prisma.location.findMany();
    const products = await prisma.productList.findMany();
    const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });

    for (let i = 0; i < 15; i++) {
        const from = locations[0];
        const to = locations[1];

        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber: `IBT${Date.now()}${i}`,
                fromLocationId: from.id,
                toLocationId: to.id,
                createdById: managers[0].id,
                status: "RECEIVED",
            },
        });

        const items = faker.helpers.arrayElements(products, 2);
        for (const product of items) {
            const qty = faker.number.int({ min: 5, max: 20 });
            await prisma.transferItem.create({
                data: { transferId: transfer.id, productId: product.id, quantity: qty },
            });

            await prisma.inventory.updateMany({
                where: {
                    productId: product.id,
                    locationId: { in: [from.id, to.id] },
                },
                data: {},
            });
        }
    }

    console.log("✅ Transfers done");
}
