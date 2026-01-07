import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_EXPIRES = "7d";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();

        const email = body.email?.toLowerCase().trim();
        const password = body.password;
        const fullName = body.fullName?.trim();

        // -------------------- VALIDATION --------------------
        if (!email || !password || !fullName) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // -------------------- CHECK EXISTING USER --------------------
        const existing = await prisma.user.findUnique({
            where: { email },
        });

        if (existing) {
            return NextResponse.json(
                { error: "Email already registered" },
                { status: 409 }
            );
        }

        // -------------------- HASH PASSWORD --------------------
        const hashedPassword = await bcrypt.hash(password, 12);

        // -------------------- CREATE USER --------------------
        const user = await prisma.user.create({
            data: {
                email,
                fullName,
                password: hashedPassword,
                role: "USER",
                isActive: true, // ✅ important
            },
        });

        // -------------------- AUTO LOGIN --------------------
        const token = jwt.sign(
            {
                userId: user.id,
                role: user.role,
            },
            JWT_SECRET,
            { expiresIn: JWT_EXPIRES }
        );

        const response = NextResponse.json({
            success: true,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        });

        response.cookies.set("auth_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 60 * 60 * 24 * 7,
        });

        return response;
    } catch (err) {
        console.error("Signup failed:", err);
        return NextResponse.json(
            { error: "Failed to sign up" },
            { status: 500 }
        );
    }
}
