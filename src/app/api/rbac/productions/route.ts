import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import { recordInventoryTransaction } from "@/lib/inventory"; // ✅ updated
import { getCurrentUser } from "@/lib/auth";

// ---------------- GET all productions ----------------
export async function GET() {
    try {
        const productions = await prisma.production.findMany({
            include: {
                location: true,
                createdBy: true,
                items: {
                    include: {
                        product: true,
                        inventoryHistories: true,
                    },
                },
                defects: {
                    include: {
                        product: true,
                        recordedBy: true,
                        inventoryHistories: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: productions });
    } catch (error) {
        console.error("GET productions error:", error);
        return NextResponse.json(
            { error: "Failed to fetch productions" },
            { status: 500 }
        );
    }
}
// ---------------- POST (create new production) ----------------

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { locationId, notes, items } = await req.json();

        if (!locationId || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "Location and at least one item are required" },
                { status: 400 }
            );
        }

        const safeItems = items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
        }));

        if (safeItems.some(i => !i.productId || i.quantity <= 0)) {
            return NextResponse.json(
                { error: "Invalid product or quantity" },
                { status: 400 }
            );
        }

        const productionNo = await nextSequence("PROD");
        const batchNumber = await nextSequence("BATCH");

        const production = await prisma.$transaction(async (tx) => {
            const prod = await tx.production.create({
                data: {
                    productionNo,
                    batchNumber,
                    locationId,
                    notes,
                    status: "DRAFT",
                    createdById: user.id,
                    items: {
                        create: safeItems,
                    },
                },
                include: {
                    items: true,
                },
            });

            for (const item of prod.items) {
                await tx.inventory.upsert({
                    where: {
                        productId_locationId: {
                            productId: item.productId,
                            locationId,
                        },
                    },
                    update: {
                        quantity: { increment: item.quantity },
                    },
                    create: {
                        productId: item.productId,
                        locationId,
                        quantity: item.quantity,
                        lowStockAt: 10,
                        createdById: user.id,
                    },
                });

                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId,
                    delta: item.quantity,
                    source: "PRODUCTION",
                    reference: productionNo,
                    createdById: user.id,
                    productionItemId: item.id,
                    metadata: {
                        batchNumber,
                        notes,
                    },
                });
            }

            return prod;
        });

        await incrementSequence("PROD");
        await incrementSequence("BATCH");

        return NextResponse.json({ data: production });
    } catch (error) {
        console.error("CREATE production error:", error);
        return NextResponse.json(
            { error: "Failed to create production" },
            { status: 500 }
        );
    }
}
