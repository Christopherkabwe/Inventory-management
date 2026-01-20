import { prisma } from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export async function buildCustomerRBACWhere(user: {
    id: string;
    role: "ADMIN" | "MANAGER" | "USER";
    locationId?: string | null;
}): Promise<Prisma.CustomerWhereInput> {

    if (user.role === "ADMIN") {
        return {};
    }

    if (user.role === "MANAGER") {
        const managedUserIds = await prisma.user.findMany({
            where: { managerId: user.id },
            select: { id: true },
        }).then(r => r.map(u => u.id));

        const OR: Prisma.CustomerWhereInput[] = [
            { createdById: user.id },
        ];

        if (managedUserIds.length > 0) {
            OR.push({ userId: { in: managedUserIds } }); // use userId scalar
        }

        if (user.locationId) {
            OR.push({ locationId: user.locationId });
        }

        return { OR };
    }

    // USER
    const OR: Prisma.CustomerWhereInput[] = [
        { createdById: user.id },
        { userId: user.id }, // use userId scalar
    ];

    if (user.locationId) {
        OR.push({ locationId: user.locationId });
    }

    return { OR };
}
