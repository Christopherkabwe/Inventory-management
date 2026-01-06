import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

// -------------------- GET /api/users --------------------
export async function GET(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!["ADMIN", "MANAGER"].includes(currentUser.role)) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const users = await prisma.user.findMany({
            include: { location: true },
            orderBy: { fullName: "asc" },
        });

        return NextResponse.json({ success: true, users });
    } catch (error) {
        console.error("Fetch users failed:", error);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

// -------------------- POST /api/users --------------------

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { email, fullName, password, role, locationId } = body;

        // Validate required fields
        if (!email || !fullName || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Check for existing user
        const existingUser = await prisma.user.findUnique({
            where: { email },
            select: { id: true },
        });

        if (existingUser) {
            return NextResponse.json(
                { error: "User already exists", userId: existingUser.id },
                { status: 409 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                role,
                locationId: role === "ADMIN" || locationId === "" ? null : locationId,
                password: hashedPassword,
                isActive: true,
            },
        });

        return NextResponse.json({ success: true, user });
    } catch (error) {
        console.error("Create user failed:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}