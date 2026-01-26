import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { getNextSequence } from "../seed-helpers";

export async function seedAnalytics() {
    console.log("⏳ Seeding Analytics / Transfers...");

    // Example: 10 transfers
    const locations = await prisma.location.findMany();
    const products = await prisma.productList.findMany();
    const transporters = await prisma.transporter.findMany();
    const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });

    for (let i = 0; i < 10; i++) {
        const from = faker.helpers.arrayElement(locations);
        const to = faker.helpers.arrayElement(locations.filter(l => l.id !== from.id));

        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber: await getNextSequence("IBT"),
                fromLocationId: from.id,
                toLocationId: to.id,
                transporterId: faker.helpers.arrayElement(transporters).id,
                transferDate: faker.date.recent(),
                createdById: faker.helpers.arrayElement(managers).id,
                status: faker.helpers.arrayElement(["PENDING", "DISPATCHED", "RECEIVED"]),
            },
        });

        const transferProducts = faker.helpers.arrayElements(products, 2);
        for (const product of transferProducts) {
            await prisma.transferItem.create({
                data: { transferId: transfer.id, productId: product.id, quantity: faker.number.int({ min: 1, max: 20 }) },
            });
        }
    }

    console.log("✅ Transfers created");
}
