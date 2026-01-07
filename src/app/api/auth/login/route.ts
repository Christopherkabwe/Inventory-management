import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES_IN = "7d";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = body.email?.toLowerCase().trim();
        const password = body.password;

        // -------------------- VALIDATION --------------------
        if (!email || !password) {
            return NextResponse.json(
                { error: "Email and password are required" },
                { status: 400 }
            );
        }

        // -------------------- FIND USER --------------------
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user || !user.password) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // -------------------- CHECK PASSWORD --------------------
        const isValid = await bcrypt.compare(password, user.password);

        if (!isValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // -------------------- CHECK ACTIVE --------------------
        if (!user.isActive) {
            return NextResponse.json(
                { error: "User account is inactive" },
                { status: 403 }
            );
        }

        // -------------------- CREATE JWT --------------------
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES_IN }
        );

        // -------------------- SET COOKIE --------------------
        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                fullName: user.fullName,
                email: user.email,
                role: user.role,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: false, //{/* process.env.NODE_ENV === "production" when production ready*/}
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { error: "Server error" },
            { status: 500 }
        );
    }
}
