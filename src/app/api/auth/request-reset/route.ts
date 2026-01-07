import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";
import nodemailer from "nodemailer";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const email = body.email?.toLowerCase().trim();

        if (!email) {
            return NextResponse.json(
                { message: "If the email exists, a reset link will be sent" },
                { status: 200 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
        });

        // Always return same message (security best practice)
        if (!user) {
            return NextResponse.json({
                message: "If the email exists, a reset link will be sent",
            });
        }

        // Generate token & expiration
        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

        await prisma.user.update({
            where: { id: user.id },
            data: {
                passwordResetToken: token,
                passwordResetExpires: expiresAt,
            },
        });

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: Number(process.env.SMTP_PORT),
            secure: process.env.SMTP_SECURE === "true",
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });

        const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/update-password/reset?token=${token}`;

        await transporter.sendMail({
            from: process.env.SMTP_FROM,
            to: email,
            subject: "Reset your password",
            html: `
        <p>You requested a password reset.</p>
        <p>
          <a href="${resetUrl}">
            Click here to reset your password
          </a>
        </p>
        <p>This link expires in 1 hour.</p>
      `,
        });

        return NextResponse.json({
            message: "If the email exists, a reset link will be sent",
        });
    } catch (err) {
        console.error("Password reset request failed:", err);
        return NextResponse.json(
            { message: "If the email exists, a reset link will be sent" },
            { status: 200 }
        );
    }
}
