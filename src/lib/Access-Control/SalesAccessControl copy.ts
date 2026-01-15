// lib/salesAccessControl.js
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function getSalesAccessControl() {
    const user = await getCurrentUser();
    if (!user) {
        throw new Error("Unauthorized");
    }

    let whereClause = {};
    if (user.role === "ADMIN") {
        // Admin sees everything
        whereClause = {};
    } else if (user.role === "MANAGER") {
        // Manager sees:
        // 1️⃣ Sales they created
        // 2️⃣ Sales for customers assigned to users they manage
        // 3️⃣ Sales happening in their location(s)
        const managedUserIds = await getManagedUserIds(user.id);
        whereClause = {
            OR: [
                { createdById: user.id }, // sales created by manager
                { customer: { userId: { in: managedUserIds } } }, // customers assigned to managed users
                { locationId: { in: [...managedUserIds, user.locationId] } }, // sales in manager's location and managed users' locations
            ],
        };
    } else if (user.role === "USER") {
        // User sees sales they created + sales for their assigned customers
        whereClause = {
            OR: [
                { createdById: user.id },
                { customer: { userId: user.id } },
            ],
        };
    }

    return whereClause;
}

async function getManagedUserIds(managerId: string) {
    const managedUsers = await prisma.user.findMany({
        where: { managerId },
        select: { id: true },
    });
    const managedUserIds = [managerId, ...managedUsers.map((u) => u.id)];
    for (const user of managedUsers) {
        const subManagedUserIds = await getManagedUserIds(user.id);
        managedUserIds.push(...subManagedUserIds);
    }
    return managedUserIds;
}