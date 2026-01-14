// app/api/inventory/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// -------------------- USER CHECK --------------------
async function requireUser() {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return user;
}

// -------------------- GET INVENTORY --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await requireUser();
        if (!user) return; // already handled 401

        // -------------------- FETCH INVENTORY --------------------
        const inventories = await prisma.inventory.findMany({
            include: {
                product: {
                    select: { id: true, name: true, sku: true, packSize: true, weightValue: true, weightUnit: true },
                },
                location: {
                    select: { id: true, name: true },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        // Format response
        const formatted = inventories.map(inv => ({
            id: inv.id,
            product: {
                id: inv.product.id,
                name: inv.product.name,
                sku: inv.product.sku,
                packSize: inv.product.packSize,
                weightValue: inv.product.weightValue,
                weightUnit: inv.product.weightUnit,
            },
            location: {
                id: inv.location.id,
                name: inv.location.name,
            },
            quantity: inv.quantity,
            lowStockAt: inv.lowStockAt,
            expiryDate: inv.expiryDate,
            createdBy: inv.createdById,
            createdAt: inv.createdAt,
            updatedAt: inv.updatedAt,
        }));

        return NextResponse.json({ success: true, inventory: formatted });
    } catch (err) {
        console.error("Fetch inventory failed:", err);
        return NextResponse.json(
            { error: "Failed to fetch inventory", details: (err as Error).message },
            { status: 500 }
        );
    }
}
