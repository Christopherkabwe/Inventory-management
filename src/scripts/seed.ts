import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
    const userId = '4ba8d662-e7b2-4157-9d04-854d2d4601e6';

    /* =====================================================
       0️⃣ CLEAR DATABASE (order matters due to FK constraints)
    ===================================================== */
    console.log('🧹 Clearing database...');
    await prisma.saleItem.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.transferItem.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.productionItem.deleteMany();
    await prisma.production.deleteMany();
    await prisma.adjustmentItem.deleteMany();
    await prisma.adjustment.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.productList.deleteMany();
    await prisma.location.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.transporter.deleteMany();
    await prisma.sequence.deleteMany();
    console.log('✅ Database cleared');

    /* =====================================================
       1️⃣ LOCATIONS
    ===================================================== */
    const locationNames = ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'];
    await prisma.location.createMany({
        data: locationNames.map(name => ({
            name,
            address: faker.location.streetAddress(),
            createdBy: userId,
        })),
    });
    const locations = await prisma.location.findMany();

    /* =====================================================
       2️⃣ PRODUCTS
    ===================================================== */
    const categories = ['Electronics', 'Fashion', 'Home Goods', 'Toys', 'Food'];
    await prisma.productList.createMany({
        data: Array.from({ length: 20 }).map((_, i) => ({
            sku: `SKU${String(i + 1).padStart(3, '0')}`,
            name: `Product ${i + 1}`,
            price: faker.number.float({ min: 10, max: 120 }),
            packSize: faker.number.int({ min: 1, max: 10 }),
            weightValue: faker.number.float({ min: 0.5, max: 5 }),
            weightUnit: 'kg',
            category: faker.helpers.arrayElement(categories),
            createdBy: userId,
        })),
    });
    const products = await prisma.productList.findMany();

    /* =====================================================
       3️⃣ CUSTOMERS
    ===================================================== */
    await prisma.customer.createMany({
        data: Array.from({ length: 15 }).map((_, i) => ({
            name: `Customer ${i + 1}`,
            email: `customer${i + 1}@example.com`,
            phone: faker.phone.number(),
            country: 'Zambia',
            city: faker.helpers.arrayElement(['Lusaka', 'Ndola', 'Kitwe']),
            createdBy: userId,
        })),
    });
    const customers = await prisma.customer.findMany();

    /* =====================================================
       4️⃣ TRANSPORTERS
    ===================================================== */
    await prisma.transporter.createMany({
        data: Array.from({ length: 5 }).map((_, i) => ({
            name: `Transporter ${i + 1}`,
            vehicleNumber: faker.vehicle.vin(),
            driverName: faker.person.fullName(),
        })),
    });
    const transporters = await prisma.transporter.findMany();

    /* =====================================================
       5️⃣ INVENTORIES
    ===================================================== */
    console.log('📦 Creating inventories...');
    const inventoryMap: Record<string, any> = {};
    for (const product of products) {
        for (const location of locations) {
            const qty = faker.number.int({ min: 30, max: 120 });
            const inventory = await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: qty,
                    lowStockAt: 10,
                    createdBy: userId,
                },
            });
            inventoryMap[`${product.id}-${location.id}`] = inventory;
        }
    }

    /* =====================================================
       6️⃣ PRODUCTIONS
    ===================================================== */
    console.log('🏭 Creating productions...');
    for (let i = 0; i < 10; i++) {
        const location = faker.helpers.arrayElement(locations);
        const production = await prisma.production.create({
            data: {
                productionNo: `PROD${String(i + 1).padStart(6, '0')}`,
                locationId: location.id,
                batchNumber: `BATCH${String(i + 1).padStart(4, '0')}`,
                notes: faker.lorem.sentence(),
                createdBy: userId,
            },
        });

        const productionProducts = faker.helpers.arrayElements(products, 3);
        for (const product of productionProducts) {
            await prisma.productionItem.create({
                data: {
                    productionId: production.id,
                    productId: product.id,
                    quantity: faker.number.int({ min: 10, max: 50 }),
                },
            });
        }
    }

    /* =====================================================
       7️⃣ ADJUSTMENTS
    ===================================================== */
    console.log('⚠️ Creating adjustments...');
    for (const key in inventoryMap) {
        const inv = inventoryMap[key];
        if (Math.random() > 0.7) {
            const adj = await prisma.adjustment.create({
                data: {
                    adjustmentNo: `ADJ${faker.string.numeric(6)}`,
                    locationId: inv.locationId,
                    type: 'GAIN',
                    reason: 'Rebagged items',
                    createdBy: userId,
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

    /* =====================================================
       8️⃣ TRANSFERS
    ===================================================== */
    console.log('🚚 Creating transfers...');
    for (let i = 0; i < 30; i++) {
        const fromLocation = faker.helpers.arrayElement(locations);
        const toLocation = faker.helpers.arrayElement(locations.filter(l => l.id !== fromLocation.id));
        const product = faker.helpers.arrayElement(products);

        const transfer = await prisma.transfer.create({
            data: {
                ibtNumber: `IBT${faker.string.numeric(6)}`,
                fromLocationId: fromLocation.id,
                toLocationId: toLocation.id,
                transporterId: faker.helpers.arrayElement(transporters)?.id,
                createdBy: userId,
            },
        });

        await prisma.transferItem.create({
            data: {
                transferId: transfer.id,
                productId: product.id,
                quantity: faker.number.int({ min: 5, max: 20 }),
            },
        });
    }
    /* =====================================================
       9️⃣ SALES
    ===================================================== */
    console.log('💰 Creating sales...');
    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date();

    for (let i = 0; i < 200; i++) {
        const inventory = faker.helpers.arrayElement(Object.values(inventoryMap));
        const customer = faker.helpers.arrayElement(customers);
        const transporter = faker.helpers.arrayElement(transporters);
        const qty = faker.number.int({ min: 1, max: 5 });
        const salePrice = faker.number.float({ min: 50, max: 500 });
        const total = qty * salePrice;
        const saleDate = faker.date.between({ from: startDate, to: endDate });

        const invoiceNumber = `INV${String(i + 1).padStart(6, '0')}`;
        const deliveryNote = `DN${String(i + 1).padStart(6, '0')}`;

        const sale = await prisma.sale.create({
            data: {
                invoiceNumber,
                deliveryNote,
                customerId: customer.id,
                locationId: inventory.locationId,
                transporterId: transporter?.id,
                saleDate,
                createdBy: userId,
            },
        });

        await prisma.saleItem.create({
            data: {
                saleId: sale.id,
                productId: inventory.productId,
                quantity: qty,
                price: salePrice,
                total,
            },
        });
    }
    console.log('✅ FULL SEED COMPLETED SUCCESSFULLY');
}

main()
    .catch(e => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
