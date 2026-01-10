import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let whereClause: any = {};

    if (user.role === "ADMIN") {
        // Admin sees everything
        whereClause = {};
    } else if (user.role === "MANAGER") {
        // Manager sees:
        // 1️⃣ Sales they created
        // 2️⃣ Sales for customers assigned to users they manage
        // 3️⃣ Sales happening in their location(s)
        const managedUserIds = await prisma.user
            .findMany({ where: { managerId: user.id }, select: { id: true } })
            .then((res) => res.map((u) => u.id));

        whereClause = {
            OR: [
                { createdById: user.id }, // sales created by manager
                { customer: { userId: { in: managedUserIds } } }, // customers assigned to managed users
                { locationId: user.locationId }, // sales in manager's location
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

    const sales = await prisma.sale.findMany({
        where: whereClause,
        include: {
            items: { include: { product: true } },
            customer: {
                include: {
                    user: {
                        include: {
                            manager: true, // <-- include manager here
                        },
                    },
                },
            },
            location: true,
            transporter: true,
            creditNotes: { include: { createdBy: true } },
            returns: { include: { product: true, createdBy: true } },
            deliveryNotes: {
                include: {
                    transporter: true,
                    createdBy: true,
                    items: { include: { product: true } },
                },
            },

        },
    });

    return NextResponse.json(sales);
}
