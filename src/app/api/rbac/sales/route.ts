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
        // Manager sees sales they created or for their location
        whereClause = {
            OR: [
                { createdById: user.id },
                { locationId: user.locationId },
            ],
        };
    } else if (user.role === "USER") {
        // User sees **all sales for their location**, regardless of creator
        whereClause = { locationId: user.locationId };
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
