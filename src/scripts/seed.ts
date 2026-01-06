import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { ClearDatabase } from "@/scripts/ClearDatabase";
import { UserRole } from "@/lib/rbac";

// -------------------- HELPER FUNCTIONS --------------------
const startDate = new Date("2024-01-01");
const endDate = new Date();

// Random date between startDate and endDate
function randomDate() {
    return faker.date.between({ from: startDate, to: endDate });
}

// Pick a random element from an array
function pickRandom<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
}

// Pick a random user by role and optional location
function pickRandomUserForTask(
    users: any[],
    locationId?: string,
    roles: UserRole[] = ["USER", "MANAGER", "ADMIN"]
) {
    let eligible = users.filter(u => roles.includes(u.role));

    if (locationId) {
        // Admins are global, others must belong to location
        eligible = eligible.filter(u => u.role !== "ADMIN" ? u.locationId === locationId : true);
    }

    return pickRandom(eligible);
}

// Generate next sequence for documents
async function getNextSequence(key: string): Promise<string> {
    const year = startDate.getFullYear();
    const seq = await prisma.sequence.upsert({
        where: { id_year: { id: key, year } },
        update: { value: { increment: 1 } },
        create: { id: key, year, value: 1 },
    });
    return `${key}${String(seq.value).padStart(6, "0")}`;
}

// -------------------- MAIN --------------------
async function main() {
    await ClearDatabase();

    // -------------------- USERS --------------------
    console.log("👥 Fetching users...");
    const users = await prisma.user.findMany();
    if (users.length === 0) {
        console.warn("⚠️ No users found! Users should exist via stackAuth.");
    }

    const admins = users.filter(u => u.role === "ADMIN");
    const managers = users.filter(u => u.role === "MANAGER");
    const allRoles = users;

    // -------------------- SEQUENCES --------------------
    console.log("🔢 Creating sequences...");
    const sequenceKeys = ["INV", "IBT", "PROD", "ADJ", "SO", "QUOTE", "DN", "CN", "RETURN"];
    for (const key of sequenceKeys) {
        await prisma.sequence.upsert({
            where: { id_year: { id: key, year: startDate.getFullYear() } },
            update: {},
            create: { id: key, year: startDate.getFullYear(), value: 0 },
        });
    }

    // -------------------- LOCATIONS --------------------
    console.log("🏢 Creating locations...");
    const locationNames = ["Warehouse A", "Warehouse B", "Store 1", "Store 2"];
    const locationsData = locationNames.map(name => ({
        name,
        address: faker.location.streetAddress(),
    }));
    await prisma.location.createMany({ data: locationsData, skipDuplicates: true });
    const locations = await prisma.location.findMany();

    // Assign locations to users (if not ADMIN)
    for (const user of users) {
        if (user.role !== "ADMIN" && !user.locationId) {
            const location = pickRandom(locations);
            await prisma.user.update({
                where: { id: user.id },
                data: { locationId: location.id },
            });
        }
    }

    // -------------------- PRODUCTS --------------------
    console.log("📦 Creating products...");
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
    console.log("👥 Creating customers...");
    const customersData = Array.from({ length: 15 }).map((_, i) => ({
        name: `Customer ${i + 1}`,
        email: `customer${i + 1}@example.com`,
        phone: faker.phone.number(),
        country: "Zambia",
        city: pickRandom(["Lusaka", "Ndola", "Kitwe"]),
        createdById: pickRandom([...admins, ...managers]).id,
    }));
    await prisma.customer.createMany({ data: customersData });
    const customers = await prisma.customer.findMany();

    // -------------------- TRANSPORTERS --------------------
    console.log("🚛 Creating transporters...");
    const transportersData = Array.from({ length: 5 }).map((_, i) => ({
        name: `Transporter ${i + 1}`,
        vehicleNumber: faker.vehicle.vin(),
        driverName: faker.person.fullName(),
    }));
    await prisma.transporter.createMany({ data: transportersData });
    const transporters = await prisma.transporter.findMany();

    // -------------------- INVENTORY --------------------
    console.log("📦 Creating inventory...");
    const inventoryMap: Record<string, any> = {};
    for (const product of products) {
        for (const location of locations) {
            const inv = await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: faker.number.int({ min: 30, max: 120 }),
                    lowStockAt: 10,
                    createdById: pickRandom([...admins, ...managers]).id,
                },
            });
            inventoryMap[`${product.id}-${location.id}`] = inv;
        }
    }
    // -------------------- PRODUCTIONS --------------------
    console.log("🏭 Creating productions...");
    for (let i = 0; i < 10; i++) {
        const location = pickRandom(locations);
        const productionNo = await getNextSequence("PROD");
        const production = await prisma.production.create({
            data: {
                productionNo,
                locationId: location.id,
                batchNumber: `BATCH${String(i + 1).padStart(4, "0")}`,
                notes: faker.lorem.sentence(),
                createdById: pickRandom([...admins, ...managers]).id,
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
    console.log("⚠️ Creating adjustments...");
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
                    createdById: pickRandom([...admins, ...managers]).id,
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

    // -------------------- SALES ORDERS --------------------
    console.log("🧾 Creating sales orders...");
    const salesOrders: any[] = [];
    for (let i = 0; i < 50; i++) {
        const customer = pickRandom(customers);
        const location = pickRandom(locations);
        const orderNumber = await getNextSequence("SO");
        const order = await prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId: customer.id,
                locationId: location.id,
                createdById: pickRandom([...admins, ...managers]).id,
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

    // -------------------- SALES (INVOICES) & DELIVERY NOTES --------------------
    console.log("💰 Creating sales (invoices)...");
    const sales: any[] = [];

    for (let i = 0; i < 100; i++) {
        const order = pickRandom(salesOrders);
        const customer = customers.find((c) => c.id === order.customerId)!;
        const location = locations.find((l) => l.id === order.locationId)!;
        const transporter = pickRandom(transporters);

        const invoiceNumber = await getNextSequence("INV");
        const sale = await prisma.sale.create({
            data: {
                invoiceNumber,
                salesOrderId: order.id,
                locationId: location.id,
                customerId: customer.id,
                transporterId: transporter?.id,
                saleDate: randomDate(),
                createdById: pickRandom(allRoles).id,
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

        // -------------------- DELIVERY NOTE RULES --------------------
        // Only create DN if sale has invoice and simulate ADMIN created it
        if (sale.invoiceNumber) {
            const adminUser = pickRandom(admins); // Only ADMIN
            const deliveryNoteNo = await getNextSequence("DN");

            await prisma.deliveryNote.create({
                data: {
                    deliveryNoteNo, // ✅ correct field
                    saleId: sale.id,
                    salesOrderId: order.id,
                    locationId: location.id,
                    transporterId: transporter?.id,
                    dispatchedAt: randomDate(),
                    createdById: adminUser.id,
                    items: {
                        create: orderItems.map((i) => ({
                            productId: i.productId,
                            quantityDelivered: i.quantity,
                        })),
                    },
                },
            });

            // -------------------- UPDATE SALE WITH DELIVERY NOTE --------------------
            await prisma.sale.update({
                where: { id: sale.id },
                data: {
                    deliveryNoteNo, // link the DN to the sale
                },
            });
        }

        sales.push(sale);
    }

    // -------------------- UPDATE SALES ORDER STATUS --------------------
    console.log("🔄 Updating sales order statuses...");
    for (const order of salesOrders) {
        const items = await prisma.salesOrderItem.findMany({ where: { salesOrderId: order.id } });
        const invoices = await prisma.sale.findMany({ where: { salesOrderId: order.id }, include: { items: true } });

        if (order.status === "CANCELLED") continue;

        if (invoices.length === 0) {
            await prisma.salesOrder.update({ where: { id: order.id }, data: { status: "PENDING" } });
        } else {
            const fullyInvoiced = items.every((i) => {
                const invoicedQty = invoices.reduce((sum, s) => {
                    const saleItem = s.items.find((si) => si.productId === i.productId);
                    return sum + (saleItem?.quantity || 0);
                }, 0);
                return invoicedQty >= i.quantity;
            });
            await prisma.salesOrder.update({
                where: { id: order.id },
                data: { status: fullyInvoiced ? "CONFIRMED" : "PARTIALLY_INVOICED" },
            });
        }
    }

    // -------------------- QUOTATIONS --------------------
    console.log("📝 Creating quotations...");
    for (let i = 0; i < 50; i++) {
        const customer = pickRandom(customers);
        const location = pickRandom(locations);
        const quoteNumber = await getNextSequence("QUOTE");
        const quotation = await prisma.quotation.create({
            data: {
                quoteNumber,
                customerId: customer.id,
                locationId: location.id,
                createdById: pickRandom(allRoles).id,
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
    console.log("💳 Creating credit notes...");
    for (let i = 0; i < 30; i++) {
        const sale = pickRandom(sales);
        const creditNoteNumber = await getNextSequence("CN");
        await prisma.creditNote.create({
            data: {
                creditNoteNumber,
                saleId: sale.id,
                reason: "Random adjustment",
                amount: faker.number.float({ min: 50, max: 500 }),
                createdById: pickRandom(allRoles).id,
            },
        });
    }

    // -------------------- SALE RETURNS --------------------
    console.log("↩️ Creating sale returns...");
    for (let i = 0; i < 30; i++) {
        const sale = pickRandom(sales);
        const item = pickRandom(await prisma.saleItem.findMany({ where: { saleId: sale.id } }));
        const returnNumber = await getNextSequence("RETURN");
        await prisma.saleReturn.create({
            data: {
                returnNumber,
                saleId: sale.id,
                productId: item.productId,
                quantity: faker.number.int({ min: 1, max: item.quantity }),
                reason: "Random return",
                createdById: pickRandom(allRoles).id,
            },
        });
    }

    // -------------------- TRANSFERS & RECEIPTS --------------------
    console.log("📦 Creating transfers & receipts...");
    for (let i = 0; i < 20; i++) {
        const fromLocation = pickRandom(locations);
        const toLocation = pickRandom(locations.filter((l) => l.id !== fromLocation.id));
        const ibtNumber = await getNextSequence("IBT");
        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber,
                fromLocationId: fromLocation.id,
                toLocationId: toLocation.id,
                transporterId: pickRandom(transporters)?.id,
                transferDate: randomDate(),
                createdById: pickRandom(allRoles).id,
                status: pickRandom(["PENDING", "DISPATCHED", "RECEIVED"]),
            },
        });

        const transferProducts = faker.helpers.arrayElements(products, 3);
        for (const product of transferProducts) {
            await prisma.transferItem.create({
                data: {
                    transferId: transfer.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 1, max: 20 }),
                },
            });
        }

        if (transfer.status === "RECEIVED") {
            const receipt = await prisma.transferReceipt.create({
                data: {
                    transferId: transfer.id,
                    receivedById: pickRandom(allRoles).id,
                },
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
    .catch((e) => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
