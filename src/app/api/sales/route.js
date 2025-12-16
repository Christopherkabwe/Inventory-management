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
        const sales = await prisma.sale.findMany({
            where: { createdBy: userId },
            include: {
                product: { select: { name: true, id: true, price: true } },
                customer: { select: { name: true, email: true } },
                location: { select: { name: true } }, // Include location name
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        });

        const totalSales = await prisma.sale.count({ where: { createdBy: userId } });
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
        const { productId, quantity, customerId, salePrice, userId, locationId } = await request.json();

        if (!productId || quantity <= 0 || !customerId || !userId || salePrice <= 0 || !locationId) {
            return NextResponse.json(
                { error: "Missing or invalid fields: product, quantity, customer, user, location or price." },
                { status: 400 }
            );
        }

        const customer = await prisma.customer.findUnique({ where: { id: customerId } });
        if (!customer) {
            return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        }

        const product = await prisma.productList.findUnique({ where: { id: productId } });
        if (!product) {
            return NextResponse.json({ error: "Product not found" }, { status: 404 });
        }

        const inventory = await prisma.inventory.findUnique({
            where: { productId_locationId: { productId, locationId } },
        });
        if (!inventory || inventory.quantity < quantity) {
            return NextResponse.json(
                { error: `Insufficient stock for "${product.name}" at this location. Available: ${inventory?.quantity || 0}.` },
                { status: 400 }
            );
        }

        const totalAmount = salePrice * quantity;
        const customerName = customer.name;

        const sale = await prisma.$transaction(async (tx) => {
            await tx.inventory.update({
                where: { id: inventory.id },
                data: { quantity: { decrement: quantity } },
            });
            const newSale = await tx.sale.create({
                data: {
                    customerId,
                    customerName,
                    productId,
                    productName: product.name,
                    locationId, // Use locationId
                    quantity,
                    salePrice,
                    totalAmount,
                    createdBy: userId,
                },
            });
            return newSale;
        });

        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Failed to create sale" },
            { status: 500 }
        );
    }
}
