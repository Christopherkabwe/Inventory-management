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

        // Check RBAC for GET access (Admin/Manager)
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

        return NextResponse.json({ success: true, locations });
    } catch (error) {
        console.error("Fetch locations failed:", error);
        return NextResponse.json({ error: "Failed to fetch locations", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- POST /api/locations --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only Admin/Manager can create
        try { requireRole(user, ALLOWED_ROLES); }
        catch (err: any) { return NextResponse.json({ error: err.message }, { status: 403 }); }

        const { name, address } = await req.json();
        if (!name) return NextResponse.json({ error: "Missing required field: name" }, { status: 400 });

        const existing = await prisma.location.findUnique({ where: { name } });
        if (existing) return NextResponse.json({ error: "Location with this name already exists" }, { status: 409 });

        const location = await prisma.location.create({
            data: { name, address },
        });

        return NextResponse.json({ success: true, location }, { status: 201 });
    } catch (error) {
        console.error("Create location failed:", error);
        return NextResponse.json({ error: "Failed to create location", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- PUT /api/locations/:id --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only Admin/Manager can update
        try { requireRole(user, ALLOWED_ROLES); }
        catch (err: any) { return NextResponse.json({ error: err.message }, { status: 403 }); }

        const { name, address } = await req.json();
        if (!name) return NextResponse.json({ error: "Missing required field: name" }, { status: 400 });

        const location = await prisma.location.update({
            where: { id: params.id },
            data: { name, address },
        });

        return NextResponse.json({ success: true, location });
    } catch (error) {
        console.error("Update location failed:", error);
        return NextResponse.json({ error: "Failed to update location", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE /api/locations/:id --------------------
export async function DELETE(_req: NextRequest, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only Admin/Manager can delete
        try { requireRole(user, ALLOWED_ROLES); }
        catch (err: any) { return NextResponse.json({ error: err.message }, { status: 403 }); }

        const location = await prisma.location.findUnique({ where: { id: params.id } });
        if (!location) return NextResponse.json({ error: "Location not found" }, { status: 404 });

        // Prevent deletion if inventory exists
        const inventoryCount = await prisma.inventory.count({ where: { locationId: params.id } });
        if (inventoryCount > 0) return NextResponse.json({ error: "Cannot delete location with inventory" }, { status: 400 });

        await prisma.location.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true, message: "Location deleted" });
    } catch (error) {
        console.error("Delete location failed:", error);
        return NextResponse.json({ error: "Failed to delete location", details: (error as Error).message }, { status: 500 });
    }
}
