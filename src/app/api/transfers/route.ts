// app/api/transfers/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence } from "@/lib/sequence";

// -------------------- GET TRANSFERS --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const skip = limit ? (page - 1) * limit : undefined;

        // Role-based filter
        const where = user.role === "USER" ? { createdById: user.id } : {};

        const [transfers, total] = await Promise.all([
            prisma.transfer.findMany({
                orderBy: { createdAt: "desc" },
                ...(limit ? { skip, take: limit } : {}),
                where,
                include: {
                    items: { include: { product: true } },
                    fromLocation: true,
                    toLocation: true,
                    transporter: true,
                },
            }),
            prisma.transfer.count({ where }),
        ]);

        if (limit) {
            return NextResponse.json({
                success: true,
                data: transfers,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }

        return NextResponse.json({ success: true, data: transfers, total });
    } catch (error) {
        console.error("Fetch transfers failed:", error);
        return NextResponse.json({ error: "Failed to fetch transfers", details: (error as Error).message }, { status: 500 });
    }
}
// -------------------- CREATE TRANSFER --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can create transfers
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden: Admin or Manager required" }, { status: 403 });
        }

        const { fromLocationId, toLocationId, transporterId, items } = await req.json();
        if (!fromLocationId || !toLocationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const transfer = await prisma.$transaction(async (tx) => {
            // 1️⃣ Generate IBT number using centralized sequence
            const ibtNumber = await nextSequence(tx, "IBT"); // returns IBT-2026-000001

            // 2️⃣ Create transfer
            const newTransfer = await tx.transfer.create({
                data: {
                    fromLocationId,
                    toLocationId,
                    transporterId,
                    ibtNumber,
                    createdById: user.id,
                },
            });

            // 3️⃣ Process items
            for (const item of items) {
                const { productId, quantity } = item;
                if (!productId || quantity <= 0) throw new Error("Invalid item");

                // Deduct from source inventory
                const sourceInventory = await tx.inventory.findFirst({
                    where: { productId, locationId: fromLocationId },
                });
                if (!sourceInventory || sourceInventory.quantity < quantity) {
                    throw new Error(`Insufficient stock for product ${productId} at source`);
                }

                await tx.inventory.update({
                    where: { id: sourceInventory.id },
                    data: { quantity: { decrement: quantity } },
                });

                // Increment or create destination inventory
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId, locationId: toLocationId } },
                    update: { quantity: { increment: quantity } },
                    create: { productId, locationId: toLocationId, quantity, lowStockAt: 0, createdById: user.id },
                });

                // Create transfer item
                await tx.transferItem.create({
                    data: { transferId: newTransfer.id, productId, quantity },
                });
            }

            // 4️⃣ Return the transfer with relations
            return tx.transfer.findUnique({
                where: { id: newTransfer.id },
                include: {
                    items: { include: { product: true } },
                    fromLocation: true,
                    toLocation: true,
                    transporter: true,
                },
            });
        });

        return NextResponse.json({ success: true, transfer }, { status: 201 });
    } catch (error) {
        console.error("Create transfer failed:", error);
        return NextResponse.json({
            error: "Failed to create transfer",
            details: (error as Error).message,
        }, { status: 500 });
    }
}
