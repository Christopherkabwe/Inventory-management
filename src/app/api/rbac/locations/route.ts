import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";

type Params = { params: { id: string } };

// Allowed roles to manage locations
const ALLOWED_ROLES = [UserRole.ADMIN, UserRole.MANAGER];

// -------------------- GET /api/locations --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // RBAC check
        if (user.role !== UserRole.USER) {
            requireRole(user, ALLOWED_ROLES);
        }

        const { searchParams } = new URL(req.url);
        const search = searchParams.get("search") || "";

        let where: any = {};
        if (user.role === UserRole.USER) {
            // USER can only see their assigned location
            where = { id: { equals: user.locationId } };
        } else if (search) {
            where.name = { contains: search, mode: "insensitive" };
        }

        const locations = await prisma.location.findMany({
            where,
            select: { id: true, name: true, address: true },
            orderBy: { name: "asc" },
        });

        // Return in format expected by ProductionPage
        return NextResponse.json({ data: locations });
    } catch (error) {
        console.error("Fetch locations failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch locations", details: (error as Error).message },
            { status: 500 }
        );
    }
}
