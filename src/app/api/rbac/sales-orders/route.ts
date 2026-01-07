import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const whereClause: any = {};

    // Apply RBAC
    if (user.role === "MANAGER" || user.role === "USER") {
        whereClause.OR = [
            { createdById: user.id }, // data created by user
            { locationId: user.locationId }, // data for user's location
        ];
    }

    const salesOrders = await prisma.salesOrder.findMany({
        where: whereClause,
        include: {
            location: true,
            customer: true,
            createdBy: true,
            items: {
                include: {
                    product: true,
                },
            },
            invoices: {
                include: {
                    location: true,
                    customer: true,
                    transporter: true,
                    createdBy: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            deliveryNotes: {
                include: {
                    transporter: true,
                    createdBy: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
        },
    });

    return NextResponse.json(salesOrders);
}
