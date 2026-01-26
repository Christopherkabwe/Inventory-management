import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status && status !== "ALL") {
        whereClause.status = status;
    }

    const sales = await prisma.sale.findMany({
        where: whereClause,
        include: {
            customer: true,
            location: true,
            items: {
                include: {
                    product: true,
                },
            },
            returns: true,
            creditNotes: true,
        },
        orderBy: { saleDate: "desc" },
    });

    const mapped = sales.map((s) => ({
        id: s.id,
        invoiceNumber: s.invoiceNumber,
        status: s.status,
        saleDate: s.saleDate.toISOString(),
        customer: { id: s.customer.id, name: s.customer.name },
        location: { id: s.location.id, name: s.location.name },
        totalItems: s.items.reduce((acc, i) => acc + i.quantity, 0),
        returnedItems: s.returns.reduce((acc, r) => acc + r.quantity, 0),
        creditNotesCount: s.creditNotes.length,
    }));

    return NextResponse.json({ sales: mapped });
}
