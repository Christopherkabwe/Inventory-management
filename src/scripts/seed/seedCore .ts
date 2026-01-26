import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { getNextSequence } from "../seed-helpers";

export async function seedCore() {
    console.log("⏳ Seeding Core Data...");

    // --- PRODUCTS ---
    const categories = ["Category 1", "Category 2", "Category 3", "Category 4", "Category 5"];
    const subCategories = ["Clothing", "Shoes", "Baby wear"];

    const admins = await prisma.user.findMany({ where: { role: "ADMIN" } });
    if (!admins.length) throw new Error("No admins found for product creation!");

    const productsData = Array.from({ length: 20 }).map((_, i) => ({
        sku: `SKU${String(i + 1).padStart(3, "0")}`,
        name: `Product ${i + 1}`,
        price: faker.number.float({ min: 10, max: 500 }),
        packSize: faker.number.int({ min: 1, max: 10 }),
        weightValue: faker.number.float({ min: 5, max: 50 }),
        weightUnit: "kg",
        category: faker.helpers.arrayElement(categories),
        subCategory: faker.helpers.arrayElement(subCategories),
        createdById: faker.helpers.arrayElement(admins).id,
    }));

    await prisma.productList.createMany({ data: productsData });
    console.log(`✅ Products created: ${productsData.length}`);

    // --- TRANSPORTERS ---
    const transportersData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Transporter ${i + 1}`,
        vehicleNumber: faker.vehicle.vin(),
        driverName: faker.person.fullName(),
    }));
    await prisma.transporter.createMany({ data: transportersData });
    console.log(`✅ Transporters created: ${transportersData.length}`);
}
