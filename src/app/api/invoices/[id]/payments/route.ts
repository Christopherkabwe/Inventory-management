import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* ======================================================
   PATCH: Add Payment to an Invoice
====================================================== */
export async function PATCH(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params; // invoice id
    const { payments } = await req.json();

    if (!payments?.length) {
        return NextResponse.json({ error: "No payments provided" }, { status: 400 });
    }

    try {
        const updatedSale = await prisma.$transaction(async (tx) => {
            // 1️⃣ Load the invoice
            const sale = await tx.sale.findUnique({
                where: { id },
                include: { payments: true, items: true },
            });

            if (!sale) throw new Error("Invoice not found");

            // 2️⃣ If invoice is fully paid, we still allow overpayment, but optionally can prevent edits to items
            const totalInvoice = sale.items.reduce((sum, i) => sum + i.total, 0);
            const currentPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);

            // 3️⃣ Create new payments
            const createData = payments.map((p: any) => ({
                saleId: id,
                amount: Number(p.amount),
                method: p.method,
                reference: p.reference ?? null,
            }));

            await tx.salePayment.createMany({ data: createData });

            // 4️⃣ Recalculate total paid
            const newTotalPaid = currentPaid + payments.reduce((sum, p: any) => sum + Number(p.amount), 0);

            // 5️⃣ Update invoice status
            let status: "CONFIRMED" | "PARTIALLY_PAID" | "PAID" = "CONFIRMED";

            if (newTotalPaid === 0) status = "CONFIRMED";
            else if (newTotalPaid < totalInvoice) status = "PARTIALLY_PAID";
            else status = "PAID"; // allows overpayment

            const updated = await tx.sale.update({
                where: { id },
                data: { status },
                include: { payments: true, items: true },
            });

            return updated;
        });

        return NextResponse.json({
            id: updatedSale.id,
            invoiceNumber: updatedSale.invoiceNumber,
            status: updatedSale.status,
            totalPaid: updatedSale.payments.reduce((sum, p) => sum + p.amount, 0),
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to add payment" },
            { status: 500 }
        );
    }
}
