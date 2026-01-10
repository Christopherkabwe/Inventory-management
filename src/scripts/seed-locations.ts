import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";

async function main() {
    const locationNames = ["Warehouse A", "Warehouse B", "Store 1", "Store 2"];

    // -------------------- CREATE OR UPDATE LOCATIONS --------------------
    const locations: any[] = [];
    for (const name of locationNames) {
        const loc = await prisma.location.upsert({
            where: { name },
            update: { address: faker.location.streetAddress() },
            create: { name, address: faker.location.streetAddress() },
        });
        locations.push(loc);
    }

    console.log("✅ Locations created/updated successfully");

    // -------------------- ASSIGN LOCATIONS TO USERS --------------------
    const users = await prisma.user.findMany();

    if (!users.length) {
        console.warn("⚠️ No users found! Please create users first.");
        return;
    }

    for (const user of users) {
        // Skip admins
        if (user.role === "ADMIN") continue;

        // Assign location if missing
        if (!user.locationId) {
            const randomLocation = locations[Math.floor(Math.random() * locations.length)];
            await prisma.user.update({
                where: { id: user.id },
                data: { locationId: randomLocation.id },
            });
            console.log(`Assigned user ${user.fullName || user.email} to location ${randomLocation.name}`);
        }
    }

    console.log("✅ All non-admin users have locations assigned");
}

main()
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
