import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

/* Update Profile */
export async function PUT(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { fullName } = await req.json();

    return NextResponse.json({ success: true });
}

/* Update Password */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { currentPassword, newPassword } = await req.json();

    return NextResponse.json({ success: true });
}

/* Logout All Devices */
export async function DELETE() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });


    return NextResponse.json({ success: true });
}
