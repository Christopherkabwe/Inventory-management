import { prisma } from '../lib/prisma';

async function main() {
    const userId = "4ba8d662-e7b2-4157-9d04-854d2d4601e6";

    const products = [];
    for (let i = 1; i <= 20; i++) {
        products.push({
            sku: `SKU${String(i).padStart(3, '0')}`,
            name: `Product ${i}`,
            price: parseFloat((Math.random() * 10 + 1).toFixed(2)),
            packSize: Math.floor(Math.random() * 10) + 1,
            weightValue: Math.floor(Math.random() * 5) + 1,
            weightUnit: 'kg',
            createdBy: userId,
        });
    }
    await prisma.productList.createMany({ data: products });

    const customers = [];
    for (let i = 1; i <= 20; i++) {
        customers.push({
            name: `Customer ${i}`,
            email: `customer${i}@example.com`,
            phone: `097${String(Math.floor(Math.random() * 10000000)).padStart(7, '0')}`,
            country: 'Zambia',
            city: ['Lusaka', 'Kitwe', 'Ndola', 'Livingstone'][Math.floor(Math.random() * 4)],
            createdBy: userId,
        });
    }
    await prisma.customer.createMany({ data: customers });

    const productList = await prisma.productList.findMany();
    const productIds = productList.map(p => p.id);
    const locations = ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'];
    const inventories = [];
    const usedCombinations = new Set();
    while (inventories.length < 20) {
        const product = productList[Math.floor(Math.random() * productList.length)];
        const location = locations[Math.floor(Math.random() * locations.length)];
        const key = `${product.id}-${location}`;
        if (!usedCombinations.has(key)) {
            usedCombinations.add(key);
            inventories.push({
                productId: product.id,
                productName: product.name, // Added product name
                location,
                quantity: Math.floor(Math.random() * 100) + 1,
                lowStockAt: Math.floor(Math.random() * 10) + 1,
                createdBy: userId,
            });
        }
    }
    await prisma.inventory.createMany({ data: inventories, skipDuplicates: true });

    const customerIds = (await prisma.customer.findMany()).map(c => c.id);
    const sales = [];
    for (let i = 0; i < 20; i++) {
        const product = productList[Math.floor(Math.random() * productList.length)];
        const quantity = Math.floor(Math.random() * 5) + 1;
        sales.push({
            customerId: customerIds[Math.floor(Math.random() * customerIds.length)],
            productId: product.id,
            productName: product.name, // Added product name
            quantity,
            salePrice: product.price,
            totalAmount: product.price * quantity,
            createdBy: userId,
        });
    }
    await prisma.sale.createMany({ data: sales });

    console.log('Sample data seeded!');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });