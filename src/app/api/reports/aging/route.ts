import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url)
    const locationId = searchParams.get('locationId') // optional
    const asOfDateParam = searchParams.get('asOfDate') // optional
    const asOfDate = asOfDateParam ? new Date(asOfDateParam) : new Date()

    // Fetch invoices
    const invoices = await prisma.sale.findMany({
        where: {
            ...(locationId ? { locationId } : {}),
            status: { not: 'CANCELLED' },
        },
        include: {
            items: true,
            allocations: true, // payments applied
            customer: true,
        },
        orderBy: { saleDate: 'asc' },
    })

    // Fetch unallocated customer payments to reduce balances
    const customerPayments = await prisma.customerPayment.findMany({
        where: {
            ...(locationId ? { customer: { locationId } } : {}),
        },
    })

    // Build report per customer
    const reportByCustomer: Record<string, any> = {}

    for (const inv of invoices) {
        const totalInvoice = inv.items.reduce((sum, i) => sum + i.total, 0)
        const allocatedPayments = inv.allocations.reduce((sum, a) => sum + a.amount, 0)
        const customerUnallocatedPayments = customerPayments
            .filter(p => p.customerId === inv.customerId)
            .reduce((sum, p) => sum + (p.amount - (p.allocatedAmount ?? 0)), 0)

        const balance = totalInvoice - allocatedPayments - customerUnallocatedPayments

        if (balance <= 0) continue // fully paid

        const daysOverdue = inv.dueDate
            ? Math.floor((asOfDate.getTime() - new Date(inv.dueDate).getTime()) / (1000 * 60 * 60 * 24))
            : 0

        let agingBucket = 'Current'
        if (daysOverdue > 0 && daysOverdue <= 30) agingBucket = '0-30'
        else if (daysOverdue <= 60) agingBucket = '31-60'
        else if (daysOverdue <= 90) agingBucket = '61-90'
        else if (daysOverdue > 90) agingBucket = '90+'

        if (!reportByCustomer[inv.customerId]) {
            reportByCustomer[inv.customerId] = {
                customerName: inv.customer.name,
                totalBalance: 0,
                buckets: { Current: 0, '0-30': 0, '31-60': 0, '61-90': 0, '90+': 0 },
                invoices: [],
            }
        }

        reportByCustomer[inv.customerId].invoices.push({
            invoiceNumber: inv.invoiceNumber,
            saleDate: inv.saleDate,
            dueDate: inv.dueDate,
            total: totalInvoice,
            allocatedPayments,
            unallocatedPayments: customerUnallocatedPayments,
            balance,
            daysOverdue,
            agingBucket,
        })

        // Aggregate totals
        reportByCustomer[inv.customerId].totalBalance += balance
        reportByCustomer[inv.customerId].buckets[agingBucket] += balance
    }

    // Convert object to array
    const report = Object.values(reportByCustomer)

    // Optional: compute grand totals
    const grandTotals = {
        totalBalance: report.reduce((sum, c) => sum + c.totalBalance, 0),
        buckets: {
            Current: report.reduce((sum, c) => sum + c.buckets.Current, 0),
            '0-30': report.reduce((sum, c) => sum + c.buckets['0-30'], 0),
            '31-60': report.reduce((sum, c) => sum + c.buckets['31-60'], 0),
            '61-90': report.reduce((sum, c) => sum + c.buckets['61-90'], 0),
            '90+': report.reduce((sum, c) => sum + c.buckets['90+'], 0),
        },
    }

    return NextResponse.json({ report, grandTotals })
}
