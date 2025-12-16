import { prisma } from '../lib/prisma';

async function main() {
    const userId = "4ba8d662-e7b2-4157-9d04-854d2d4601e6";

    // Create Locations
    const locations = ['Warehouse A', 'Warehouse B', 'Store 1', 'Store 2'];
    const locationData = locations.map(name => ({
        name,
        address: `Address for ${name}`,
        createdBy: userId,
    }));
    await prisma.location.createMany({ data: locationData, skipDuplicates: true });
    const locationList = await prisma.location.findMany();

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
    const productList = await prisma.productList.findMany();

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
    const customersList = await prisma.customer.findMany();

    // Create Inventories
    const inventories = [];
    const usedCombinations = new Set();
    while (inventories.length < 20) {
        const product = productList[Math.floor(Math.random() * productList.length)];
        const location = locationList[Math.floor(Math.random() * locationList.length)];
        const key = `${product.id}-${location.id}`;
        if (!usedCombinations.has(key)) {
            usedCombinations.add(key);
            inventories.push({
                productId: product.id,
                locationId: location.id,
                quantity: Math.floor(Math.random() * 100) + 1,
                lowStockAt: Math.floor(Math.random() * 10) + 1,
                createdBy: userId,
            });
        }
    }
    await prisma.inventory.createMany({ data: inventories, skipDuplicates: true });
    const inventoryList = await prisma.inventory.findMany();

    // Create Sales
    const sales = [];
    for (let i = 0; i < 20; i++) {
        const inventory = inventoryList[Math.floor(Math.random() * inventoryList.length)];
        const product = productList.find(p => p.id === inventory.productId);
        const customer = customersList[Math.floor(Math.random() * customersList.length)];
        const location = locationList.find(l => l.id === inventory.locationId);
        const maxQty = Math.min(inventory.quantity, 5);
        const quantity = Math.floor(Math.random() * Math.max(maxQty, 1)) + 1;

        sales.push({
            customerId: customer.id,
            customerName: customer.name,
            productId: product.id,
            productName: product.name,
            quantity,
            locationId: location.id,
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