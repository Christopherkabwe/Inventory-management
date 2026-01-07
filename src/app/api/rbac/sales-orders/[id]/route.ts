import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = req.url.split("/").pop();

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const salesOrders = await prisma.salesOrder.findUnique({
        where: { id: id! },
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

    if (!salesOrders) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // RBAC check
    if (user.role !== "ADMIN") {
        const allowed =
            salesOrders.createdById === user.id || salesOrders.locationId === user.locationId;
        if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(salesOrders);
}
