import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = req.url.split("/").pop();

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const sales = await prisma.sale.findUnique({
        where: { id: id! },
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

    if (!sales) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // RBAC check
    if (user.role !== "ADMIN") {
        const allowed =
            sales.createdById === user.id || sales.locationId === user.locationId;
        if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(sales);
}
