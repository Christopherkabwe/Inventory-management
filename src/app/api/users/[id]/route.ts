import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/rbac";
import bcrypt from "bcryptjs";

type Params = {
    params: Promise<{ id: string }>;
};

/* ======================= GET / UPDATE / DELETE USER BY ID ======================= */
export async function GET(req: NextRequest, context: Params) {
    const params = await context.params;
    const { id } = params;
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

export async function PUT(req: NextRequest, context: Params) {
    const params = await context.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const { fullName, role, isActive, password } = await req.json();
        const data: any = {};
        if (fullName) data.fullName = fullName;
        if (typeof isActive === "boolean") data.isActive = isActive;
        if (role) data.role = role;
        if (password) data.password = await bcrypt.hash(password, 12);

        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            include: { location: true },
        });

        return NextResponse.json({ success: true, user: updatedUser });
    } catch (error) {
        console.error("Update user failed:", error);
        return NextResponse.json({ error: "Failed to update user" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, context: Params) {
    const params = await context.params;
    const { id } = params;
    if (!id) return NextResponse.json({ error: "User ID required" }, { status: 400 });

    try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== UserRole.ADMIN) {
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