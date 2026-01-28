import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const salesOrderId = req.nextUrl.searchParams.get("salesOrderId");
        if (!salesOrderId) return NextResponse.json({ error: "salesOrderId required" }, { status: 400 });

        const invoices = await prisma.sale.findMany({
            where: { salesOrderId },
            orderBy: { createdAt: "desc" },
            include: {
                items: true,
                allocations: { select: { amount: true } }, // safer
            },
        });

        const result = invoices.map(invoice => {
            const totalAmount = invoice.items.reduce((sum, item) => sum + item.quantity * item.price, 0);
            const amountPaid = invoice.allocations.reduce((sum, a) => sum + a.amount, 0);

            return {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                status: invoice.status,
                createdAt: invoice.createdAt,
                totalAmount,
                amountPaid,
                balance: totalAmount - amountPaid,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("FETCH INVOICES ERROR:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
