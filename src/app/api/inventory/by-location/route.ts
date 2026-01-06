// app/api/inventory/by-location/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

// -------------------- USER CHECK --------------------
async function requireUser() {
    const user = await stackServerApp.getUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return user;
}

// -------------------- GET INVENTORY BY LOCATION --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await requireUser();
        if (!user) return; // 401 already returned

        const { searchParams } = new URL(req.url);
        const locationId = searchParams.get("locationId");

        if (!locationId) {
            return NextResponse.json({ error: "locationId required" }, { status: 400 });
        }

        // -------------------- ROLE BASED ACCESS --------------------
        if (user.role === "USER") {
            // Check if user has access to this location
            const allowed = await prisma.userLocation.findFirst({
                where: { userId: user.id, locationId },
            });
            if (!allowed) {
                return NextResponse.json(
                    { error: "Unauthorized: You cannot access this location" },
                    { status: 403 }
                );
            }
        }
        // ADMIN/MANAGER bypass restriction

        // -------------------- FETCH INVENTORY --------------------
        const inventory = await prisma.inventory.findMany({
            where: { locationId },
            include: {
                product: {
                    select: { id: true, name: true, sku: true, weightValue: true, packSize: true },
                },
                location: {
                    select: { id: true, name: true },
                },
            },
            orderBy: {
                product: { name: "asc" },
            },
        });

        const formatted = inventory.map((inv) => ({
            productId: inv.product.id,
            productName: inv.product.name,
            sku: inv.product.sku,
            weightValue: inv.product.weightValue,
            packSize: inv.product.packSize,
            locationId: inv.location.id,
            locationName: inv.location.name,
            availableQuantity: inv.quantity,
            lowStockAt: inv.lowStockAt,
            expiryDate: inv.expiryDate,
        }));

        return NextResponse.json({ success: true, inventory: formatted });
    } catch (error) {
        console.error("Fetch inventory by location failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory", details: (error as Error).message },
            { status: 500 }
        );
    }
}
