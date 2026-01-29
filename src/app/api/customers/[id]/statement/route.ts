import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params

    const { searchParams } = new URL(req.url)
    const year = Number(searchParams.get('year'))
    const month = Number(searchParams.get('month'))

    if (!year || !month) {
        return NextResponse.json({ error: 'Year and month are required' }, { status: 400 })
    }

    const customer = await prisma.customer.findUnique({ where: { id } })
    if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 })

    const periodStart = new Date(year, month - 1, 1)
    const periodEnd = new Date(year, month, 0, 23, 59, 59)

    // --- OPENING BALANCE ---
    const openingInvoices = await prisma.saleItem.aggregate({
        _sum: { total: true },
        where: { sale: { customerId: id, saleDate: { lt: periodStart } } },
    })

    const openingAllocatedPayments = await prisma.paymentAllocation.aggregate({
        _sum: { amount: true },
        where: { sale: { customerId: id, saleDate: { lt: periodStart } } },
    })

    const openingUnallocatedPayments = await prisma.customerPayment.aggregate({
        _sum: { amount: true },
        where: { customerId: id, paymentDate: { lt: periodStart } },
    })

    let openingBalance =
        (openingInvoices._sum.total ?? 0) -
        (openingAllocatedPayments._sum.amount ?? 0) -
        (openingUnallocatedPayments._sum.amount ?? 0)

    // --- COLLECT ALL LINES FIRST ---
    const lines: any[] = []

    // Invoices and Credit Notes
    const invoices = await prisma.sale.findMany({
        where: { customerId: id, saleDate: { gte: periodStart, lte: periodEnd } },
        include: { items: true, creditNotes: true },
    })

    for (const inv of invoices) {
        const invoiceTotal = inv.items.reduce((sum, i) => sum + i.total, 0)
        lines.push({
            date: inv.saleDate,
            reference: inv.invoiceNumber,
            type: 'INVOICE',
            debit: invoiceTotal,
            credit: 0,
        })

        for (const cn of inv.creditNotes) {
            lines.push({
                date: cn.createdAt,
                reference: cn.creditNoteNumber,
                type: 'CREDIT_NOTE',
                debit: 0,
                credit: cn.amount,
            })
        }
    }

    // Payments
    const payments = await prisma.customerPayment.findMany({
        where: {
            customerId: id,
            paymentDate: { gte: periodStart, lte: periodEnd },
        },
    })

    for (const p of payments) {
        lines.push({
            date: p.paymentDate,
            reference: p.reference ? `${p.method}_${p.reference}` : `${p.method}_${p.id}`,
            type: 'PAYMENT',
            debit: 0,
            credit: p.amount,
        })
    }

    // --- SORT LINES BY DATE ASCENDING, THEN TYPE ORDER ---
    const typeOrder = { INVOICE: 1, CREDIT_NOTE: 2, PAYMENT: 3 }
    lines.sort((a, b) => {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime()
        if (dateDiff !== 0) return dateDiff
        return typeOrder[a.type] - typeOrder[b.type]
    })

    // --- CALCULATE RUNNING BALANCE ---
    let runningBalance = openingBalance
    for (const line of lines) {
        runningBalance += (line.debit ?? 0) - (line.credit ?? 0)
        line.balance = runningBalance
    }

    return NextResponse.json({
        customer,
        openingBalance,
        closingBalance: runningBalance,
        lines,
    })
}
