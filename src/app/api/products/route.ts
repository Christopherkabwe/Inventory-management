import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const products = await prisma.productList.findMany({
        select: {
            id: true,
            name: true,
            sku: true,
            category: true,
            packSize: true,
            weightValue: true,
            weightUnit: true,
            costPerBag: true,
        },
    });

    return NextResponse.json(products);
}
