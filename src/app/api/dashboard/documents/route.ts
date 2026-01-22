// /app/api/dashboard/documents/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const [orders, invoices, deliveryNotes, proformas, returnsDocs, creditNotes] = await Promise.all([
            // SALES ORDERS
            prisma.salesOrder.findMany({
                include: {
                    customer: true,
                    createdBy: true,
                    location: true,
                },
            }),

            // INVOICES
            prisma.sale.findMany({
                include: {
                    customer: true,
                    createdBy: true,
                    location: true,
                },
            }),

            // DELIVERY NOTES
            prisma.deliveryNote.findMany({
                include: {
                    sale: {
                        include: {
                            customer: true,
                            createdBy: true,
                            location: true,
                        },
                    },
                },
            }),

            // PROFORMA INVOICES
            prisma.proformaInvoice.findMany({
                include: {
                    customer: true,
                    createdBy: true,
                    location: true,
                },
            }),

            // SALE RETURNS
            prisma.saleReturn.findMany({
                include: {
                    sale: {
                        include: {
                            customer: true,
                            createdBy: true,
                            location: true,
                        },
                    },
                },
            }),

            // CREDIT NOTES
            prisma.creditNote.findMany({
                include: {
                    sale: {
                        include: {
                            customer: true,
                            createdBy: true,
                            location: true,
                        },
                    },
                },
            }),
        ]);

        // Normalize all documents into a consistent structure
        const documents = [
            ...orders.map(o => ({
                id: o.id,
                documentType: "ORDER",
                documentNumber: o.orderNumber,
                customer: o.customer || null,
                location: o.location || null,
                status: o.status,
                createdAt: o.createdAt,
                createdBy: o.createdBy || null,
            })),

            ...invoices.map(i => ({
                id: i.id,
                documentType: "INVOICE",
                documentNumber: i.invoiceNumber,
                customer: i.customer || null,
                location: i.location || null,
                status: i.status,
                createdAt: i.createdAt,
                createdBy: i.createdBy || null,
            })),

            ...deliveryNotes.map(d => ({
                id: d.id,
                documentType: "DELIVERYNOTE",
                documentNumber: d.deliveryNoteNo,
                customer: d.sale?.customer || null,
                location: d.sale?.location || null,
                status: "DISPATCHED",
                createdAt: d.createdAt,
                createdBy: d.sale?.createdBy || null,
            })),

            ...proformas.map(p => ({
                id: p.id,
                documentType: "PROFORMA",
                documentNumber: p.proformaNumber,
                customer: p.customer || null,
                location: p.location || null,
                status: p.status,
                createdAt: p.createdAt,
                createdBy: p.createdBy || null,
            })),

            ...returnsDocs.map(r => ({
                id: r.id,
                documentType: "RETURN",
                documentNumber: r.returnNumber,
                customer: r.sale?.customer || null,
                location: r.sale?.location || null,
                status: "RETURNED",
                createdAt: r.createdAt,
                createdBy: r.sale?.createdBy || null,
            })),

            ...creditNotes.map(c => ({
                id: c.id,
                documentType: "CREDITNOTE",
                documentNumber: c.creditNoteNumber,
                customer: c.sale?.customer || null,
                location: c.sale?.location || null,
                status: "CREDITED",
                createdAt: c.createdAt,
                createdBy: c.sale?.createdBy || null,
            })),
        ];

        return NextResponse.json({ documents });
    } catch (error) {
        console.error("Dashboard documents fetch error:", error);
        return NextResponse.json(
            { error: "Failed to fetch documents" },
            { status: 500 }
        );
    }
}
