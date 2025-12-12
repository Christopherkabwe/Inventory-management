import { prisma } from '../lib/prisma';

const demoUserId = "4ba8d662-e7b2-4157-9d04-854d2d4601e6"

async function generateRandomSales(count = 10) {
    const user = demoUserId;
    if (!user) {
        console.error('No user authenticated.');
        return;
    }
    const userId = user

    try {
        // Fetch products
        const products = await prisma.product.findMany({
            where: { userId },
            select: { id: true, sku: true, price: true },
        });

        if (products.length === 0) {
            console.log('No products found for the user.');
            return;
        }

        // Generate random sales
        const sales = [];
        for (let i = 0; i < count; i++) {
            const product = products[Math.floor(Math.random() * products.length)];
            const quantity = Math.floor(Math.random() * 5) + 1; // 1-5 quantity
            sales.push({
                userId,
                productId: product.id,
                productName: `Product ${i + 1}`,
                sku: product.sku,
                quantity,
                price: (product.price),
                totalRevenue: Number(product.price) * quantity, // Use Number() instead of parseFloat
            });
        }

        // Insert sales
        await prisma.sales.createMany({ data: sales, skipDuplicates: true }); // Add skipDuplicates to avoid errors
        console.log(`Created ${count} random sales for user ${userId}.`);
    } catch (error) {
        console.error('Error generating sales:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Run the script
generateRandomSales(20);