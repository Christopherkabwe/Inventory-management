// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { ROUTE_ACCESS } from "@/lib/auth/route-access";

const AUTH_JWT_SECRET = new TextEncoder().encode(
    process.env.AUTH_JWT_SECRET!
);

export async function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // -------------------- ALLOW STATIC ASSETS --------------------
    if (pathname.startsWith("/_next") || pathname.startsWith("/favicon.ico")) {
        return NextResponse.next();
    }

    // -------------------- PUBLIC ROUTES --------------------
    if (ROUTE_ACCESS.public.some(route => pathname.startsWith(route))) {
        return NextResponse.next();
    }

    // -------------------- AUTH TOKEN CHECK --------------------
    const token = req.cookies.get("auth_token")?.value;
    if (!token) {
        // If someone tries to access /dashboard or protected route
        // redirect to "/" instead of /sign-in
        return NextResponse.redirect(new URL("/", req.url));
    }

    try {
        const { payload } = await jwtVerify(token, AUTH_JWT_SECRET);

        // -------------------- ADMIN ROUTES --------------------
        if (
            ROUTE_ACCESS.admin.some(route => pathname.startsWith(route)) &&
            payload.role !== "ADMIN"
        ) {
            return NextResponse.redirect(new URL("/unauthorized", req.url));
        }

        return NextResponse.next();
    } catch {
        // Invalid token → redirect to "/"
        return NextResponse.redirect(new URL("/", req.url));
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
