import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/adjustments?limit=10&page=1
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const skip = limit ? (page - 1) * limit : undefined;

        const [adjustments, total] = await Promise.all([
            prisma.adjustment.findMany({
                orderBy: { createdAt: "desc" },
                ...(limit ? { skip, take: limit } : {}),
                include: {
                    location: true,
                    items: { include: { product: true } },
                },
            }),
            prisma.adjustment.count(),
        ]);

        if (limit) {
            return NextResponse.json({
                success: true,
                data: adjustments,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }

        return NextResponse.json({ success: true, data: adjustments, total });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch adjustments" }, { status: 500 });
    }
}

// POST /api/adjustments
export async function POST(req: Request) {
    try {
        const { locationId, type, reason, items, createdBy } = await req.json();

        if (!locationId || !type || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Generate adjustment number
            const seq = await tx.sequence.upsert({
                where: { id: "ADJ" },
                update: { value: { increment: 1 } },
                create: { id: "ADJ", value: 1 },
            });
            const adjustmentNo = `ADJ${seq.value.toString().padStart(6, "0")}`;

            // Create adjustment
            const adjustment = await tx.adjustment.create({
                data: {
                    adjustmentNo,
                    locationId,
                    type,
                    reason,
                    createdBy,
                },
            });

            // Create adjustment items and update inventory
            for (const item of items) {
                const { productId, quantity } = item;
                if (!productId || quantity <= 0) throw new Error("Invalid item");

                // Create AdjustmentItem
                await tx.adjustmentItem.create({
                    data: {
                        adjustmentId: adjustment.id,
                        productId,
                        quantity,
                    },
                });

                // Update inventory
                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);

                let updatedQty = inventory.quantity;
                if (type.toUpperCase() === "REBAG_GAIN" || type.toUpperCase() === "GAIN") {
                    updatedQty += quantity;
                } else {
                    if (inventory.quantity < quantity) throw new Error(`Insufficient stock for product ${productId}`);
                    updatedQty -= quantity;
                }

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: updatedQty },
                });
            }

            return adjustment;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Create adjustment failed:", error);
        return NextResponse.json({ error: "Failed to create adjustment" }, { status: 500 });
    }
}
