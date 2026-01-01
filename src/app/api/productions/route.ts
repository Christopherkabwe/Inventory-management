import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* GET /api/productions*/
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;

        const productions = await prisma.production.findMany({
            ...(limit ? { take: limit } : {}),
            orderBy: { createdAt: "desc" },
            include: {
                items: {
                    include: { product: true },
                },
                location: true,
            },
        });

        return NextResponse.json({ productions });
    } catch (error) {
        console.error("Fetch productions failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch productions" },
            { status: 500 }
        );
    }
}

/* POST /api/productions */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { locationId, items, batchNumber, notes } = body;

        if (!locationId || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            try {
                const seq = await tx.sequence.upsert({
                    where: { id: "PROD" },
                    update: { value: { increment: 1 } },
                    create: { id: "PROD", value: 1 },
                });

                const productionNo = `PROD${seq.value.toString().padStart(6, "0")}`;

                const production = await tx.production.create({
                    data: {
                        productionNo,
                        locationId,
                        batchNumber,
                        notes,
                        createdBy: "system",
                    },
                });

                for (const item of items) {
                    const { productId, quantity } = item;

                    if (!productId || quantity <= 0) {
                        throw new Error("Invalid item");
                    }

                    await tx.productionItem.create({
                        data: {
                            productionId: production.id,
                            productId,
                            quantity,
                        },
                    });

                    await tx.inventory.upsert({
                        where: {
                            productId_locationId: {
                                productId,
                                locationId,
                            },
                        },
                        update: {
                            quantity: { increment: quantity },
                        },
                        create: {
                            productId,
                            locationId,
                            quantity,
                            lowStockAt: 0,
                            createdBy: "system",
                        },
                    });
                }

                return production;
            } catch (error) {
                await tx.$rollback();
                throw error;
            }
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Create production failed:", error);
        return NextResponse.json(
            { error: "Failed to create production" },
            { status: 500 }
        );
    }
}
