// /app/api/documents/[documentId]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, context: any) {
    // Await params if they are a promise
    const params = await context.params;
    const documentId = await params?.documentId;

    if (!documentId) {
        return NextResponse.json(
            { error: "documentId is required" },
            { status: 400 }
        );
    }

    const url = new URL(req.url);
    const documentType = url.searchParams.get("type")?.toUpperCase() || "INVOICE";

    try {
        let document: any = null;

        switch (documentType) {
            case "ORDER":
                document = await prisma.salesOrder.findUnique({
                    where: { id: documentId },
                    include: { customer: true, items: { include: { product: true } } },
                });
                break;

            case "PROFORMA":
                document = await prisma.proformaInvoice.findUnique({
                    where: { id: documentId },
                    include: { customer: true, items: { include: { product: true } } },
                });
                break;

            case "INVOICE":
                document = await prisma.sale.findUnique({
                    where: { id: documentId },
                    include: { customer: true, items: { include: { product: true } } },
                });
                break;

            case "DELIVERYNOTE":
                document = await prisma.deliveryNote.findUnique({
                    where: { id: documentId },
                    include: { sale: { include: { customer: true, items: { include: { product: true } } } } },
                });
                break;

            case "RETURN":
                document = await prisma.saleReturn.findUnique({
                    where: { id: documentId },
                    include: { sale: { include: { customer: true, items: { include: { product: true } } } } },
                });
                break;

            case "CREDITNOTE":
                document = await prisma.creditNote.findUnique({
                    where: { id: documentId },
                    include: { sale: { include: { customer: true, items: { include: { product: true } } } } },
                });
                break;

            default:
                return NextResponse.json(
                    { error: "Invalid documentType" },
                    { status: 400 }
                );
        }

        if (!document) {
            return NextResponse.json({ error: "Document not found" }, { status: 404 });
        }

        const normalized = {
            id: document.id,
            documentType,
            documentNumber:
                documentType === "ORDER" ? document.orderNumber :
                    documentType === "PROFORMA" ? document.proformaNumber :
                        documentType === "INVOICE" ? document.invoiceNumber :
                            documentType === "DELIVERYNOTE" ? document.deliveryNoteNo :
                                documentType === "RETURN" ? document.returnNumber :
                                    documentType === "CREDITNOTE" ? document.creditNoteNumber : "-",
            customer: document.customer || document.sale?.customer || null,
            items: document.items ?? document.sale?.items ?? [],
            status:
                document.status ||
                (documentType === "DELIVERYNOTE" ? "DISPATCHED" :
                    documentType === "RETURN" ? "RETURNED" :
                        documentType === "CREDITNOTE" ? "CREDITED" : "-"),
            createdAt: document.createdAt,
        };

        return NextResponse.json(normalized);
    } catch (error) {
        console.error("Error fetching document:", error);
        return NextResponse.json(
            { error: "Failed to fetch document" },
            { status: 500 }
        );
    }
}
