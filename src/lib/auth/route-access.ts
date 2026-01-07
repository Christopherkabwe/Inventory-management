// src/lib/auth/route-access.ts
import { UserRole } from "@/lib/rbac";

export const ROUTE_ACCESS = {
    public: [
        "/",
        "/about-us",
        "/sign-in",
        "/sign-up",
        "/api/auth",
    ],

    authenticated: [
        "/dashboard",
        "/inventory",
        "/sales",
        "/settings",
        "/api",
        "/users",
    ],

    roleBased: {
        [UserRole.ADMIN]: ["/admin"],
        [UserRole.MANAGER]: ["/manager"],
        [UserRole.USER]: [],
    } satisfies Record<UserRole, string[]>,
};
