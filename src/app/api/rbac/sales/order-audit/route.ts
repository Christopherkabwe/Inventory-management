import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const orders = await prisma.salesOrder.findMany({
        include: {
            items: { include: { product: true } },
            invoices: {
                include: {
                    items: { include: { product: true } },
                    deliveryNotes: { include: { items: { include: { product: true } } } },
                    returns: { include: { product: true, createdBy: true } },
                    creditNotes: { include: { createdBy: true } },
                },
            },
            customer: true,
            location: true,
            createdBy: true,
        },
    });

    return NextResponse.json({ orders });
}
