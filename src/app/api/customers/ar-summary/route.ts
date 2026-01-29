// /api/customers/ar-summary.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all customers
        const customers = await prisma.customer.findMany();

        // Fetch all invoices with related data
        const invoices = await prisma.sale.findMany({
            include: {
                items: true,
                allocations: true,
                creditNotes: true,
            },
        });

        // Fetch all customer payments with allocations
        const payments = await prisma.customerPayment.findMany({
            include: { allocations: true },
        });

        // Compute unallocated per customer
        const unallocatedMap = new Map<string, number>();
        payments.forEach((p) => {
            const allocatedSum = p.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
            const unallocated = Number(p.amount) - allocatedSum;
            unallocatedMap.set(p.customerId, (unallocatedMap.get(p.customerId) ?? 0) + unallocated);
        });

        // Build summary per customer
        const summaries = customers.map((c) => {
            const customerInvoices = invoices.filter((inv) => inv.customerId === c.id);

            // Total invoices count
            const totalInvoices = customerInvoices.length;

            // Total invoice value
            const totalInvoiceValue = customerInvoices.reduce((sum, inv) => {
                return sum + inv.items.reduce((s, item) => s + Number(item.total || 0), 0);
            }, 0);

            // Total credits from credit notes
            const totalCredits = customerInvoices.reduce((sum, inv) => {
                return sum + inv.creditNotes.reduce((s, c) => s + Number(c.amount || 0), 0);
            }, 0);

            // Total paid = sum of all customer payments
            const totalPaid = payments
                .filter((p) => p.customerId === c.id)
                .reduce((sum, p) => sum + Number(p.amount), 0);

            // Outstanding = total invoice value - total paid - credits
            const outstandingBalance = totalInvoiceValue - totalPaid - totalCredits;

            const unallocated = unallocatedMap.get(c.id) ?? 0;

            return {
                id: c.id,
                name: c.name,
                totalInvoices,
                totalInvoiceValue,
                totalPaid,
                totalCredits,
                outstandingBalance,
                unallocated,
            };
        });

        return NextResponse.json(summaries);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch AR summary" }, { status: 500 });
    }
}
