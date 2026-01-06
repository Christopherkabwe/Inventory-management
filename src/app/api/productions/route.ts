// app/api/productions/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence } from "@/lib/sequence";
import { UserRole, requireRole } from "@/lib/rbac";

// -------------------- GET PRODUCTIONS --------------------
export async function GET(req: Request) {
    const user = await getCurrentUser(); // ensure logged-in
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 0);

    try {
        const productions = await prisma.production.findMany({
            ...(limit ? { take: limit } : {}),
            orderBy: { createdAt: "desc" },
            include: { items: { include: { product: true } }, location: true },
        });

        return NextResponse.json({ productions });
    } catch (err) {
        console.error("Fetch productions failed:", err);
        return NextResponse.json({ error: "Failed to fetch productions" }, { status: 500 });
    }
}

// -------------------- CREATE PRODUCTION --------------------
export async function POST(req: Request) {
    const user = await getCurrentUser(); // ensure logged-in
    requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]); // only admin/manager

    try {
        const { locationId, items, batchNumber, notes } = await req.json();

        // Basic validation
        if (!locationId || !Array.isArray(items) || !items.length) {
            return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
        }

        // Optional: verify location exists
        const locationExists = await prisma.location.findUnique({ where: { id: locationId } });
        if (!locationExists) return NextResponse.json({ error: "Invalid locationId" }, { status: 400 });

        const production = await prisma.$transaction(async (tx) => {
            // Generate production number using nextSequence
            const productionNo = await nextSequence(tx, "PROD");

            // Create production record
            const prod = await tx.production.create({
                data: { productionNo, locationId, batchNumber, notes, createdById: user.id },
            });

            // Process production items
            for (const item of items) {
                const { productId, quantity } = item;

                if (!productId || quantity <= 0) throw new Error("Invalid item");

                // Create production item
                await tx.productionItem.create({
                    data: { productionId: prod.id, productId, quantity },
                });

                // Update inventory (increment or create)
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId, locationId } },
                    update: { quantity: { increment: quantity } },
                    create: { productId, locationId, quantity, lowStockAt: 0, createdById: user.id },
                });
            }

            return tx.production.findUnique({
                where: { id: prod.id },
                include: { items: { include: { product: true } }, location: true },
            });
        });

        return NextResponse.json({ success: true, production }, { status: 201 });
    } catch (err) {
        console.error("Create production failed:", err);
        return NextResponse.json({ error: "Failed to create production", details: (err as Error).message }, { status: 500 });
    }
}
