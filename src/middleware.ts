// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const AUTH_JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET!
);

const PUBLIC_ROUTES = [
    "/",
    "/about-us",
    "/sign-in",
    "/sign-up",
    "/forgot-password",
];

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    const isApiRoute = pathname.startsWith("/api");

    // Allow public routes
    if (PUBLIC_ROUTES.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // Allow static files
    if (
        pathname.startsWith("/_next") ||
        pathname.startsWith("/favicon.ico")
    ) {
        return NextResponse.next();
    }

    const token = req.cookies.get("auth_token")?.value;

    // ❌ No token
    if (!token) {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    try {
        await jwtVerify(token, AUTH_JWT_SECRET);
        return NextResponse.next();
    } catch {
        if (isApiRoute) {
            return NextResponse.json(
                { success: false, error: "Invalid token" },
                { status: 401 }
            );
        }

        return NextResponse.redirect(new URL("/sign-in", req.url));
    }
}
