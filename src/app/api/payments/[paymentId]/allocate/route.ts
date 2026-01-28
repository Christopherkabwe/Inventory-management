import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/roles";
import { PaymentStatus } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ paymentId: string }> }
) {
    const user = await getCurrentUser();
    const { paymentId } = await params;
    const body = await req.json();
    const { allocations } = body;

    if (!paymentId || !user) {
        return NextResponse.json(
            { error: "User and Payment ID required" },
            { status: 400 }
        );
    }

    if (!allocations || typeof allocations !== "object") {
        return NextResponse.json(
            { error: "Invalid allocations payload" },
            { status: 400 }
        );
    }

    // 1️⃣ Load payment
    const payment = await prisma.customerPayment.findUnique({
        where: { id: paymentId },
        include: { allocations: true },
    });

    if (!payment) {
        return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // 2️⃣ Load invoices for this customer
    const invoices = await prisma.sale.findMany({
        where: { customerId: payment.customerId },
        include: { allocations: true, items: true },
    });

    // 3️⃣ Prevent non-admin editing fully allocated invoices
    for (const inv of invoices) {
        const invoiceTotal = inv.items.reduce((s, i) => s + Number(i.total), 0);
        const allocated = inv.allocations.reduce((s, a) => s + Number(a.amount), 0);
        const balance = invoiceTotal - allocated;
        const requestedAlloc = Number(allocations[inv.id] || 0);

        if (balance <= 0 && requestedAlloc > 0 && user.role !== UserRole.ADMIN) {
            return NextResponse.json(
                { error: "Only admin can edit fully allocated invoices" },
                { status: 403 }
            );
        }
    }

    // 4️⃣ Prevent over-allocation of payment
    const alreadyAllocated = payment.allocations.reduce(
        (sum, a) => sum + Number(a.amount),
        0
    );

    const newAllocationTotal = Object.values(allocations).reduce(
        (sum: number, val: any) => sum + Number(val || 0),
        0
    );

    if (alreadyAllocated + newAllocationTotal > Number(payment.amount)) {
        return NextResponse.json(
            { error: "Over-allocation not allowed" },
            { status: 400 }
        );
    }

    // 5️⃣ Execute allocation atomically with audit
    await prisma.$transaction(async (tx) => {
        for (const [saleId, rawAmount] of Object.entries(allocations)) {
            const amount = new Prisma.Decimal(rawAmount || 0);

            const existing = await tx.paymentAllocation.findFirst({
                where: { customerPaymentId: payment.id, saleId },
            });

            const oldAmount = new Prisma.Decimal(existing?.amount ?? 0);

            if (amount.lte(0)) {
                if (existing) {
                    await tx.paymentAllocation.delete({ where: { id: existing.id } });
                }
                await tx.allocationAudit.create({
                    data: {
                        customerPaymentId: payment.id,
                        saleId,
                        oldAmount,
                        newAmount: new Prisma.Decimal(0),
                        action: "DELETE",
                        createdById: user.id,
                    },
                });
                continue;
            }

            // Skip if no change
            if (existing && oldAmount.equals(amount)) continue;

            const action = existing ? "UPDATE" : "CREATE";

            // Upsert allocation
            await tx.paymentAllocation.upsert({
                where: { customerPaymentId_saleId: { customerPaymentId: payment.id, saleId } },
                update: { amount },
                create: { customerPaymentId: payment.id, saleId, amount },
            });

            // Create audit
            await tx.allocationAudit.create({
                data: { customerPaymentId: payment.id, saleId, oldAmount, newAmount: amount, action, createdById: user.id },
            });

            // Update sale payment status
            const sale = await tx.sale.findUnique({
                where: { id: saleId },
                include: { allocations: true, items: true },
            });

            if (!sale) continue;

            const saleTotal = sale.items.reduce((s, i) => s + Number(i.total), 0);
            const totalAllocated = sale.allocations.reduce((s, a) => s + Number(a.amount), 0);

            let paymentStatus: PaymentStatus = "PENDING";
            if (totalAllocated >= saleTotal) paymentStatus = "PAID";
            else if (totalAllocated > 0) paymentStatus = "PARTIAL";

            await tx.sale.update({ where: { id: saleId }, data: { paymentStatus } });
        }

        // Optionally return unallocated amount
        const totalAllocated = await tx.paymentAllocation.aggregate({
            _sum: { amount: true },
            where: { customerPaymentId: payment.id },
        });

        // Save as unallocatedBalance
        const allocatedSum = totalAllocated._sum.amount;
        await tx.customerPayment.update({
            where: { id: payment.id },
            data: { allocatedAmount: allocatedSum }, // Or store in a separate field if you add one
        })
    });

    return NextResponse.json({ success: true });
}
