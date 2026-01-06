export const UserRole = {
    ADMIN: "ADMIN",
    MANAGER: "MANAGER",
    USER: "USER",
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];
