// lib/auth.ts
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";
import { redirect } from "next/navigation";
import { UserRole } from "./rbac";

export async function getCurrentUser() {
    const stackUser = await stackServerApp.getUser();

    if (!stackUser) redirect("/sign-in");

    // Look up the user in your Prisma DB
    let user = await prisma.user.findUnique({
        where: { stackAuthId: stackUser.id },
    });

    // If first login, create the user
    if (!user) {
        user = await prisma.user.create({
            data: {
                stackAuthId: stackUser.id,
                email: stackUser.primaryEmail, // use camelCase
                fullName: stackUser.displayName ?? stackUser.primaryEmail.split("@")[0], // fallback to email prefix
                role: "USER",
                isActive: true,
            },
        });

    }

    // Now we can safely return the RBAC info
    return {
        id: user.id,
        email: user.email ?? null,
        role: user.role as UserRole,
        locationId: user.locationId ?? null,
        isActive: user.isActive ?? true,
    };
}
