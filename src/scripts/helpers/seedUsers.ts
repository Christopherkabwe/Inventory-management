// src/scripts/helpers/seedUsers.ts
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { StackUser } from "./syncStackAuth";

export interface PrismaUser {
    id: string;
    stackAuthId?: string | null;
    email: string;
    fullName: string;
    role: string;
    isActive: boolean;
    password?: string | null;
    createdAt?: Date;
    updatedAt?: Date;
}

/**
 * Create Prisma users from StackAuth users.
 * If no users exist, creates a default admin.
 */
export async function seedUsersFromStack(stackUsers: StackUser[]): Promise<PrismaUser[]> {
    const prismaUsers: PrismaUser[] = [];

    for (let i = 0; i < stackUsers.length; i++) {
        const stackUser = stackUsers[i];

        // Check if user already exists
        let user = await prisma.user.findUnique({
            where: { stackAuthId: stackUser.id },
        });

        if (!user) {
            // Make first synced user an admin
            const role = i === 0 ? "ADMIN" : "USER";

            user = await prisma.user.create({
                data: {
                    stackAuthId: stackUser.id,
                    email: stackUser.primaryEmail ?? `user-${stackUser.id}@example.com`,
                    fullName:
                        stackUser.displayName ??
                        stackUser.primaryEmail?.split("@")[0] ??
                        `User-${stackUser.id}`,
                    role,
                    isActive: true,
                },
            });

            console.log(`✅ Created Prisma ${role} user: ${user.email}`);
        } else {
            console.log(`ℹ️ Prisma user already exists: ${user.email}`);
        }

        // Normalize nulls (safe because we provide fallbacks)
        prismaUsers.push({
            id: user.id,
            stackAuthId: user.stackAuthId,
            email: user.email!,
            fullName: user.fullName!,
            role: user.role,
            isActive: user.isActive,
            password: user.password ?? null,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        });
    }

    // If no StackAuth users exist, create default admin
    if (prismaUsers.length === 0) {
        console.log("⚠️ No StackAuth users found! Creating default admin...");

        const passwordHash = await bcrypt.hash("admin123", 10);

        const adminUser = await prisma.user.create({
            data: {
                email: "admin@example.com",
                fullName: "Admin User",
                password: passwordHash,
                role: "ADMIN",
                isActive: true,
            },
        });

        console.log(`✅ Default admin created: ${adminUser.email}`);

        prismaUsers.push({
            id: adminUser.id,
            stackAuthId: adminUser.stackAuthId,
            email: adminUser.email!,
            fullName: adminUser.fullName!,
            role: adminUser.role,
            isActive: adminUser.isActive,
            password: adminUser.password ?? null,
            createdAt: adminUser.createdAt,
            updatedAt: adminUser.updatedAt,
        });
    }

    return prismaUsers;
}
