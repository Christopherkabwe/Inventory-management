// app/api/payments/[paymentId]/rollback/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { AllocationAction, PaymentStatus } from "@/generated/prisma";
import { Prisma } from "@/generated/prisma";

export async function POST(
    req: Request,
    context: { params: Promise<{ paymentId: string }> }
) {
    const { paymentId } = await context.params;
    const user = await getCurrentUser();
    const { step, auditId, reason } = await req.json();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (user.role !== "ADMIN") {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    if (!reason?.trim()) {
        return NextResponse.json(
            { error: "Reason is required" },
            { status: 400 }
        );
    }

    await prisma.$transaction(async (tx) => {
        // 🔥 FULL RESET — delete all allocations
        if (step === "ALL") {
            const allocations = await tx.paymentAllocation.findMany({
                where: { customerPaymentId: paymentId },
            });

            for (const alloc of allocations) {
                await tx.allocationAudit.create({
                    data: {
                        customerPaymentId: paymentId,
                        saleId: alloc.saleId,
                        oldAmount: alloc.amount,
                        newAmount: new Prisma.Decimal(0),
                        action: AllocationAction.ROLLBACK,
                        createdById: user.id,
                        reason,
                    },
                });
            }

            await tx.paymentAllocation.deleteMany({
                where: { customerPaymentId: paymentId },
            });

            // Update unallocated balance on payment
            await tx.customerPayment.update({
                where: { id: paymentId },
                data: { unallocatedBalance: null }, // reset to full payment amount or zero
            });

            // Update all affected sales
            const saleIds = allocations.map((a) => a.saleId);
            for (const saleId of saleIds) {
                await updateSalePaymentStatus(tx, saleId);
            }

            return;
        }

        // 🔁 SINGLE ENTRY rollback
        let auditEntry;

        if (step === "ENTRY") {
            auditEntry = await tx.allocationAudit.findUnique({
                where: { id: auditId },
            });

            if (!auditEntry || auditEntry.action === AllocationAction.ROLLBACK) {
                throw new Error("Invalid audit entry for rollback");
            }
        } else if (step === "LAST") {
            auditEntry = await tx.allocationAudit.findFirst({
                where: {
                    customerPaymentId: paymentId,
                    action: { not: AllocationAction.ROLLBACK },
                },
                orderBy: { createdAt: "desc" },
            });
        }

        if (!auditEntry) {
            throw new Error("No allocation history found for rollback");
        }

        const allocation = await tx.paymentAllocation.findFirst({
            where: {
                customerPaymentId: paymentId,
                saleId: auditEntry.saleId!,
            },
        });

        if (allocation) {
            if (auditEntry.oldAmount.equals(0)) {
                await tx.paymentAllocation.delete({
                    where: { id: allocation.id },
                });
            } else {
                await tx.paymentAllocation.update({
                    where: { id: allocation.id },
                    data: { amount: auditEntry.oldAmount },
                });
            }
        } else if (auditEntry.oldAmount.gt(0)) {
            await tx.paymentAllocation.create({
                data: {
                    customerPaymentId: paymentId,
                    saleId: auditEntry.saleId!,
                    amount: auditEntry.oldAmount,
                },
            });
        }

        // Create rollback audit entry
        await tx.allocationAudit.create({
            data: {
                customerPaymentId: paymentId,
                saleId: auditEntry.saleId,
                oldAmount: auditEntry.newAmount,
                newAmount: auditEntry.oldAmount,
                action: AllocationAction.ROLLBACK,
                createdById: user.id,
                reason,
            },
        });

        // ✅ Update sale payment status
        await updateSalePaymentStatus(tx, auditEntry.saleId!);

        // ✅ Update unallocated balance on payment
        const totalAllocated = await tx.paymentAllocation.aggregate({
            _sum: { amount: true },
            where: { customerPaymentId: paymentId },
        });

        const paymentRecord = await tx.customerPayment.findUnique({
            where: { id: paymentId },
        });

        if (paymentRecord) {
            await tx.customerPayment.update({
                where: { id: paymentId },
                data: {
                    unallocatedBalance:
                        (paymentRecord.amount as Prisma.Decimal).minus(
                            totalAllocated._sum.amount ?? new Prisma.Decimal(0)
                        ),
                },
            });
        }
    });

    return NextResponse.json({ success: true });
}

// Helper function to update sale payment status
async function updateSalePaymentStatus(
    tx: Prisma.TransactionClient,
    saleId: string
) {
    const sale = await tx.sale.findUnique({
        where: { id: saleId },
        include: { allocations: true, items: true },
    });

    if (!sale) return;

    const saleTotal = sale.items.reduce((s, i) => s + Number(i.total), 0);
    const totalAllocated = sale.allocations.reduce(
        (s, a) => s + Number(a.amount),
        0
    );

    let paymentStatus: PaymentStatus = "PENDING";
    if (totalAllocated >= saleTotal) paymentStatus = "PAID";
    else if (totalAllocated > 0) paymentStatus = "PARTIAL";

    await tx.sale.update({
        where: { id: saleId },
        data: { paymentStatus },
    });
}
