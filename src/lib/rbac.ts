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
    email: string | null;
    role: UserRole;
    locationId: string | null;
    isActive: boolean;
};

// -------------------- RBAC HELPERS --------------------

/**
 * Require that the user has one of the allowed roles.
 * Throws an error if the role is not allowed.
 */
export function requireRole(user: CurrentUser, allowed: UserRole[]) {
    //console.log('User role:', user.role, 'Allowed roles:', allowed); // Add this line
    if (!allowed.includes(user.role)) {
        throw new Error("Unauthorized: insufficient role");
    }
}

/**
 * Require that the user is accessing a target location.
 * Throws an error if the location does not match.
 */

export function requireSameLocation(user: CurrentUser, targetLocationId: string) {
    //console.log('User location:', user.locationId, 'Target location:', targetLocationId); // Add this line
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
