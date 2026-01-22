import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* ======================================================
   GET: Single Invoice by ID
====================================================== */
export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const sale = await prisma.sale.findFirst({
        where: { id },
        include: {
            customer: true,
            location: true,
            items: {
                include: {
                    product: true,
                },
            },
            payments: true, // for amountPaid
            salesOrder: true, // for salesOrderNumber
            deliveryNotes: true, // for deliveryNoteNumber(s)
        },
    });

    if (!sale) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    /* =======================
       CALCULATE AMOUNT PAID
    ======================= */
    const amountPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);

    /* =======================
       MAP TO INVOICE VIEW
    ======================= */
    const invoice = {
        id: sale.id,
        invoiceNumber: sale.invoiceNumber,
        status: sale.status,
        createdAt: sale.saleDate.toISOString(),
        dueDate: sale.dueDate?.toISOString() ?? null,

        customer: {
            name: sale.customer.name,
            email: sale.customer.email,
            phone: sale.customer.phone,
            tpinNumber: sale.customer.tpinNumber,
            address: sale.customer.address,
        },

        location: {
            name: sale.location?.name ?? "",
            address: sale.location?.address ?? "",
        },

        items: sale.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            price: i.price,
            total: i.total,
            product: {
                id: i.product.id,
                name: i.product.name,
                sku: i.product.sku,
                price: i.product.price,
                packSize: i.product.packSize,
                weightValue: i.product.weightValue,
                weightUnit: i.product.weightUnit,
            },
        })),

        amountPaid, // total payments

        // ✅ Add Sales Order Number and Delivery Note Numbers
        salesOrderNumber: sale.salesOrder?.orderNumber ?? null,
        deliveryNoteNumbers: sale.deliveryNotes.map((d) => d.deliveryNoteNo), // array
    };

    return NextResponse.json(invoice);
}
