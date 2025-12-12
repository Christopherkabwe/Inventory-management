import { prisma } from '@/lib/prisma';

async function getProducts() {
    const products = await prisma.inventory.findMany();
    return products;
}

export default async function ProductsPage() {
    const products = await getProducts();

    return (
        <div>
            <h1>Inventory</h1>
            <ul>
                {products.map((inventory) => (
                    <li key={inventory.id}>
                        {inventory.productName} (quantity: {inventory.quantity})
                    </li>
                ))}
            </ul>
        </div>
    );
}