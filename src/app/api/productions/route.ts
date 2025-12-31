import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/productions?limit=10
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limit = Number(searchParams.get("limit")) || 10;

        const productions = await prisma.production.findMany({
            take: limit,
            orderBy: { createdAt: "desc" },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        packSize: true,
                        weightValue: true,
                        weightUnit: true,
                    },
                },
            },
        });

        return NextResponse.json({ productions });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch productions" },
            { status: 500 }
        );
    }
}
// POST /api/productions
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { productId, quantity, locationId } = body;

        if (!productId || !locationId || quantity <= 0) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1️⃣ Create production record
            const production = await tx.production.create({
                data: {
                    productId,
                    quantity,
                    createdBy: "system", // or session user
                },
                include: {
                    product: true,
                },
            });

            // 2️⃣ Update or create inventory
            const inventory = await tx.inventory.upsert({
                where: {
                    productId_locationId: {
                        productId,
                        locationId,
                    },
                },
                update: {
                    quantity: {
                        increment: quantity,
                    },
                },
                create: {
                    productId,
                    locationId,
                    quantity,
                    lowStockAt: 0,
                    createdBy: "system",
                },
            });

            return { production, inventory };
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Production transaction failed:", error);
        return NextResponse.json(
            { error: "Failed to create production" },
            { status: 500 }
        );
    }
}
