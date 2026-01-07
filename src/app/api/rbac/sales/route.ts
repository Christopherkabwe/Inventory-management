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

    const sales = await prisma.sale.findMany({
        where: whereClause,
        include: {
            salesOrder: {
                include: {
                    customer: true,
                    location: true,
                    createdBy: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                },
            },
            location: true,
            customer: true,
            transporter: true,
            createdBy: true,
            items: {
                include: {
                    product: true,
                },
            },
            creditNotes: {
                include: {
                    createdBy: true,
                },
            },
            returns: {
                include: {
                    product: true,
                    createdBy: true,
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

    return NextResponse.json(sales);
}
