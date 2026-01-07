import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    if (!id) return NextResponse.json({ error: "Invalid request" }, { status: 400 });

    const customer = await prisma.customer.findUnique({
        where: { id },
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

    if (!customer) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // RBAC check {Not necessary}


    return NextResponse.json(customer);
}