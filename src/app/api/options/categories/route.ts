import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // get distinct categories
        const categories = await prisma.productList.findMany({
            select: {
                category: true,
                subCategory: true,
            },
            distinct: ["category"],
            where: { category: { not: null } },
        });

        return NextResponse.json(categories);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
