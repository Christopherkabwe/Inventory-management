// pages/api/rbac/getProduct.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {

        // Get current user
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        const whereClause: any = {};

        // Apply RBAC: filter by user's location if not ADMIN
        if (user.role !== "ADMIN") {
            whereClause.inventories = {
                some: {
                    locationId: user.locationId,
                },
            };
        }

        // Fetch products with only the fields we need
        const products = await prisma.productList.findMany({
            where: whereClause,
            select: {
                id: true,
                name: true,
                sku: true,
                price: true,
                packSize: true,
                category: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json({ data: products });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch products" });
    }
}
