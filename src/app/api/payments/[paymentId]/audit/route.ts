import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ paymentId: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await params;

    try {
        const audit = await prisma.allocationAudit.findMany({
            where: { customerPaymentId: paymentId },
            include: {
                sale: { select: { id: true, invoiceNumber: true } }, // Include invoice number
                createdBy: { select: { fullName: true } },    // Include user name
            },
            orderBy: { createdAt: "desc" },
        });
        const mapped = audit.map(a => ({
            id: a.id,
            action: a.action,
            saleId: a.saleId,
            invoiceNumber: a.sale?.invoiceNumber ?? "-", // new field
            oldAmount: a.oldAmount,
            newAmount: a.newAmount,
            reason: a.reason,
            createdById: a.createdById,
            createdByName: a.createdBy?.fullName ?? "-",     // new field
            createdAt: a.createdAt,
        }));

        return NextResponse.json({ audit: mapped });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
    }
}