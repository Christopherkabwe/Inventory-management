import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// -------------------- GET /api/users/:id --------------------
export async function GET(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;  // <-- await here
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    try {
        const user = await prisma.user.findUnique({
            where: { id },
            include: { location: true },
        });

        if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Fetch user failed:", error);
        return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
    }
}

// -------------------- PUT /api/users/:id --------------------
export async function PUT(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    try {
        const currentUser = await getCurrentUser();
        if (currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { fullName, role, isActive } = await req.json();

        if (currentUser.id === id && role && role !== "ADMIN") {
            return NextResponse.json({ error: "Cannot change your own role" }, { status: 400 });
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                fullName: fullName ?? undefined,
                role: role ?? undefined,
                isActive: typeof isActive === "boolean" ? isActive : undefined,
            },
            include: { location: true },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update user failed:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

// -------------------- DELETE /api/users/:id --------------------
export async function DELETE(req: NextRequest, context: { params: Promise<{ id: string }> }) {
    const { id } = await context.params;
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    try {
        const currentUser = await getCurrentUser();
        if (currentUser.role !== "ADMIN") {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        if (currentUser.id === id) {
            return NextResponse.json({ error: "Cannot delete your own account" }, { status: 400 });
        }

        const deletedUser = await prisma.user.update({
            where: { id },
            data: { isActive: false },
            include: { location: true },
        });

        return NextResponse.json({ success: true, user: deletedUser });
    } catch (error) {
        console.error("Delete user failed:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}
