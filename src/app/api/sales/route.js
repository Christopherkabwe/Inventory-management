import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");
        const page = Number(searchParams.get("page") || 1);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : null;
        const skip = limit && (page - 1) * limit;

        if (!userId) {
            return NextResponse.json({ error: "userId is required" }, { status: 400 });
        }

        // Fetch sales with relations
        const [sales, totalSales] = await Promise.all([
            prisma.sale.findMany({
                where: { createdBy: userId },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            country: true,
                            city: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            price: true,
                            packSize: true,
                            category: true,
                            weightValue: true,
                            weightUnit: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    location: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
                orderBy: { createdAt: "desc" },
                ...(limit && { skip, take: limit }),
            }),
            prisma.sale.count({ where: { createdBy: userId } }),
        ]);

        // Return paginated or unpaginated response
        if (limit) {
            return NextResponse.json({
                success: true,
                data: sales,
                pagination: {
                    page,
                    limit,
                    totalSales,
                    totalPages: Math.ceil(totalSales / limit),
                },
            });
        }

        return NextResponse.json({
            success: true,
            data: sales,
            totalSales,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
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

        // Check related records exist
        const [customer, product, inventory] = await Promise.all([
            prisma.customer.findUnique({ where: { id: customerId } }),
            prisma.productList.findUnique({ where: { id: productId } }),
            prisma.inventory.findUnique({ where: { productId_locationId: { productId, locationId } } }),
        ]);

        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });
        if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });
        if (!inventory || inventory.quantity < quantity) {
            return NextResponse.json(
                { error: `Insufficient stock for "${product.name}" at this location. Available: ${inventory?.quantity || 0}.` },
                { status: 400 }
            );
        }

        const totalAmount = salePrice * quantity;
        const sale = await prisma.$transaction(async (tx) => {
            await tx.inventory.update({
                where: { id: inventory.id },
                data: { quantity: { decrement: quantity } },
            });

            const newSale = await tx.sale.create({
                data: {
                    customerId,
                    customerName: customer.name, // add customerName
                    productId,
                    locationId,
                    quantity,
                    salePrice,
                    totalAmount,
                    createdBy: userId,
                },
                include: {
                    customer: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                            phone: true,
                            country: true,
                            city: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    product: {
                        select: {
                            id: true,
                            sku: true,
                            name: true,
                            price: true,
                            packSize: true,
                            category: true,
                            weightValue: true,
                            weightUnit: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                    location: {
                        select: {
                            id: true,
                            name: true,
                            address: true,
                            createdBy: true,
                            createdAt: true,
                            updatedAt: true,
                        },
                    },
                },
            });

            return newSale;
        });

        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Failed to create sale" }, { status: 500 });
    }
}

