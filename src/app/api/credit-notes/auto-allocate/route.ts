import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";
import withRetries from "@/lib/retry";

export async function POST(req: Request) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "User not authenticated" }, { status: 401 });
    }

    const { customerId } = await req.json();
    if (!customerId) {
        return NextResponse.json({ error: "Customer ID required" }, { status: 400 });
    }

    await withRetries(() =>
        prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch all credit notes with remaining balance for this customer
            const creditNotes = await tx.creditNote.findMany({
                where: {
                    sale: { customerId },
                },
                include: { sale: true },
            });

            for (const cn of creditNotes) {
                // calculate remaining balance
                const allocatedSum = await tx.creditNoteAllocation.aggregate({
                    _sum: { amount: true },
                    where: { creditNoteId: cn.id },
                });

                let remaining = new Prisma.Decimal(cn.amount).minus(
                    allocatedSum._sum.amount ?? new Prisma.Decimal(0)
                );
                if (remaining.lte(0)) continue;

                // 2️⃣ Fetch unpaid invoices for this customer (FIFO)
                const unpaidInvoices = await tx.sale.findMany({
                    where: {
                        customerId,
                        paymentStatus: { not: "PAID" },
                        id: { not: cn.saleId }, // skip the invoice that generated the credit note
                    },
                    include: { items: true, creditNoteAllocations: true },
                    orderBy: { createdAt: "asc" },
                });

                for (const sale of unpaidInvoices) {
                    if (remaining.lte(0)) break;

                    const totalInvoice = sale.items.reduce(
                        (sum, i) => sum.plus(i.total),
                        new Prisma.Decimal(0)
                    );

                    const allocatedToInvoice = sale.creditNoteAllocations.reduce(
                        (sum, a) => sum.plus(a.amount),
                        new Prisma.Decimal(0)
                    );

                    const balance = totalInvoice.minus(allocatedToInvoice);
                    if (balance.lte(0)) continue;

                    const applyAmount = Prisma.Decimal.min(balance, remaining);

                    await tx.creditNoteAllocation.create({
                        data: {
                            creditNoteId: cn.id,
                            saleId: sale.id,
                            amount: applyAmount.toNumber(),
                        },
                    });

                    await tx.sale.update({
                        where: { id: sale.id },
                        data: {
                            paymentStatus:
                                allocatedToInvoice.plus(applyAmount).gte(totalInvoice)
                                    ? "PAID"
                                    : "PARTIAL",
                        },
                    });

                    remaining = remaining.minus(applyAmount);
                }
            }
        })
    );

    return NextResponse.json({ success: true });
}

