import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Public routes (no auth)
    const publicRoutes = ["/", "/about", "/sign-in", "/sign-up"];

    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Stack session cookies (one of these will exist)
    const hasSession =
        req.cookies.has("stack-session") ||
        req.cookies.has("__stack_session");


    return NextResponse.next();
}

export const config = {
    matcher: [
        "/dashboard/:path*",
        "/sales/:path*",
        "/inventory/:path*",
    ],
};
