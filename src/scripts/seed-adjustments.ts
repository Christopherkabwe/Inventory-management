import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

export async function seedAdjustments() {
    console.log("🛠️ Seeding adjustments...");

    const inventories = await prisma.inventory.findMany();
    const managers = await prisma.user.findMany({ where: { role: "MANAGER" } });

    for (const inv of inventories) {
        if (Math.random() > 0.7) {
            const qty = faker.number.int({ min: 1, max: 5 });
            await prisma.adjustment.create({
                data: {
                    adjustmentNo: `ADJ${Date.now()}`,
                    locationId: inv.locationId,
                    type: "DAMAGED",
                    createdById: managers[0].id,
                    items: {
                        create: {
                            productId: inv.productId,
                            quantity: qty,
                        },
                    },
                },
            });

            await prisma.inventory.update({
                where: { id: inv.id },
                data: { quantity: { decrement: qty } },
            });
        }
    }

    console.log("✅ Adjustments done");
}
