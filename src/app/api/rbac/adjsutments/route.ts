import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { nextSequence } from "@/lib/sequence";

export async function GET(req: Request) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 0);
    const skip = limit ? (page - 1) * limit : undefined;

    try {
        // Role-based filter: USERS only see their own adjustments
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

    // Only ADMIN or MANAGER can create adjustments
    requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

    try {
        const { locationId, type, reason, items } = await req.json();
        if (!locationId || !type || !items?.length)
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

        const adjustment = await prisma.$transaction(async (tx) => {
            // Generate adjustment number
            const adjustmentNo = await nextSequence(tx, "ADJ");

            // Create adjustment
            const adj = await tx.adjustment.create({
                data: { adjustmentNo, locationId, type, reason, createdById: user.id },
            });

            // Process items
            for (const item of items) {
                const { productId, quantity } = item;
                if (!productId || quantity <= 0) throw new Error("Invalid item");

                await tx.adjustmentItem.create({ data: { adjustmentId: adj.id, productId, quantity } });

                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);

                let updatedQty = inventory.quantity;
                if (["REBAG_GAIN", "GAIN"].includes(type.toUpperCase())) updatedQty += quantity;
                else if (inventory.quantity >= quantity) updatedQty -= quantity;
                else throw new Error(`Insufficient stock for product ${productId}`);

                await tx.inventory.update({ where: { id: inventory.id }, data: { quantity: updatedQty } });
            }

            return adj;
        });

        return NextResponse.json({ success: true, adjustment }, { status: 201 });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create adjustment", details: (err as Error).message }, { status: 500 });
    }
}
