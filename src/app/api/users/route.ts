import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { UserRole } from "@/lib/rbac";

/* ======================= GET ALL USERS ======================= */
export async function GET() {
    try {
        const currentUser = await getCurrentUser();

        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let users = [];

        if (currentUser.role === UserRole.ADMIN) {
            users = await prisma.user.findMany({
                include: { location: true },
                orderBy: { fullName: "asc" },
            });
        } else if (currentUser.role === UserRole.MANAGER) {
            if (!currentUser.locationId) {
                return NextResponse.json(
                    { error: "Manager has no location" },
                    { status: 400 }
                );
            }

            users = await prisma.user.findMany({
                where: { locationId: currentUser.locationId },
                include: { location: true },
                orderBy: { fullName: "asc" },
            });
        } else {
            const self = await prisma.user.findUnique({
                where: { id: currentUser.id },
                include: { location: true },
            });
            if (self) users = [self];
        }

        const sanitizedUsers = users.map((u) => ({
            id: u.id,
            fullName: u.fullName,
            email: u.email,
            role: u.role,
            isActive: u.isActive,
            createdAt: u.createdAt,
            location: u.location
                ? { id: u.location.id, name: u.location.name }
                : null,
        }));

        return NextResponse.json({ success: true, users: sanitizedUsers });
    } catch (err) {
        console.error("Fetch users failed:", err);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}

/* ======================= CREATE USER ======================= */
export async function POST(req: NextRequest) {
    try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        if (![UserRole.ADMIN, UserRole.MANAGER].includes(currentUser.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const body = await req.json();
        const email = body.email?.toLowerCase();
        const { fullName, password, role, locationId } = body;

        if (!email || !fullName || !password || !role) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        if (!Object.values(UserRole).includes(role)) {
            return NextResponse.json({ error: "Invalid role" }, { status: 400 });
        }

        if (currentUser.role === UserRole.MANAGER) {
            if (role !== UserRole.USER) {
                return NextResponse.json({ error: "Managers can only create USER accounts" }, { status: 403 });
            }
            if (!currentUser.locationId) {
                return NextResponse.json({ error: "Manager has no location assigned" }, { status: 400 });
            }
        }

        if (role === UserRole.ADMIN && currentUser.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Only ADMIN can create ADMIN users" }, { status: 403 });
        }

        const existing = await prisma.user.findUnique({ where: { email } });
        if (existing) {
            return NextResponse.json({ error: "User already exists" }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                role,
                locationId:
                    role === UserRole.ADMIN
                        ? null
                        : currentUser.role === UserRole.MANAGER
                            ? currentUser.locationId
                            : locationId ?? null,
                isActive: true,
            },
        });

        return NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        });
    } catch (error) {
        console.error("Create user failed:", error);
        return NextResponse.json({ error: "Failed to create user" }, { status: 500 });
    }
}