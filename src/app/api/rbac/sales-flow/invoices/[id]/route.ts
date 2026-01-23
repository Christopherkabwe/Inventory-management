import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* ======================================================
   GET: Single Invoice by ID (with pending qty)
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
            transporter: true,
            items: {
                include: {
                    product: true,
                    // link to original SalesOrderItem
                    sale: {
                        include: { salesOrder: { include: { items: true } } }
                    }
                },
            },
            payments: true,
            salesOrder: {
                include: { items: true }, // get SalesOrderItems
            },
            deliveryNotes: { select: { deliveryNoteNo: true } },
        },
    });

    if (!sale) {
        return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    /* =======================
       CALCULATE AMOUNTS
    ======================= */
    const total = sale.items.reduce((sum, i) => sum + i.total, 0);
    const amountPaid = sale.payments.reduce((sum, p) => sum + p.amount, 0);
    const balance = Math.max(0, total - amountPaid);
    const credit = Math.max(0, amountPaid - total); // overpayment

    /* =======================
       MAP ITEMS WITH PENDING QUANTITY
    ======================= */
    const items = sale.items.map((item) => {
        const soItem = sale.salesOrder.items.find(so => so.productId === item.productId);
        const pendingQty = soItem ? soItem.quantity - soItem.quantityInvoiced : 0;

        return {
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            total: item.total,
            pendingQty,
            product: {
                id: item.product.id,
                name: item.product.name,
                sku: item.product.sku,
                price: item.product.price,
                packSize: item.product.packSize,
                weightValue: item.product.weightValue,
                weightUnit: item.product.weightUnit,
            },
        };
    });

    /* =======================
       MAP TO INVOICE VIEW
    ======================= */
    const invoice = {
        id: sale.id,
        invoiceNumber: sale.invoiceNumber,
        status: sale.status,
        createdAt: sale.saleDate.toISOString(),
        dueDate: sale.dueDate?.toISOString() ?? null,
        total,
        balance,
        credit,
        locked: sale.status === "PAID",

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

        transporter: sale.transporter
            ? {
                name: sale.transporter.name,
                driverName: sale.transporter.driverName,
                vehicleNumber: sale.transporter.vehicleNumber,
            }
            : null,

        items,

        payments: sale.payments.map((p) => ({
            id: p.id,
            amount: p.amount,
            method: p.method,
            reference: p.reference ?? null,
            createdAt: p.createdAt.toISOString(),
        })),

        salesOrderNumber: sale.salesOrder?.orderNumber ?? null,
        deliveryNoteNumbers: sale.deliveryNotes.map((d) => d.deliveryNoteNo),
    };

    return NextResponse.json(invoice);
}
