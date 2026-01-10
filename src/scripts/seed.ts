import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { ClearDatabase } from "@/scripts/ClearDatabase";
import { UserRole } from "@/lib/rbac";

// -------------------- HELPERS --------------------
const startDate = new Date("2024-01-01");
const endDate = new Date();

function randomDate() {
    return faker.date.between({ from: startDate, to: endDate });
}

function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

async function getNextSequence(key: string): Promise<string> {
    const year = startDate.getFullYear();
    const seq = await prisma.sequence.upsert({
        where: { id_year: { id: key, year } },
        update: { value: { increment: 1 } },
        create: { id: key, year, value: 1 },
    });
    return `${key}${String(seq.value).padStart(6, "0")}`;
}

function filterUsersByRole(users: any[], roles: UserRole[]) {
    return users.filter(u => roles.includes(u.role));
}

// -------------------- MAIN --------------------
async function main() {
    await ClearDatabase();
    console.log("Clearing Database")

    // -------------------- FETCH EXISTING USERS --------------------
    const users = await prisma.user.findMany();
    if (users.length === 0) throw new Error("No users found. Seed failed.");

    const admins = filterUsersByRole(users, ["ADMIN"]);
    const managers = filterUsersByRole(users, ["MANAGER"]);
    const salesUsers = filterUsersByRole(users, ["USER"]);

    if (managers.length === 0) throw new Error("At least one manager must exist");

    console.log("Assigning Managers")
    // Assign managers
    for (const user of salesUsers) {
        if (!user.managerId) {
            const manager = pickRandom(managers);
            await prisma.user.update({
                where: { id: user.id },
                data: { managerId: manager.id },
            });
        }
    }

    // -------------------- LOCATIONS --------------------
    console.log("Creating Locations")
    const locationNames = ["Lusaka", "Ndola", "Kitwe", "Livingstone", "Chipata"];
    for (const name of locationNames) {
        await prisma.location.upsert({
            where: { name },
            update: {},
            create: { name },
        });
    }

    const locations = await prisma.location.findMany();

    for (const user of users) {
        if (user.role === "USER") {
            // assign a random location to the sales user
            const randomLocation = pickRandom(locations);
            await prisma.user.update({
                where: { id: user.id },
                data: { locationId: randomLocation.id },
            });
        }
    }
    const allLocations = await prisma.location.findMany();

    // -------------------- PRODUCTS --------------------
    console.log("Creating Database")
    const categories = ["Electronics", "Fashion", "Home Goods", "Toys", "Food"];
    const productsData = Array.from({ length: 20 }).map((_, i) => ({
        sku: `SKU${String(i + 1).padStart(3, "0")}`,
        name: `Product ${i + 1}`,
        price: faker.number.float({ min: 10, max: 500 }),
        packSize: faker.number.int({ min: 1, max: 10 }),
        weightValue: faker.number.float({ min: 0.5, max: 5 }),
        weightUnit: "kg",
        category: pickRandom(categories),
        createdById: pickRandom(admins).id,
    }));
    await prisma.productList.createMany({ data: productsData });
    const products = await prisma.productList.findMany();

    // -------------------- CUSTOMERS --------------------
    console.log("Creating Customers")
    const salesUsersWithLocation = salesUsers.filter(u => u.locationId); // only users with location
    if (!salesUsersWithLocation.length) throw new Error("No sales users have a location!");

    const customersData = Array.from({ length: 15 }).map((_, i) => {
        const user = pickRandom(salesUsersWithLocation); // pick only users with location
        const location = allLocations.find(l => l.id === user.locationId)!; // safe now
        return {
            name: `Customer ${i + 1}`,
            email: faker.internet.email(),
            phone: faker.phone.number(),
            country: "Zambia",
            city: pickRandom(["Lusaka", "Ndola", "Kitwe"]),
            locationId: location.id,
            userId: user.id,
            createdById: user.managerId!, // manager must exist
        };
    });
    await prisma.customer.createMany({ data: customersData });
    const customers = await prisma.customer.findMany();

    // -------------------- TRANSPORTERS --------------------
    console.log("Creating Transporters")
    const transportersData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Transporter ${i + 1}`,
        vehicleNumber: faker.vehicle.vin(),
        driverName: faker.person.fullName(),
    }));
    await prisma.transporter.createMany({ data: transportersData });
    const transporters = await prisma.transporter.findMany();

    // -------------------- INVENTORY --------------------
    console.log("Creating Inventory")
    const inventoryMap: Record<string, any> = {};
    for (const product of products) {
        for (const location of allLocations) {
            const inv = await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: faker.number.int({ min: 50, max: 150 }),
                    lowStockAt: 10,
                    assignedUserId: pickRandom(managers).id,
                    createdById: pickRandom(admins).id,
                },
            });
            inventoryMap[`${product.id}-${location.id}`] = inv;
        }
    }

    // -------------------- SALES ORDERS & SALES --------------------
    console.log("Creating Sales & Invoices")
    const salesOrders: any[] = [];
    const sales: any[] = [];

    for (let i = 0; i < 50; i++) {
        const user = pickRandom(salesUsers);
        const userCustomers = customers.filter(c => c.userId === user.id);
        if (!userCustomers.length) continue;

        const customer = pickRandom(userCustomers);
        const location = allLocations.find(l => l.id === customer.locationId)!;

        const orderNumber = await getNextSequence("SO");
        const order = await prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId: customer.id,
                locationId: location.id,
                createdById: user.id,
                status: "PENDING",
            },
        });

        const orderProducts = faker.helpers.arrayElements(products, 3);
        for (const product of orderProducts) {
            await prisma.salesOrderItem.create({
                data: {
                    salesOrderId: order.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 1, max: 10 }),
                },
            });
        }
        salesOrders.push(order);
    }

    for (let i = 0; i < 100; i++) {
        const order = pickRandom(salesOrders);
        const customer = customers.find(c => c.id === order.customerId)!;
        const location = allLocations.find(l => l.id === order.locationId)!;

        const invoiceNumber = await getNextSequence("INV");
        const sale = await prisma.sale.create({
            data: {
                invoiceNumber,
                salesOrderId: order.id,
                locationId: location.id,
                customerId: customer.id,
                createdById: order.createdById,
                saleDate: randomDate(),
                status: "PENDING",
            },
        });

        const orderItems = await prisma.salesOrderItem.findMany({ where: { salesOrderId: order.id } });
        for (const item of orderItems) {
            const price = faker.number.float({ min: 50, max: 500 });
            await prisma.saleItem.create({
                data: {
                    saleId: sale.id,
                    productId: item.productId,
                    quantity: item.quantity,
                    price,
                    total: item.quantity * price,
                },
            });
        }

        // Delivery Notes
        console.log("Creating Delivery Notes")
        const deliveryNoteNo = await getNextSequence("DN");
        await prisma.deliveryNote.create({
            data: {
                deliveryNoteNo,
                saleId: sale.id,
                salesOrderId: order.id,
                locationId: location.id,
                transporterId: pickRandom(transporters).id,
                dispatchedAt: randomDate(),
                createdById: order.createdById,
                items: { create: orderItems.map(i => ({ productId: i.productId, quantityDelivered: i.quantity })) },
            },
        });

        sales.push(sale);
    }

    // -------------------- PRODUCTIONS --------------------
    console.log("Creating Productions")
    for (let i = 0; i < 10; i++) {
        const location = pickRandom(allLocations);
        const productionNo = await getNextSequence("PROD");
        const production = await prisma.production.create({
            data: {
                productionNo,
                locationId: location.id,
                batchNumber: `BATCH${String(i + 1).padStart(4, "0")}`,
                notes: faker.lorem.sentence(),
                createdById: pickRandom(managers).id,
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

    // -------------------- ADJUSTMENTS --------------------
    console.log("Creating Adjustments")
    for (const key in inventoryMap) {
        if (Math.random() > 0.7) {
            const inv = inventoryMap[key];
            const adjustmentNo = await getNextSequence("ADJ");
            const adj = await prisma.adjustment.create({
                data: {
                    adjustmentNo,
                    locationId: inv.locationId,
                    type: pickRandom(["DAMAGED", "EXPIRED", "MANUAL"]),
                    reason: "Random adjustment",
                    createdById: pickRandom(managers).id,
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

    // -------------------- QUOTATIONS --------------------
    console.log("Creating Quotations")
    for (let i = 0; i < 50; i++) {
        const customer = pickRandom(customers);
        const location = allLocations.find(l => l.id === customer.locationId)!;
        const quotation = await prisma.quotation.create({
            data: {
                quoteNumber: await getNextSequence("QUOTE"),
                customerId: customer.id,
                locationId: location.id,
                createdById: customer.userId!,
                status: pickRandom(["PENDING", "APPROVED", "REJECTED"]),
            },
        });
        const quoteProducts = faker.helpers.arrayElements(products, 3);
        for (const product of quoteProducts) {
            const qty = faker.number.int({ min: 1, max: 20 });
            await prisma.quotationItem.create({
                data: {
                    quotationId: quotation.id,
                    productId: product.id,
                    quantity: qty,
                    price: product.price,
                    total: qty * product.price,
                },
            });
        }
    }

    // -------------------- CREDIT NOTES --------------------
    console.log("Creating Credit Notes")
    for (let i = 0; i < 30; i++) {
        const sale = pickRandom(sales);
        await prisma.creditNote.create({
            data: {
                creditNoteNumber: await getNextSequence("CN"),
                saleId: sale.id,
                reason: "Random adjustment",
                amount: faker.number.float({ min: 50, max: 500 }),
                createdById: sale.createdById,
            },
        });
    }

    // -------------------- SALE RETURNS --------------------
    console.log("Creating Sales Returns")
    for (let i = 0; i < 30; i++) {
        const sale = pickRandom(sales);
        const item = pickRandom(await prisma.saleItem.findMany({ where: { saleId: sale.id } }));
        await prisma.saleReturn.create({
            data: {
                returnNumber: await getNextSequence("RETURN"),
                saleId: sale.id,
                productId: item.productId,
                quantity: faker.number.int({ min: 1, max: item.quantity }),
                reason: "Random return",
                createdById: sale.createdById,
                locationId: sale.locationId,
            },
        });
    }

    // -------------------- TRANSFERS --------------------
    console.log("Creating Transfers")
    for (let i = 0; i < 20; i++) {
        const from = pickRandom(allLocations);
        const to = pickRandom(allLocations.filter(l => l.id !== from.id));
        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber: await getNextSequence("IBT"),
                fromLocationId: from.id,
                toLocationId: to.id,
                transporterId: pickRandom(transporters).id,
                transferDate: randomDate(),
                createdById: pickRandom(managers).id,
                status: pickRandom(["PENDING", "DISPATCHED", "RECEIVED"]),
            },
        });
        const transferProducts = faker.helpers.arrayElements(products, 3);
        for (const p of transferProducts) {
            await prisma.transferItem.create({
                data: { transferId: transfer.id, productId: p.id, quantity: faker.number.int({ min: 1, max: 20 }) },
            });
        }

        if (transfer.status === "RECEIVED") {
            const receipt = await prisma.transferReceipt.create({
                data: { transferId: transfer.id, receivedById: pickRandom(managers).id },
            });
            const items = await prisma.transferItem.findMany({ where: { transferId: transfer.id } });
            for (const item of items) {
                await prisma.transferReceiptItem.create({
                    data: {
                        transferReceiptId: receipt.id,
                        productId: item.productId,
                        quantityReceived: item.quantity,
                        quantityDamaged: faker.number.int({ min: 0, max: 2 }),
                        quantityExpired: faker.number.int({ min: 0, max: 1 }),
                        comment: "Random",
                    },
                });
            }
        }
    }

    console.log("✅ FULL DATABASE SEED COMPLETED SUCCESSFULLY");
}

main()
    .catch(e => { console.error("❌ Seed failed:", e); process.exit(1); })
    .finally(() => prisma.$disconnect());
