// app/api/payments/[paymentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET(
    req: Request,
    context: { params: Promise<{ paymentId: string }> }
) {
    const { paymentId } = await context.params;

    if (!paymentId) {
        return NextResponse.json(
            { error: "Payment ID is required" },
            { status: 400 }
        );
    }

    // Load payment with customer
    const payment = await prisma.customerPayment.findUnique({
        where: { id: paymentId },
        include: { customer: true },
    });

    if (!payment) {
        return NextResponse.json(
            { error: "Payment not found" },
            { status: 404 }
        );
    }

    // 1️⃣ Compute allocated amount from THIS payment only
    const allocatedFromThisPayment = await prisma.paymentAllocation.aggregate({
        where: { customerPaymentId: paymentId },
        _sum: { amount: true },
    });

    // Ensure Decimal arithmetic
    const allocatedSum = allocatedFromThisPayment._sum.amount ?? new Prisma.Decimal(0);
    const paymentAmount = new Prisma.Decimal(payment.amount);
    const unallocatedBalance = paymentAmount.minus(allocatedSum);

    // 2️⃣ Fetch all unpaid invoices for this customer
    const sales = await prisma.sale.findMany({
        where: {
            customerId: payment.customerId,
            OR: [
                { paymentStatus: { not: "PAID" } }, // unpaid invoices
                {
                    allocations: { some: { customerPaymentId: paymentId } }, // invoices allocated from this payment
                },
            ],
        },
        include: { allocations: true, items: true },
    });

    // 3️⃣ Map invoices with correct allocations
    const invoices = sales.map((sale) => {
        const invoiceTotal = sale.items.reduce(
            (sum, item) => sum.plus(new Prisma.Decimal(item.total)),
            new Prisma.Decimal(0)
        );

        const allocatedAllPayments = sale.allocations.reduce(
            (sum, a) => sum.plus(new Prisma.Decimal(a.amount)),
            new Prisma.Decimal(0)
        );

        const allocatedByThisPayment = sale.allocations
            .filter((a) => a.customerPaymentId === paymentId)
            .reduce((sum, a) => sum.plus(new Prisma.Decimal(a.amount)), new Prisma.Decimal(0));

        return {
            id: sale.id,
            invoiceNumber: sale.invoiceNumber,
            total: invoiceTotal.toNumber(),
            balance: Math.max(0, invoiceTotal.minus(allocatedAllPayments).toNumber()),
            allocatedNow: allocatedByThisPayment.toNumber(),
        };
    });

    // Now you have the invoices array, you can filter allocated ones
    const allocatedInvoices = invoices
        .filter((inv) => inv.allocatedNow > 0)
        .map((inv) => ({
            ...inv,
            allocatedAmount: inv.allocatedNow,
        }));

    return NextResponse.json({
        payment,
        customer: payment.customer,
        invoices,
        allocatedInvoices,
        unallocatedBalance: unallocatedBalance.toNumber(),
    });
}