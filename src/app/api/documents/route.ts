// /app/api/documents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    // 1️⃣ Sales Orders
    const orders = await prisma.salesOrder.findMany({
        include: { customer: true, location: true },
    });

    // 2️⃣ Pro-forma Invoices
    const proformas = await prisma.proformaInvoice.findMany({
        include: { customer: true, location: true },
    });

    // 3️⃣ Quotations
    const quotations = await prisma.quotation.findMany({
        include: { customer: true, location: true },
    });

    // 4️⃣ Invoices (Sales)
    const invoices = await prisma.sale.findMany({
        include: { customer: true, location: true },
    });

    // 5️⃣ Delivery Notes
    const deliveries = await prisma.deliveryNote.findMany({
        include: { customer: true, location: true },
    });

    // 6️⃣ Returns
    const returns = await prisma.saleReturn.findMany({
        include: { customer: true, location: true },
    });

    // 7️⃣ Credit Notes
    const creditNotes = await prisma.creditNote.findMany({
        include: { sale: { include: { customer: true, location: true } } },
    });

    // Normalize into a single structure
    const documents = [
        ...orders.map(d => ({
            id: d.id,
            documentNumber: d.orderNumber,
            documentType: "Order",
            date: d.createdAt,
            customerName: d.customer.name,
            locationName: d.location.name,
            status: d.status,
        })),
        ...proformas.map(d => ({
            id: d.id,
            documentNumber: d.proformaNumber,
            documentType: "ProformaInvoice",
            date: d.createdAt,
            customerName: d.customer.name,
            locationName: d.location.name,
            status: d.status,
        })),
        ...quotations.map(d => ({
            id: d.id,
            documentNumber: d.quoteNumber,
            documentType: "Quotation",
            date: d.createdAt,
            customerName: d.customer.name,
            locationName: d.location.name,
            status: d.status,
        })),
        ...invoices.map(d => ({
            id: d.id,
            documentNumber: d.invoiceNumber,
            documentType: "Invoice",
            date: d.createdAt,
            customerName: d.customer.name,
            locationName: d.location.name,
            status: d.status,
        })),
        ...deliveries.map(d => ({
            id: d.id,
            documentNumber: d.deliveryNoteNo,
            documentType: "DeliveryNote",
            date: d.dispatchedAt,
            customerName: d.sale.customer.name,
            locationName: d.location.name,
            status: "DISPATCHED",
        })),
        ...returns.map(d => ({
            id: d.id,
            documentNumber: d.returnNumber,
            documentType: "Return",
            date: d.createdAt,
            customerName: d.sale.customer.name,
            locationName: d.location.name,
            status: "RETURNED",
        })),
        ...creditNotes.map(d => ({
            id: d.id,
            documentNumber: d.creditNoteNumber,
            documentType: "CreditNote",
            date: d.createdAt,
            customerName: d.sale.customer.name,
            locationName: d.sale.location.name,
            status: "ISSUED",
        })),
    ];

    // Sort by date descending
    documents.sort((a, b) => b.date.getTime() - a.date.getTime());

    return NextResponse.json({ documents });
}
