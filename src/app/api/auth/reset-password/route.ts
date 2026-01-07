import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { token, password } = body;

        // -------------------- VALIDATION --------------------
        if (!token || !password) {
            return NextResponse.json(
                { error: "Invalid or missing data" },
                { status: 400 }
            );
        }

        if (password.length < 8) {
            return NextResponse.json(
                { error: "Password must be at least 8 characters" },
                { status: 400 }
            );
        }

        // -------------------- FIND USER BY TOKEN --------------------
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: token,
                passwordResetExpires: {
                    gt: new Date(),
                },
            },
        });

        // Idempotent response (important for dev + retries)
        if (!user) {
            return NextResponse.json({
                message: "Password already reset or token expired",
            });
        }

        // -------------------- HASH PASSWORD --------------------
        const hashedPassword = await bcrypt.hash(password, 12);

        // -------------------- UPDATE USER --------------------
        await prisma.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                passwordResetToken: null,
                passwordResetExpires: null,
                isActive: true, // ✅ ensures non-admin users can log in
            },
        });

        return NextResponse.json({
            message: "Password reset successful",
        });
    } catch (err) {
        console.error("Reset password failed:", err);
        return NextResponse.json(
            { error: "Something went wrong" },
            { status: 500 }
        );
    }
}
