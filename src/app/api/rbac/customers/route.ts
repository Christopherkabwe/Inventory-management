import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const whereClause: any = {};

    // Apply RBAC {Not necessary}

    const customers = await prisma.customer.findMany({
        where: whereClause,
        include: {
            createdBy: true,
            sales: {
                include: {
                    location: true,
                    transporter: true,
                    createdBy: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    creditNotes: true,
                    returns: true,
                    deliveryNotes: true,
                },
            },
            orders: {
                include: {
                    location: true,
                    createdBy: true,
                    items: {
                        include: {
                            product: true,
                        },
                    },
                    invoices: true,
                    deliveryNotes: true,
                },
            },
            quotations: {
                include: {
                    location: true,
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

    return NextResponse.json(customers);
}
