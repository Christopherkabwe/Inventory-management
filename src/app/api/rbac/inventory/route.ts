import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let whereClause: any = {};

    if (user.role === "ADMIN") {
        whereClause = {}; // sees everything
    } else if (user.role === "MANAGER") {
        const managedUserIds = await prisma.user
            .findMany({ where: { managerId: user.id }, select: { id: true } })
            .then((res) => res.map((u) => u.id));

        whereClause = {
            OR: [
                { createdById: user.id }, // inventory created by manager
                { assignedUserId: { in: managedUserIds } }, // inventory assigned to users they manage
                { locationId: user.locationId }, // inventory in manager's location

            ],
        };
    } else if (user.role === "USER") {
        whereClause = {
            OR: [
                { createdById: user.id }, // inventory they created
                { assignedUserId: user.id }, // inventory assigned to them
                { locationId: user.locationId }, // inventory in location
            ],
        };
    }

    const inventories = await prisma.inventory.findMany({
        where: whereClause,
        include: {
            product: {
                include: {
                    createdBy: true,
                    saleItems: true,
                    transferItems: true,
                    productionItems: true,
                    adjustmentItems: true,
                    orderItems: true,
                    quotationItems: true,
                    saleReturns: true,
                    deliveryNoteItems: true,
                    transferReceiptItems: true,
                },
            },
            location: true,
            assignedUser: {
                select: {
                    id: true,
                    fullName: true,
                    managerId: true,
                },
            },
            createdBy: true,
        },
    });

    return NextResponse.json(inventories);
}