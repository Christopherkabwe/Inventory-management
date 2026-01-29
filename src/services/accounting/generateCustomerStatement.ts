// src/services/accounting/generateCustomerStatement.ts
import { prisma } from '@/lib/prisma'

export async function generateCustomerStatement({
    customerId,
    year,
    month,
    issuedById,
}: {
    customerId: string
    year: number
    month: number
    issuedById: string
}) {
    const periodStart = new Date(year, month - 1, 1)
    const periodEnd = new Date(year, month, 0, 23, 59, 59)

    // 🔐 Ensure period is closed
    const period = await prisma.accountingPeriod.findUnique({
        where: { year_month: { year, month } },
    })
    if (!period?.isClosed) {
        throw new Error('Accounting period not closed')
    }

    // 🔢 Opening balance = all history before period
    const opening = await prisma.$queryRawUnsafe<number>(`
    SELECT COALESCE(SUM(
      CASE 
        WHEN s."saleDate" < $1 THEN si.total
        ELSE 0
      END
    ), 0)
    FROM "Sale" s
    JOIN "SaleItem" si ON si."saleId" = s.id
    WHERE s."customerId" = $2
  `, periodStart, customerId)

    let runningBalance = opening
    const lines: any[] = []

    // Invoices in period
    const invoices = await prisma.sale.findMany({
        where: {
            customerId,
            saleDate: { gte: periodStart, lte: periodEnd },
        },
        include: {
            items: true,
            allocations: true,
            creditNotes: true,
        },
        orderBy: { saleDate: 'asc' },
    })

    for (const inv of invoices) {
        const total = inv.items.reduce((s, i) => s + i.total, 0)
        runningBalance += total

        lines.push({
            date: inv.saleDate,
            reference: inv.invoiceNumber,
            type: 'INVOICE',
            debit: total,
            credit: 0,
            balance: runningBalance,
        })

        for (const alloc of inv.allocations) {
            runningBalance -= alloc.amount
            lines.push({
                date: alloc.createdAt,
                reference: inv.invoiceNumber,
                type: 'PAYMENT',
                debit: 0,
                credit: alloc.amount,
                balance: runningBalance,
            })
        }

        for (const cn of inv.creditNotes) {
            runningBalance -= cn.amount
            lines.push({
                date: cn.createdAt,
                reference: cn.creditNoteNumber,
                type: 'CREDIT_NOTE',
                debit: 0,
                credit: cn.amount,
                balance: runningBalance,
            })
        }
    }

    return prisma.customerStatement.create({
        data: {
            customerId,
            periodYear: year,
            periodMonth: month,
            openingBalance: opening,
            closingBalance: runningBalance,
            issuedById,
            lines: {
                createMany: { data: lines },
            },
        },
    })
}
