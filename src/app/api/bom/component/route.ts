import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.productList.findMany({
            include: {       // if exists
                inventories: true,         // if normalized UOM table
            },
            orderBy: {
                name: "asc"
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error("Failed to fetch BOM components", error);
        return new NextResponse("Failed to fetch components", { status: 500 });
    }
}
