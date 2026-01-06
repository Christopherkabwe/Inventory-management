import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { NextResponse, NextRequest } from "next/server";
import jwt from "jsonwebtoken";

const AUTH_JWT_SECRET = process.env.AUTH_JWT_SECRET!;

export async function GET(req: NextRequest) {
    // Convert headers for StackAuth
    const headersObj: Record<string, string> = {};
    req.headers.forEach((value, key) => {
        headersObj[key] = value;
    });

    const stackUser = await stackServerApp.getUser({ headers: headersObj });

    if (!stackUser) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // -------------------- Find or create user --------------------
    let user = await prisma.user.findUnique({
        where: { stackAuthId: stackUser.id },
    });

    if (!user) {
        // Create user without assigning role or location
        user = await prisma.user.create({
            data: {
                stackAuthId: stackUser.id,
                email: stackUser.primaryEmail,
                fullName:
                    stackUser.displayName ??
                    stackUser.primaryEmail?.split("@")[0] ??
                    "User",
                // role and locationId will be null until assigned manually
                isActive: true,
            },
        });
    }

    // -------------------- Build JWT --------------------
    const tokenPayload = {
        id: user.id,
        role: user.role,           // might be null for first login
        locationId: user.locationId, // might be null for first login
        isActive: user.isActive,
    };

    const token = jwt.sign(tokenPayload, AUTH_JWT_SECRET, { expiresIn: "12h" });

    const res = NextResponse.json(tokenPayload);

    res.cookies.set("auth_user", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 12, // 12 hours
    });

    return res;
}
