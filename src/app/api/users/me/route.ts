import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    const user = await getCurrentUser();

    if (!user) {
        return NextResponse.json(
            { success: false, error: "Not authenticated" },
            { status: 401 }
        );
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
        },
    });
}
