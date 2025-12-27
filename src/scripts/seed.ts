import { prisma } from '@/lib/prisma';
import { faker } from '@faker-js/faker';

async function main() {
    const userId = '4ba8d662-e7b2-4157-9d04-854d2d4601e6';

    /* =====================================================
       0️⃣ HARD RESET (ORDER MATTERS)
    ===================================================== */
    console.log('🧹 Resetting database...');
    await prisma.stockMovement.deleteMany();
    await prisma.sale.deleteMany();
    await prisma.inventory.deleteMany();
    await prisma.customer.deleteMany();
    await prisma.productList.deleteMany();
    await prisma.location.deleteMany();
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

    /*===================================================
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
       4️⃣ INVENTORIES + OPENING STOCK
    ===================================================== */
    console.log('📦 Creating inventories & opening stock...');

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

            await prisma.stockMovement.create({
                data: {
                    inventoryId: inventory.id,
                    type: 'OPENING',
                    quantity: openingStock,
                    openingStock,
                    closingStock: openingStock,
                    createdBy: userId,
                },
            });
        }
    }

    /* =====================================================
       5️⃣ RECEIPTS, RETURNS, DAMAGE, EXPIRED, REBAG
    ===================================================== */
    console.log('🔄 Adding stock movements...');

    for (const key in inventoryMap) {
        const inventory = inventoryMap[key];
        let current = inventory.quantity;

        const addMovement = async (
            type: string,
            qty: number,
            affectsStock: boolean
        ) => {
            await prisma.stockMovement.create({
                data: {
                    inventoryId: inventory.id,
                    type,
                    quantity: qty,
                    openingStock: current,
                    closingStock: affectsStock ? current + qty : current,
                    createdBy: userId,
                },
            });

            if (affectsStock) {
                current += qty;
            }
        };

        if (Math.random() > 0.4) {
            await addMovement('RECEIPT', faker.number.int({ min: 10, max: 40 }), true);
        }

        if (Math.random() > 0.6) {
            await addMovement('RETURN', faker.number.int({ min: 1, max: 6 }), true);
        }

        if (Math.random() > 0.5) {
            await addMovement('DAMAGED', faker.number.int({ min: 1, max: 5 }), false);
        }

        if (Math.random() > 0.6) {
            await addMovement('EXPIRED', faker.number.int({ min: 1, max: 4 }), false);
        }

        if (Math.random() > 0.7) {
            await addMovement('REBAG_GAIN', faker.number.int({ min: 1, max: 3 }), true);
        }

        if (Math.random() > 0.8) {
            const loss = faker.number.int({ min: 1, max: 3 });
            await prisma.stockMovement.create({
                data: {
                    inventoryId: inventory.id,
                    type: 'REBAG_LOSS',
                    quantity: loss,
                    openingStock: current,
                    closingStock: current - loss,
                    createdBy: userId,
                },
            });
            current -= loss;
        }

        await prisma.inventory.update({
            where: { id: inventory.id },
            data: { quantity: current },
        });
    }

    /* =====================================================
       6️⃣ TRANSFERS (BALANCED)
    ===================================================== */
    console.log('🚚 Creating transfers...');

    for (let i = 0; i < 30; i++) {
        const product = faker.helpers.arrayElement(products);

        const source = faker.helpers.arrayElement(
            locations.map(l => inventoryMap[`${product.id}-${l.id}`])
        );

        const target = faker.helpers.arrayElement(
            locations
                .filter(l => l.id !== source.locationId)
                .map(l => inventoryMap[`${product.id}-${l.id}`])
        );

        if (!source || !target || source.quantity < 10) continue;

        const qty = faker.number.int({ min: 5, max: 15 });

        await prisma.stockMovement.create({
            data: {
                inventoryId: source.id,
                type: 'TRANSFER_OUT',
                quantity: qty,
                openingStock: source.quantity,
                closingStock: source.quantity - qty,
                createdBy: userId,
            },
        });

        await prisma.stockMovement.create({
            data: {
                inventoryId: target.id,
                type: 'TRANSFER_IN',
                quantity: qty,
                openingStock: target.quantity,
                closingStock: target.quantity + qty,
                createdBy: userId,
            },
        });

        await prisma.inventory.update({
            where: { id: source.id },
            data: { quantity: source.quantity - qty },
        });

        await prisma.inventory.update({
            where: { id: target.id },
            data: { quantity: target.quantity + qty },
        });

        source.quantity -= qty;
        target.quantity += qty;
    }

    /* =====================================================
   7️⃣ SALES (INVENTORY + MOVEMENTS)
===================================================== */
    console.log('💰 Creating sales...');

    const startDate = new Date('2023-01-01');
    const endDate = new Date();

    function generateRandomDate(startDate: Date, endDate: Date): Date {
        const timeDiff = endDate.getTime() - startDate.getTime();
        return new Date(startDate.getTime() + Math.random() * timeDiff);
    }

    for (let i = 0; i < 200; i++) {
        const saleDate = generateRandomDate(startDate, endDate);
        const inventory = faker.helpers.arrayElement(Object.values(inventoryMap));
        if (inventory.quantity < 5) continue;

        const qty = faker.number.int({ min: 1, max: 5 });
        const salePrice = faker.number.float({ min: 100, max: 600 });
        const totalAmount = qty * salePrice;

        await prisma.sale.create({
            data: {
                productId: inventory.productId,
                productName: products.find(p => p.id === inventory.productId)?.name,
                customerId: faker.helpers.arrayElement(customers).id,
                customerName: faker.helpers.arrayElement(customers).name,
                locationId: inventory.locationId,
                quantity: qty,
                salePrice,
                totalAmount,
                saleDate,
                createdBy: userId,
            },
        });

        await prisma.stockMovement.create({
            data: {
                inventoryId: inventory.id,
                type: 'SALE',
                quantity: qty,
                openingStock: inventory.quantity,
                closingStock: inventory.quantity - qty,
                createdBy: userId,
            },
        });

        inventory.quantity -= qty;

        await prisma.inventory.update({
            where: { id: inventory.id },
            data: { quantity: inventory.quantity },
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
