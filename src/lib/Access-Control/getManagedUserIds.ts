import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { get } from "https";

export default async function getManagedUserIds(managerId: string) {
    const user = await getCurrentUser();

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