import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const productId = searchParams.get("productId");
    const locationId = searchParams.get("locationId");

    if (!productId || !locationId) {
        return NextResponse.json(
            { error: "productId and locationId are required" },
            { status: 400 }
        );
    }

    try {
        const inventory = await prisma.inventory.findFirst({
            where: {
                productId,
                locationId,
            },
            select: {
                quantity: true,
            },
        });

        return NextResponse.json({
            availableQuantity: inventory?.quantity ?? 0,
        });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch inventory" },
            { status: 500 }
        );
    }
}
