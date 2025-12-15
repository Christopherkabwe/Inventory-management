import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    try {
        const products = await prisma.productList.findMany({
            where: userId ? { createdBy: userId } : {}, // Filter by userId if provided
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                inventories: {
                    select: {
                        quantity: true,
                        location: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });

        // Aggregate inventory quantity per product
        const productsWithTotalQuantity = products.map(product => ({
            ...product,
            quantity: product.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
        }));

        return NextResponse.json({ products: productsWithTotalQuantity || [] });
    } catch (error) {
        console.error("Product fetch error:", error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, sku, price, userId, location, quantity = 0 } = await request.json();

        // Basic validation
        if (!name || !sku || price <= 0 || !userId || !location || quantity <= 0) {
            return NextResponse.json(
                { error: 'Missing or invalid fields: name, sku, price, user, location, or quantity.' },
                { status: 400 }
            );
        }

        // Check for unique SKU
        const existingProduct = await prisma.productList.findUnique({ where: { sku } });
        if (existingProduct) {
            return NextResponse.json({ error: 'SKU already exists.' }, { status: 409 });
        }

        // Create product and inventory in a transaction
        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.productList.create({
                data: {
                    name,
                    sku,
                    price,
                    createdBy: userId,
                },
            });

            await tx.inventory.create({
                data: {
                    productId: newProduct.id,
                    productName: newProduct.name,
                    location,
                    quantity,
                    lowStockAt: 5, // Adjust as needed
                    createdBy: userId,
                },
            });

            return newProduct;
        });

        // Fetch the product with inventory data
        const productWithQuantity = await prisma.productList.findUnique({
            where: { id: product.id },
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                inventories: {
                    select: { quantity: true, location: true },
                },
            },
        });

        const totalQuantity = productWithQuantity.inventories.reduce(
            (sum, inv) => sum + inv.quantity,
            0
        );
        return NextResponse.json(
            { ...productWithQuantity, quantity: totalQuantity },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}