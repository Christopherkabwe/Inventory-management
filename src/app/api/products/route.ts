import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
    const user = getCurrentUser();
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search");
    const category = searchParams.get("category");
    const userId = user.id;  // <-- new

    try {
        const where: any = { createdById: userId };
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { sku: { contains: search, mode: "insensitive" } },
            ];
        }
        if (category) {
            where.category = category;  // exact match filter
        }

        const products = await prisma.productList.findMany({
            where,
            include: { inventories: { select: { quantity: true, location: true } } },
            orderBy: { createdAt: "desc" },
        });

        const productsWithQuantity = products.map((p) => ({
            ...p,
            quantity: p.inventories.reduce((sum, inv) => sum + inv.quantity, 0),
        }));

        return NextResponse.json({ products: productsWithQuantity });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = getCurrentUser();
    try {
        const { name, sku, price, packSize, weightValue, weightUnit, category, location, quantity } = await req.json();

        if (!name || !sku || price <= 0 || !location || !packSize || !weightValue || !weightUnit || quantity <= 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const existing = await prisma.productList.findUnique({ where: { sku } });
        if (existing) return NextResponse.json({ error: "SKU already exists" }, { status: 409 });

        const product = await prisma.$transaction(async (tx) => {
            const newProduct = await tx.productList.create({
                data: {
                    name,
                    sku,
                    price,
                    packSize,
                    weightValue,
                    weightUnit,
                    category,       // <--- added category
                    createdById: user.id
                },
            });

            await tx.inventory.create({
                data: {
                    productId: newProduct.id,
                    locationId: location,
                    quantity,
                    lowStockAt: 5,
                    createdById: user.id
                },
            });

            return newProduct;
        });

        return NextResponse.json(product, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
    }
}
