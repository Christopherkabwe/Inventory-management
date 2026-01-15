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
        if (!user) return; // 401 already returned

        const { searchParams } = new URL(req.url);
        const productId = searchParams.get("productId");
        const locationId = searchParams.get("locationId");

        // -------------------- ROLE-BASED ACCESS --------------------
        let allowedLocationIds: string[] | undefined;

        if (user.role === "USER") {
            // Fetch all locations this USER has access to
            const userLocations = await prisma.userLocation.findMany({
                where: { userId: user.id },
                select: { locationId: true },
            });

            allowedLocationIds = userLocations.map(l => l.locationId);
            if (!allowedLocationIds.length) {
                return NextResponse.json(
                    { error: "You do not have access to any locations" },
                    { status: 403 }
                );
            }

            // If USER provided a locationId, ensure it is allowed
            if (locationId && !allowedLocationIds.includes(locationId)) {
                return NextResponse.json(
                    { error: "Unauthorized: You cannot access this location" },
                    { status: 403 }
                );
            }
        }
        // ADMIN / MANAGER can query any location; allowedLocationIds stays undefined

        // -------------------- FETCH INVENTORY --------------------
        let inventory;

        if (productId && locationId) {
            // Fetch specific product at specific location
            inventory = await prisma.inventory.findUnique({
                where: { productId_locationId: { productId, locationId } },
                select: {
                    quantity: true,
                    lowStockAt: true,
                    expiryDate: true,
                    product: { select: { name: true, sku: true } },
                    location: { select: { name: true } },
                },
            });

            if (!inventory) {
                return NextResponse.json(
                    { error: "Inventory not found" },
                    { status: 404 }
                );
            }

            return NextResponse.json({
                productId,
                locationId,
                productName: inventory.product.name,
                sku: inventory.product.sku,
                locationName: inventory.location.name,
                availableQuantity: inventory.quantity,
                lowStockAt: inventory.lowStockAt,
                expiryDate: inventory.expiryDate,
            });
        }

        // Fetch all inventory for allowed locations
        const where: any = {};
        if (allowedLocationIds) {
            where.locationId = { in: allowedLocationIds };
        }
        if (productId) {
            where.productId = productId;
        } else if (!productId && !allowedLocationIds && !locationId) {
            // Admin/Manager without filters fetch all inventory
        }

        const inventories = await prisma.inventory.findMany({
            where,
            include: {
                product: { select: { id: true, name: true, sku: true } },
                location: { select: { id: true, name: true } },
            },
            orderBy: { locationId: "asc" },
        });

        const formatted = inventories.map(inv => ({
            productId: inv.product.id,
            productName: inv.product.name,
            sku: inv.product.sku,
            locationId: inv.location.id,
            locationName: inv.location.name,
            availableQuantity: inv.quantity,
            lowStockAt: inv.lowStockAt,
            expiryDate: inv.expiryDate,
        }));

        return NextResponse.json({ success: true, inventory: formatted });
    } catch (error) {
        console.error("Fetch inventory failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch inventory", details: (error as Error).message },
            { status: 500 }
        );
    }
}
