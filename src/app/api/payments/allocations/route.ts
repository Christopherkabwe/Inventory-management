// app/api/payments/allocations/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/generated/prisma";

export async function GET() {
    try {
        // 1️⃣ Load all payments with customer info
        const payments = await prisma.customerPayment.findMany({
            include: { customer: true },
            orderBy: { createdAt: "desc" },
        });

        // 2️⃣ For each payment, load invoices allocated from it
        const allocations = await Promise.all(
            payments.map(async (payment) => {
                const sales = await prisma.sale.findMany({
                    where: {
                        customerId: payment.customerId,
                        OR: [
                            { paymentStatus: { not: "PAID" } },
                            { allocations: { some: { customerPaymentId: payment.id } } },
                        ],
                    },
                    include: { allocations: true, items: true },
                });

                // Map invoices with allocation info and timestamps
                const invoices = sales.flatMap((sale) => {
                    return sale.allocations
                        .filter((a) => a.customerPaymentId === payment.id)
                        .map((a) => {
                            const invoiceTotal = sale.items.reduce(
                                (sum, item) => sum.plus(new Prisma.Decimal(item.total)),
                                new Prisma.Decimal(0)
                            );

                            const allocatedAllPayments = sale.allocations.reduce(
                                (sum, alloc) => sum.plus(new Prisma.Decimal(alloc.amount)),
                                new Prisma.Decimal(0)
                            );

                            return {
                                id: sale.id,
                                invoiceNumber: sale.invoiceNumber,
                                total: invoiceTotal.toNumber(),
                                balance: invoiceTotal.minus(allocatedAllPayments).toNumber(),
                                allocatedNow: Number(a.amount),
                                allocatedAt: a.createdAt, // ✅ allocation timestamp
                                paymentStatus: sale.paymentStatus,
                            };
                        });
                });

                // Compute unallocated balance for this payment
                const allocatedFromThisPayment = await prisma.paymentAllocation.aggregate({
                    where: { customerPaymentId: payment.id },
                    _sum: { amount: true },
                });

                const allocatedSum = allocatedFromThisPayment._sum.amount ?? new Prisma.Decimal(0);
                const unallocatedBalance = new Prisma.Decimal(payment.amount)
                    .minus(allocatedSum)
                    .toNumber();

                return {
                    payment: {
                        id: payment.id,
                        customer: { id: payment.customer.id, name: payment.customer.name },
                        amount: Number(payment.amount),
                        allocatedAmount: Number(allocatedSum),
                        unallocatedBalance,
                        createdAt: payment.createdAt, // ✅ payment received date
                    },
                    invoices,
                };
            })
        );

        return NextResponse.json({ allocations });
    } catch (err) {
        console.error("Failed to fetch allocations:", err);
        return NextResponse.json({ error: "Failed to fetch allocations" }, { status: 500 });
    }
}
