import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const currentUser = await getCurrentUser();

    if (!currentUser) {
        return NextResponse.json(
            { success: false, error: "Not authenticated" },
            { status: 401 }
        );
    }

    // Fetch the user
    const user = await prisma.user.findUnique({
        where: { id: currentUser.id },
        include: {
            location: true, // optional location info
        },
    });

    if (!user) {
        return NextResponse.json(
            { success: false, error: "User not found" },
            { status: 404 }
        );
    }

    // Fetch the manager if managerId exists
    let manager = null;
    if (user.managerId) {
        const managerUser = await prisma.user.findUnique({
            where: { id: user.managerId },
        });
        if (managerUser && managerUser.role === "MANAGER") {
            manager = {
                id: managerUser.id,
                fullName: managerUser.fullName,
                email: managerUser.email,
            };
        }
    }

    return NextResponse.json({
        success: true,
        user: {
            id: user.id,
            fullName: user.fullName,
            email: user.email,
            role: user.role,
            isActive: user.isActive,
            createdAt: user.createdAt,
            location: user.location
                ? {
                    id: user.location.id,
                    name: user.location.name,
                }
                : null,
            manager, // will be null if no managerId or manager not a MANAGER
        },
    });
}
