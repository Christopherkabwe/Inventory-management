import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.productList.findMany({
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                category: true,
                packSize: true,
                weightUnit: true,
                weightValue: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(products);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
    }
}
