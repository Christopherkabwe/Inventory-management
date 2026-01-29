import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/roles";
import { Prisma } from "@/generated/prisma";
import withRetries from "@/lib/retry";

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const body = await req.json();
    const { paymentId } = body;

    if (!paymentId) {
        return NextResponse.json({ error: "Payment ID required" }, { status: 400 });
    }
    await withRetries(() =>
        // Start transaction for atomic auto-allocation
        prisma.$transaction(async (tx) => {
            // 1️⃣ Load the payment with allocations
            const payment = await tx.customerPayment.findUnique({
                where: { id: paymentId },
                include: { allocations: true },
            });

            if (!payment) {
                throw new Error("Payment not found");
            }

            // 2️⃣ Calculate remaining unallocated amount
            const alreadyAllocated = payment.allocations.reduce(
                (sum, a) => sum.plus(a.amount),
                new Prisma.Decimal(0)
            );

            let remaining = new Prisma.Decimal(payment.amount).minus(alreadyAllocated);
            if (remaining.lte(0)) return; // Nothing to auto-allocate

            // 3️⃣ Fetch unpaid invoices (FIFO) for this customer
            const unpaidInvoices = await tx.sale.findMany({
                where: {
                    customerId: payment.customerId,
                    paymentStatus: { not: "PAID" },
                },
                include: { allocations: true, items: true },
                orderBy: { createdAt: "asc" },
            });

            // ✅ NEW: No unpaid invoices → advance payment
            if (unpaidInvoices.length === 0) {
                await tx.customerPayment.update({
                    where: { id: payment.id },
                    data: {
                        allocatedAmount: payment.amount,
                        balance: new Prisma.Decimal(0),
                    },
                });
                return;
            }


            // 4️⃣ Apply leftover funds to invoices
            for (const sale of unpaidInvoices) {
                if (remaining.lte(0)) break;

                const saleTotal = sale.items.reduce((s, i) => s.plus(i.total), new Prisma.Decimal(0));
                const allocatedToSale = sale.allocations.reduce((s, a) => s.plus(a.amount), new Prisma.Decimal(0));
                const balance = saleTotal.minus(allocatedToSale);

                if (balance.lte(0)) continue; // Already paid

                const applyAmount = Prisma.Decimal.min(balance, remaining);

                // Create allocation
                await tx.paymentAllocation.create({
                    data: {
                        customerPaymentId: payment.id,
                        saleId: sale.id,
                        amount: applyAmount,
                    },
                });

                // Audit
                await tx.allocationAudit.create({
                    data: {
                        customerPaymentId: payment.id,
                        saleId: sale.id,
                        oldAmount: new Prisma.Decimal(0),
                        newAmount: applyAmount,
                        action: "CREATE",
                        createdById: user.id,
                    },
                });

                // Update sale status
                await tx.sale.update({
                    where: { id: sale.id },
                    data: {
                        paymentStatus: applyAmount.equals(balance) ? "PAID" : "PARTIAL",
                    },
                });

                remaining = remaining.minus(applyAmount);
            }

            // 5️⃣ Update payment allocatedAmount
            const totalAllocated = await tx.paymentAllocation.aggregate({
                _sum: { amount: true },
                where: { customerPaymentId: payment.id },
            });

            await tx.customerPayment.update({
                where: { id: payment.id },
                data: { allocatedAmount: totalAllocated._sum.amount ?? new Prisma.Decimal(0) },
            });
        })
    );

    return NextResponse.json({ success: true });
}
