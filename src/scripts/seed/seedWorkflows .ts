import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { getNextSequence } from "../seed-helpers";

// --- Helper to generate a random date between start and end ---
function dateRange(start: Date, end: Date) {
    const startTimestamp = start.getTime();
    const endTimestamp = end.getTime();
    const randomTimestamp = startTimestamp + Math.random() * (endTimestamp - startTimestamp);
    return new Date(randomTimestamp);
}

export async function seedWorkflows() {
    console.log("⏳ Seeding Workflows...");
    const startDate = new Date("2025-01-01");
    const endDate = new Date();

    const salesUsers = await prisma.user.findMany({ where: { role: "USER" } });
    const products = await prisma.productList.findMany();
    const transporters = await prisma.transporter.findMany();
    const locations = await prisma.location.findMany();

    if (!salesUsers.length) throw new Error("No sales users found");
    if (!products.length) throw new Error("No products found");
    if (!transporters.length) throw new Error("No transporters found");
    if (!locations.length) throw new Error("No locations found");

    // --- CREATE 10 RANDOM CUSTOMERS FOR EACH SALES USER ---
    const customers: any[] = [];
    for (const user of salesUsers) {
        const userLocation = locations.find((l) => l.id === user.locationId) || faker.helpers.arrayElement(locations);
        for (let i = 0; i < 10; i++) {
            const customer = await prisma.customer.create({
                data: {
                    name: `Customer ${customers.length + 1}`,
                    email: faker.internet.email(),
                    phone: faker.phone.number(),
                    country: "Zambia",
                    city: userLocation.name,
                    locationId: userLocation.id,
                    userId: user.id,
                    createdById: user.managerId || user.id,
                },
            });
            customers.push(customer);
        }
    }
    console.log(`✅ Created ${customers.length} random customers`);

    // --- CREATE SALES ORDERS, SALES & DELIVERY ---
    for (const customer of customers) {
        const location = locations.find((l) => l.id === customer.locationId);
        if (!location) continue;

        // --- CREATE SALES ORDER ---
        const orderNumber = await getNextSequence("SO");
        const orderDate = dateRange(startDate, endDate);
        const order = await prisma.salesOrder.create({
            data: {
                orderNumber,
                customerId: customer.id,
                locationId: location.id,
                createdById: customer.userId,
                status: "PENDING",
                createdAt: orderDate,
            },
        });

        const orderProducts = faker.helpers.arrayElements(products, 2);
        for (const product of orderProducts) {
            await prisma.salesOrderItem.create({
                data: {
                    salesOrderId: order.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 1, max: 5 }),
                },
            });
        }

        // --- CREATE SALE / INVOICE ---
        const orderItems = await prisma.salesOrderItem.findMany({ where: { salesOrderId: order.id } });
        if (!orderItems.length) continue;

        const invoiceNumber = await getNextSequence("INV");
        const invoiceDate = dateRange(orderDate, endDate); // invoice date >= order date
        const sale = await prisma.sale.create({
            data: {
                invoiceNumber,
                salesOrderId: order.id,
                locationId: location.id,
                customerId: customer.id,
                createdById: customer.userId,
                saleDate: invoiceDate,
                status: "PENDING",
            },
        });

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

        // --- CREATE DELIVERY NOTE ---
        const deliveryNoteNo = await getNextSequence("DN");
        await prisma.deliveryNote.create({
            data: {
                deliveryNoteNo,
                saleId: sale.id, // maintain invoice → delivery note relation
                salesOrderId: order.id,
                locationId: location.id,
                transporterId: faker.helpers.arrayElement(transporters).id,
                dispatchedAt: invoiceDate, // same as sale date
                createdById: customer.userId,
                items: {
                    create: orderItems.map((i) => ({ productId: i.productId, quantityDelivered: i.quantity })),
                },
            },
        });
    }

    console.log("✅ Sales Orders, Sales, Delivery Notes created with matching dates");
}
