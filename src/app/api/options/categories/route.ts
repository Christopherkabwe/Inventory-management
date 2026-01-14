import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // get distinct categories
        const categories = await prisma.productList.findMany({
            select: {
                category: true,
            },
            distinct: ["category"],
            where: { category: { not: null } },
        });

        const options = categories.map(c => ({ id: c.category!, name: c.category! }));

        return NextResponse.json(options);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch categories" }, { status: 500 });
    }
}
