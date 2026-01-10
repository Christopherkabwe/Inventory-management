// lib/rbac.ts

// -------------------- USER ROLES --------------------
export const UserRole = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// -------------------- CURRENT USER TYPE --------------------
export type CurrentUser = {
    id: string;
    fullName: string | null;
    email: string | null;
    role: UserRole;
    createdAt: Date | null;
    isActive: boolean;
    locationId: string | null;
    location: { id: string; name: string; } | null;
    permissions: {
        canCreate: boolean;
        canRead: boolean;
        canUpdate: boolean;
        canDelete: boolean;
    };
    manager: {
        id: string;
        fullName: string | null;
        email: string | null;
    } | null;
}

// -------------------- RBAC HELPERS --------------------

/**
 * Require that the user has one of the allowed roles.
 * Throws an error if the role is not allowed.
 */
export function requireRole(user: CurrentUser, allowed: UserRole[]) {
    //console.log('User role:', user.role, 'Allowed roles:', allowed); // Add this line
    if (!allowed.includes(user.role)) {
        throw new Error(`Unauthorized: role '${user.role}' not allowed. Allowed: ${allowed.join(', ')}`);
    }
}

/**
 * Require that the user is accessing a target location.
 * Throws an error if the location does not match.
 */

export function requireSameLocation(user: CurrentUser, targetLocationId: string) {
    if (user.role === UserRole.ADMIN) return; // Admin can access all locations
    if (!user.locationId || user.locationId !== targetLocationId) {
        throw new Error("Unauthorized: invalid location access");
    }
}

/**
 * Combined role + location check.
 * Ensures user has one of the allowed roles AND is accessing the correct location.
 */

export function requireRoleAndLocation(
    user: CurrentUser,
    allowedRoles: UserRole[],
    targetLocationId: string
) {
    requireRole(user, allowedRoles);
    requireSameLocation(user, targetLocationId);
}

// User permissions check

export function checkPermissions(role: UserRole): CurrentUser['permissions'] {
    switch (role) {
        case UserRole.ADMIN:
            return {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: true,
            };
        case UserRole.MANAGER:
            return {
                canCreate: true,
                canRead: true,
                canUpdate: true,
                canDelete: false,
            };
        case UserRole.USER:
            return {
                canCreate: true,
                canRead: true,
                canUpdate: false,
                canDelete: false,
            };
        default:
            return {
                canCreate: false,
                canRead: false,
                canUpdate: false,
                canDelete: false,
            };
    }
}
