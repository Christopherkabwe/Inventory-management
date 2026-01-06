// app/api/users/me/route.ts
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
        }

        // Fetch full user including location
        const dbUser = await prisma.user.findUnique({
            where: { id: currentUser.id },
            include: { location: true },
        });

        if (!dbUser) {
            return NextResponse.json({ success: false, error: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, user: dbUser });
    } catch (error) {
        console.error("Fetch current user failed:", error);
        return NextResponse.json({ success: false, error: (error as Error).message }, { status: 500 });
    }
}
