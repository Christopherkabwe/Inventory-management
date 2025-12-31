import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
    const userId = '4ba8d662-e7b2-4157-9d04-854d2d4601e6';

    /* =====================================================
       0️⃣ CLEAR DATABASE
    ===================================================== */
    console.log('🧹 Resetting database...');
    await prisma.sale.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.production.deleteMany();
    await prisma.adjustment.deleteMany();
    await prisma.productList.deleteMany();
    await prisma.location.deleteMany();
    await prisma.customer.deleteMany();
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
            weightValue: faker.number.int({ min: 1, max: 5 }),
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
       4️⃣ INVENTORIES (OPENING STOCK)
    ===================================================== */
    console.log('📦 Creating inventories...');
    const inventoryMap: Record<string, any> = {};
    for (const product of products) {
        for (const location of locations) {
            const openingStock = faker.number.int({ min: 30, max: 120 });
            const inventory = await prisma.inventory.create({
                data: {
                    productId: product.id,
                    locationId: location.id,
                    quantity: openingStock,
                    lowStockAt: 10,
                    createdBy: userId,
                },
            });
            inventoryMap[`${product.id}-${location.id}`] = inventory;
        }
    }

    /* =====================================================
       5️⃣ PRODUCTIONS
    ===================================================== */
    console.log('🏭 Adding productions...');
    for (const product of products) {
        const quantity = faker.number.int({ min: 20, max: 50 });
        await prisma.production.create({
            data: {
                productId: product.id,
                quantity,
                createdBy: userId,
            },
        });
    }

    /* =====================================================
       6️⃣ ADJUSTMENTS (REBAG, DAMAGE, EXPIRED)
    ===================================================== */
    console.log('⚠️ Adding adjustments...');
    for (const key in inventoryMap) {
        const inventory = inventoryMap[key];
        if (Math.random() > 0.7) {
            await prisma.adjustment.create({
                data: {
                    productId: inventory.productId,
                    locationId: inventory.locationId,
                    type: 'REBAG_GAIN',
                    quantity: faker.number.int({ min: 1, max: 5 }),
                    createdBy: userId,
                },
            });
        }
        if (Math.random() > 0.6) {
            await prisma.adjustment.create({
                data: {
                    productId: inventory.productId,
                    locationId: inventory.locationId,
                    type: 'DAMAGED',
                    quantity: faker.number.int({ min: 1, max: 3 }),
                    createdBy: userId,
                },
            });
        }
        if (Math.random() > 0.7) {
            await prisma.adjustment.create({
                data: {
                    productId: inventory.productId,
                    locationId: inventory.locationId,
                    type: 'EXPIRED',
                    quantity: faker.number.int({ min: 1, max: 3 }),
                    createdBy: userId,
                },
            });
        }
    }

    /* =====================================================
       7️⃣ TRANSFERS
    ===================================================== */
    console.log('🚚 Adding transfers...');
    for (let i = 0; i < 30; i++) {
        const product = faker.helpers.arrayElement(products);
        const source = faker.helpers.arrayElement(locations);
        const target = faker.helpers.arrayElement(locations.filter(l => l.id !== source.id));
        const qty = faker.number.int({ min: 5, max: 15 });
        await prisma.transfer.create({
            data: {
                productId: product.id,
                fromLocationId: source.id,
                toLocationId: target.id,
                quantity: qty,
                createdBy: userId,
            },
        });
    }

    /* =====================================================
   8️⃣ SALES (SPREAD ACROSS 2024 → NOW)
===================================================== */
    console.log('💰 Creating sales...');

    const startDate = new Date('2024-01-01T00:00:00Z');
    const endDate = new Date();

    for (let i = 0; i < 200; i++) {
        const inventory = faker.helpers.arrayElement(Object.values(inventoryMap));
        const customer = faker.helpers.arrayElement(customers);
        const qty = faker.number.int({ min: 1, max: 5 });
        const salePrice = faker.number.float({ min: 100, max: 600 });
        const totalAmount = qty * salePrice;

        const saleDate = faker.date.between({
            from: startDate,
            to: endDate,
        });

        await prisma.sale.create({
            data: {
                productId: inventory.productId,
                customerId: customer.id,
                customerName: customer.name,
                locationId: inventory.locationId,
                quantity: qty,
                salePrice,
                totalAmount,
                isReturn: Math.random() > 0.8,
                saleDate,          // ✅ IMPORTANT
                createdAt: saleDate, // ✅ KEEP IN SYNC
                createdBy: userId,
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
