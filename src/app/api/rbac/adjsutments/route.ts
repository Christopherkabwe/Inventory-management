import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import { recordInventoryTransaction } from "@/lib/inventory"; // ✅ Option A

export async function GET(req: Request) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 0);
    const skip = limit ? (page - 1) * limit : undefined;

    try {
        const where: any = {};
        if (user.role === UserRole.USER) where.createdById = user.id;

        const [adjustments, total] = await Promise.all([
            prisma.adjustment.findMany({
                where,
                orderBy: { createdAt: "desc" },
                ...(limit ? { skip, take: limit } : {}),
                include: { location: true, items: { include: { product: true } } },
            }),
            prisma.adjustment.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: adjustments,
            ...(limit && { pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } }),
        });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch adjustments", details: (err as Error).message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

    try {
        const { locationId, type, reason, items } = await req.json();
        if (!locationId || !type || !items?.length) return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const adjustment = await prisma.$transaction(async (tx) => {
            const adjustmentNo = await nextSequence("ADJ");

            // 1️⃣ Create adjustment
            const adj = await tx.adjustment.create({
                data: { adjustmentNo, locationId, type, reason, createdById: user.id },
            });

            // 2️⃣ Process items
            for (const item of items) {
                const { productId, quantity } = item;
                if (!productId || quantity <= 0) throw new Error("Invalid item");

                // Create adjustment item
                await tx.adjustmentItem.create({
                    data: { adjustmentId: adj.id, productId, quantity },
                });

                // Update inventory
                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);

                let delta: number;
                switch (type.toUpperCase()) {
                    case "GAIN":
                    case "REBAG_GAIN":
                        delta = quantity;
                        break;
                    default:
                        if (inventory.quantity < quantity) throw new Error(`Insufficient stock for product ${productId}`);
                        delta = -quantity;
                }

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { increment: delta } },
                });

                // 3️⃣ Record in inventory history using Option A
                await recordInventoryTransaction({
                    productId,
                    locationId,
                    delta,
                    source: "ADJUSTMENT",
                    reference: adjustmentNo,
                    createdById: user.id,
                    metadata: { type, quantity },
                });
            }

            return adj;
        });
        await incrementSequence("ADJ");

        return NextResponse.json({ success: true, adjustment }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create adjustment", details: (err as Error).message }, { status: 500 });
    }
}
