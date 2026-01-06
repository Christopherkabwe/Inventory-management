// src/lib/auth/route-access.ts
export const ROUTE_ACCESS = {
    public: [
        "/",          // Home page (landing)
        "/about-us",  // Public info
    ],
    protected: [
        "/dashboard",
        "/inventory",
        "/sales",
        "/settings",
        "/api/me",
    ],
    admin: [
        "/admin",
    ],
};
