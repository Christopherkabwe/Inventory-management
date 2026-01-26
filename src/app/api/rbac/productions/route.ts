import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import { recordInventoryTransaction } from "@/lib/inventory"; // ✅ updated

// ---------------- GET all productions ----------------
export async function GET() {
    try {
        const productions = await prisma.production.findMany({
            include: {
                items: { include: { product: true } },
                location: true,
                createdBy: true,
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: productions });
    } catch (error) {
        console.error("GET productions error:", error);
        return NextResponse.json({ error: "Failed to fetch productions" }, { status: 500 });
    }
}

// ---------------- POST (create new production) ----------------
export async function POST(req: NextRequest) {
    try {
        const { locationId, notes, items, createdById } = await req.json();

        if (!locationId || !items || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Ensure items are valid numbers
        const safeItems = items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity) || 0,
        }));

        if (safeItems.some(i => !i.productId || i.quantity <= 0)) {
            return NextResponse.json({ error: "All items must have valid productId and quantity > 0" }, { status: 400 });
        }

        const productionNo = await nextSequence("PROD");
        const batchNumber = await nextSequence("BATCH");
        const userId = createdById || "system";
        const production = await prisma.production.create({
            data: {
                productionNo,
                batchNumber,
                locationId,
                notes,
                createdById: userId,
                items: {
                    create: safeItems,
                },
            },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                location: true,
                createdBy: true
            },
        });

        try {
            // Update inventory
            for (const item of safeItems) {
                await prisma.inventory.upsert({
                    where: {
                        productId_locationId: {
                            productId: item.productId,
                            locationId
                        }
                    },
                    update: {
                        quantity: { increment: item.quantity }
                    },
                    create: {
                        productId: item.productId,
                        locationId,
                        quantity: item.quantity,
                        lowStockAt: 10,
                        createdById: userId
                    },
                });

                // ✅ record inventory using Option A
                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId,
                    delta: item.quantity,
                    source: "PRODUCTION",
                    reference: production.productionNo,
                    createdById: userId,
                    metadata: { notes },
                });
            }
        } catch (error) {
            console.error('Error recording inventory transaction:', error);
        }
        await incrementSequence("BATCH");
        await incrementSequence("PROD");
        return NextResponse.json({ data: production });
    } catch (error) {
        console.error('Error creating production:', error);
        return NextResponse.json({ error: "Failed to create production" }, { status: 500 });
    }
}
