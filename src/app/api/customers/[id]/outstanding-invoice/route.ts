import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(
    _req: Request,
    { params }: { params: { id: string } }
) {
    const customerId = params.id

    const sales = await prisma.sale.findMany({
        where: {
            customerId,
            paymentStatus: { not: "PAID" },
        },
        include: {
            items: {
                select: { total: true },
            },
            allocations: {
                select: { amount: true },
            },
        },
        orderBy: { saleDate: "asc" },
    })

    const data = sales.map((sale) => {
        const invoiceTotal = sale.items.reduce((s, i) => s + i.total, 0)
        const paid = sale.allocations.reduce((s, a) => s + a.amount, 0)

        return {
            id: sale.id,
            invoiceNumber: sale.invoiceNumber,
            saleDate: sale.saleDate,
            total: invoiceTotal,
            paid,
            balance: invoiceTotal - paid,
        }
    })

    return NextResponse.json(data)
}
