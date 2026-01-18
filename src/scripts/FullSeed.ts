// scripts/FullSeed.ts
import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { ClearDatabase } from "@/scripts/ClearDatabase";
import { UserRole } from "@/lib/rbac";

import { seedSales } from "@/scripts/seed-sales";
import { seedProductions } from "@/scripts/seed-productions";
import { seedAdjustments } from "@/scripts/seed-adjustments";
import { seedTransfers } from "@/scripts/seed-transfers";

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

function filterUsersByRole(users: any[], roles: UserRole[]) {
    return users.filter(u => roles.includes(u.role));
}

async function main() {
    await ClearDatabase();

    // ---------------- USERS ----------------
    const users = await prisma.user.findMany();
    const admins = filterUsersByRole(users, ["ADMIN"]);
    const managers = filterUsersByRole(users, ["MANAGER"]);
    const salesUsers = filterUsersByRole(users, ["USER"]);

    // ---------------- ASSIGN MANAGERS ----------------
    for (const user of salesUsers) {
        if (!user.managerId) {
            await prisma.user.update({
                where: { id: user.id },
                data: { managerId: pickRandom(managers).id },
            });
        }
    }

    // ---------------- LOCATIONS ----------------
    const locations = await prisma.location.findMany();
    for (const user of salesUsers) {
        if (!user.locationId) {
            await prisma.user.update({
                where: { id: user.id },
                data: { locationId: pickRandom(locations).id },
            });
        }
    }

    // ---------------- PRODUCTS ----------------
    const categories = ["Electronics", "Fashion", "Home Goods", "Toys", "Food"];
    await prisma.productList.createMany({
        data: Array.from({ length: 20 }).map((_, i) => ({
            sku: `SKU${String(i + 1).padStart(3, "0")}`,
            name: `Product ${i + 1}`,
            price: faker.number.float({ min: 10, max: 500 }),
            category: pickRandom(categories),
            createdById: pickRandom(admins).id,
        })),
    });

    // ---------------- CUSTOMERS ----------------
    const customers = Array.from({ length: 15 }).map(() => {
        const user = pickRandom(salesUsers);
        return {
            name: faker.person.fullName(),
            email: faker.internet.email(),
            phone: faker.phone.number(),
            country: "Zambia",
            city: "Lusaka",
            userId: user.id,
            locationId: user.locationId!,
            createdById: user.managerId!,
        };
    });
    await prisma.customer.createMany({ data: customers });

    // ---------------- TRANSPORTERS ----------------
    await prisma.transporter.createMany({
        data: Array.from({ length: 5 }).map(() => ({
            name: faker.company.name(),
            vehicleNumber: faker.vehicle.vin(),
            driverName: faker.person.fullName(),
        })),
    });

    // ---------------- INITIAL INVENTORY ----------------
    const products = await prisma.productList.findMany();
    for (const product of products) {
        for (const location of locations) {
            await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: faker.number.int({ min: 50, max: 150 }),
                    lowStockAt: 10,
                    createdById: pickRandom(admins).id,
                },
            });
        }
    }

    // ---------------- DOMAIN SEEDS ----------------
    await seedSales();
    await seedProductions();
    await seedAdjustments();
    await seedTransfers();

    console.log("✅ FULL SEED COMPLETED");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
