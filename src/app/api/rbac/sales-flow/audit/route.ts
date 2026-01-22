import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const status = req.nextUrl.searchParams.get("status");

    const orders = await prisma.salesOrder.findMany({
        where: status && status !== "ALL"
            ? { status }
            : undefined,
        include: {
            items: true,
            invoices: {
                include: {
                    items: true,
                    returns: true,
                    creditNotes: true,
                },
            },
            customer: true,
            location: true,
        },
        orderBy: { createdAt: "desc" },
    });

    const sales = orders.map(order => {
        const totalItems = order.items.reduce(
            (sum, item) => sum + item.quantity,
            0
        );

        const returnedItems = order.invoices.flatMap(
            inv => inv.returns
        ).length;

        const creditNotesCount = order.invoices.flatMap(
            inv => inv.creditNotes
        ).length;

        return {
            id: order.id,
            invoiceNumber: order.invoices[0]?.invoiceNumber ?? "-",
            status: order.status,
            saleDate: order.createdAt,
            customer: {
                id: order.customer.id,
                name: order.customer.name,
            },
            location: {
                id: order.location.id,
                name: order.location.name,
            },
            totalItems,
            returnedItems,
            creditNotesCount,
        };
    });

    return NextResponse.json({ sales });
}
