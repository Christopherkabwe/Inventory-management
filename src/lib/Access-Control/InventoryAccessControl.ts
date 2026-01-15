// lib/accessControl.js
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import getManagedUserIds from "@/lib/Access-Control/getManagedUserIds";

export async function getInventoryAccessControl() {
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
        // 1️⃣ Data they created
        // 2️⃣ Data for users assigned to users they manage
        // 3️⃣ Data happening in their location(s)
        const managedUserIds = await getManagedUserIds(user.id);
        const managedLocationIds = await prisma.user.findMany({
            where: { id: { in: managedUserIds } },
            select: { locationId: true },
        }).then((res) => res.map((u) => u.locationId));
        whereClause = {
            OR: [
                { createdById: user.id }, // Data created by manager
                { createdById: { in: managedUserIds } }, // Data for users assigned to managed users
                { locationId: { in: [...managedLocationIds, user.locationId] } }, // Data in manager's location and managed users' locations
            ],
        };
    } else if (user.role === "USER") {
        // User sees Data they created + Data for their assigned users
        whereClause = {
            OR: [
                { createdById: user.id },
                { locationId: user.locationId },
            ],
        };
    }

    return whereClause;
}