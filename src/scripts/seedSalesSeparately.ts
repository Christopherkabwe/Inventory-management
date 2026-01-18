import { prisma } from "@/lib/prisma";
import { faker } from "@faker-js/faker";
import { recordInventoryTransaction } from "@/lib/inventory";

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

async function adjustInventory(
    productId: string,
    locationId: string,
    delta: number,
    source: string,
    reference: string,
    createdById: string
) {
    await prisma.inventory.upsert({
        where: { productId_locationId: { productId, locationId } },
        update: { quantity: { increment: delta } },
        create: {
            productId,
            locationId,
            quantity: delta,
            lowStockAt: 10,
            createdById,
        },
    });

    await recordInventoryTransaction({
        tx: prisma,
        productId,
        locationId,
        delta,
        source,
        reference,
        createdById,
    });
}

async function clearSalesData() {
    console.log("🧹 Clearing sales-related data...");

    await prisma.deliveryNoteItem.deleteMany();
    await prisma.deliveryNote.deleteMany();

    await prisma.saleItem.deleteMany();
    await prisma.saleReturn.deleteMany();
    await prisma.creditNote.deleteMany();
    await prisma.sale.deleteMany();

    await prisma.salesOrderItem.deleteMany();
    await prisma.salesOrder.deleteMany();

    console.log("✅ Sales data cleared");
}

export async function seedSales() {
    console.log("🚀 Seeding sales...");

    // 🔥 CLEAR FIRST
    await clearSalesData();

    const products = await prisma.productList.findMany();
    const customers = await prisma.customer.findMany();
    const users = await prisma.user.findMany({ where: { role: "USER" } });
    const locations = await prisma.location.findMany();
    const transporters = await prisma.transporter.findMany();

    if (!products.length || !customers.length || !users.length) {
        console.warn("⚠️ Missing prerequisite data, skipping sales seed");
        return;
    }

    const salesOrders: any[] = [];

    // -------------------- SALES ORDERS --------------------
    for (let i = 0; i < 50; i++) {
        const user = pickRandom(users);
        const userCustomers = customers.filter(c => c.userId === user.id);
        if (!userCustomers.length) continue;

        const customer = pickRandom(userCustomers);
        const location = locations.find(l => l.id === customer.locationId)!;

        const order = await prisma.salesOrder.create({
            data: {
                orderNumber: await getNextSequence("SO"),
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

    // -------------------- SALES --------------------
    for (let i = 0; i < 10; i++) {
        const order = pickRandom(salesOrders);
        const customer = customers.find(c => c.id === order.customerId)!;
        const location = locations.find(l => l.id === order.locationId)!;

        await prisma.$transaction(async tx => {
            const newSale = await tx.sale.create({
                data: {
                    invoiceNumber: await getNextSequence("INV"),
                    salesOrderId: order.id,
                    locationId: location.id,
                    customerId: customer.id,
                    createdById: order.createdById,
                    saleDate: randomDate(),
                    status: "PENDING",
                },
            });

            const orderItems = await tx.salesOrderItem.findMany({
                where: { salesOrderId: order.id },
            });

            const saleItems = orderItems.map(item => ({
                saleId: newSale.id,
                productId: item.productId,
                quantity: item.quantity,
                price: faker.number.float({ min: 50, max: 500 }),
                total: item.quantity * faker.number.float({ min: 50, max: 500 }),
            }));

            await tx.saleItem.createMany({
                data: saleItems,
            });

            // Inventory deduction
            await Promise.all(orderItems.map(item =>
                adjustInventory(
                    item.productId,
                    newSale.locationId,
                    -item.quantity,
                    "SALE",
                    newSale.id,
                    newSale.createdById,
                ),
            ));

            // Delivery Note
            const transporter = pickRandom(transporters);
            await tx.deliveryNote.create({
                data: {
                    deliveryNoteNo: await getNextSequence("DN"),
                    saleId: newSale.id,
                    salesOrderId: order.id,
                    locationId: location.id,
                    transporterId: transporter.id,
                    dispatchedAt: randomDate(),
                    createdById: newSale.createdById,
                    items: {
                        create: orderItems.map(i => ({
                            productId: i.productId,
                            quantityDelivered: i.quantity,
                        })),
                    },
                },
            });
        });
    }

    console.log("✅ Sales seed completed");
}

seedSales()
    .catch(e => {
        console.error("❌ Seed failed:", e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
