import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    try {
        const products = await prisma.product.findMany({
            where: userId ? { userId } : {}, // Filter by userId if provided
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        return NextResponse.json({ products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const { name, sku, price, userId } = await request.json();

        // Basic validation
        if (!name || !sku || !price || !userId) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const product = await prisma.product.create({
            data: {
                name,
                sku,
                price: Number(price), // Ensure price is a number
                userId,
            },
        });
        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
    }
}