import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 10;

    if (!userId) {
        return NextResponse.json({ error: 'userId is required' }, { status: 400 });
    }

    try {
        const skip = (page - 1) * limit;
        const sales = await prisma.sales.findMany({
            where: { userId },
            include: {
                product: {
                    select: {
                        name: true,
                        sku: true,
                        price: true,
                    },
                },
            },
            orderBy: { saleDate: 'desc' },
            skip,
            take: limit,
        });

        const totalSales = await prisma.sales.count({ where: { userId } });
        const totalPages = Math.ceil(totalSales / limit);

        return NextResponse.json({
            success: true,
            data: sales,
            pagination: { page, limit, totalPages, totalSales },
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch sales' }, { status: 500 });
    }
}
export async function POST(request) {
    try {
        const { productId, quantity } = await request.json();

        // Find the product
        const product = await prisma.product.findUnique({
            where: { id: productId },
        });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        // Check if enough stock
        if (product.quantity < quantity) {
            return NextResponse.json(
                { error: `Insufficient stock for "${product.name}". Only ${product.quantity} left.` },
                { status: 400 }
            );
        }

        const userId = "4ba8d662-e7b2-4157-9d04-854d2d4601e6"; // Adjust to get actual user ID

        // Create sale and update product quantity in a transaction
        const sale = await prisma.$transaction(async (tx) => {
            await tx.product.update({
                where: { id: productId },
                data: { quantity: { decrement: quantity } },
            });
            const newSale = await tx.sales.create({
                data: {
                    userId,
                    productId,
                    productName: product.name, // Add product name here
                    sku: product.sku,
                    quantity,
                    totalPrice: product.price * quantity,
                },
                include: {
                    product: {
                        select: { name: true, sku: true, price: true },
                    },
                },
            });
            return newSale;
        });

        return NextResponse.json(sale);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to create sale" },
            { status: 500 }
        );
    }
}