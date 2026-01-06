import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
    const locationNames = ["Warehouse A", "Warehouse B", "Store 1", "Store 2"];

    const locationsData = locationNames.map((name) => ({
        name,
        address: faker.location.streetAddress(),
    }));

    await prisma.location.createMany({
        data: locationsData,
        skipDuplicates: true, // avoid duplicates if re-run
    });

    console.log("✅ Locations created successfully");
}

main()
    .catch((e) => {
        console.error("❌ Failed to create locations:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
