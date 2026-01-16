import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSalesAccessControl } from "@/lib/Access-Control/SalesAccessControl copy";

// ---------------- GET all sales ----------------

export async function GET(req: NextRequest) {
    const whereClause = await getSalesAccessControl();

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
