import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";
import { UserRole, CurrentUser, checkPermissions } from "@/lib/rbac";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
}

interface JWTPayload {
    userId: string;
    role: string;
    sessionId?: string;
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
    try {
        const cookieStore = await cookies();
        const authToken = cookieStore.get("auth_token");
        if (!authToken?.value) return null;

        const payload = jwt.verify(authToken.value, JWT_SECRET as string) as unknown as JWTPayload;
        const user = await prisma.user.findUnique({
            where: { id: payload.userId },
            include: { location: true }, // include relation 
        });

        if (!user || !user.isActive) return null;

        // Apply RBAC checks
        const permissions = checkPermissions(user.role);
        if (!permissions) return null;

        // Safe access to location
        const currentUser: CurrentUser = {
            id: user.id,
            fullName: user.fullName,
            email: user.email ?? null,
            role: user.role as UserRole,
            createdAt: user.createdAt ?? null,
            locationId: user.locationId ?? null,
            isActive: user.isActive,
            location: user.location ? { id: user.location.id, name: user.location.name } : null,
            permissions, // Add permissions to the current user object
        };

        return currentUser;
    } catch (err) {
        console.error("getCurrentUser failed:", err);
        return null;
    }
}
