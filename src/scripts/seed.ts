import { prisma } from '../lib/prisma';

async function main() {
    const userId = "4ba8d662-e7b2-4157-9d04-854d2d4601e6";

    // Create Products
    const products = [];
    for (let i = 1; i <= 20; i++) {
        const sku = `SKU${String(i).padStart(3, '0')}`;
        products.push({
            sku,
            name: `Product ${i}`,
            price: parseFloat((Math.random() * 10 + 1).toFixed(2)),
            packSize: Math.floor(Math.random() * 10) + 1,
            weightValue: Math.floor(Math.random() * 5) + 1,
            weightUnit: 'kg',
            createdBy: userId,
        });
    }
    await prisma.productList.createMany({ data: products, skipDuplicates: true });

    // Create Customers
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
    await prisma.customer.createMany({ data: customers, skipDuplicates: true });

    // Create Inventories
    const productList = await prisma.productList.findMany();
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
                location,
                quantity: Math.floor(Math.random() * 100) + 1,
                lowStockAt: Math.floor(Math.random() * 10) + 1,
                createdBy: userId,
            });
        }
    }
    await prisma.inventory.createMany({ data: inventories, skipDuplicates: true });

    // Create Sales
    const customersList = await prisma.customer.findMany();
    const sales = [];
    for (let i = 0; i < 20; i++) {
        const product = productList[Math.floor(Math.random() * productList.length)];
        const customer = customersList[Math.floor(Math.random() * customersList.length)];
        const inventory = await prisma.inventory.findFirst({ where: { productId: product.id } });
        const maxQty = inventory ? Math.min(inventory.quantity, 5) : 1;
        const quantity = Math.floor(Math.random() * Math.max(maxQty, 1)) + 1;
        sales.push({
            customerId: customer.id,
            customerName: customer.name,
            productId: product.id,
            productName: product.name,
            quantity,
            salePrice: product.price,
            totalAmount: product.price * quantity,
            createdBy: userId,
        });
    }
    await prisma.sale.createMany({ data: sales, skipDuplicates: true });

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
