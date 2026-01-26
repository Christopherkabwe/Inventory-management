import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);

    const customer = searchParams.get("customer") || undefined;
    const invoiceNumber = searchParams.get("invoiceNumber") || undefined;
    const startDate = searchParams.get("startDate") || undefined;
    const endDate = searchParams.get("endDate") || undefined;

    try {
        const creditNotes = await prisma.creditNote.findMany({
            include: {
                sale: {
                    include: {
                        customer: true,
                    },
                },
                saleReturn: true, // ✅ correct relation
            },
            where: {
                sale: {
                    customer: customer
                        ? { name: { contains: customer, mode: "insensitive" } }
                        : undefined,
                    invoiceNumber: invoiceNumber
                        ? { contains: invoiceNumber, mode: "insensitive" }
                        : undefined,
                },
                createdAt:
                    startDate || endDate
                        ? {
                            gte: startDate ? new Date(startDate) : undefined,
                            lte: endDate ? new Date(endDate) : undefined,
                        }
                        : undefined,
            },
            orderBy: { createdAt: "desc" },
        });

        const mapped = creditNotes.map((cn) => ({
            id: cn.id,
            creditNoteNumber: cn.creditNoteNumber,
            saleId: cn.saleId,
            saleInvoiceNumber: cn.sale.invoiceNumber,
            customerName: cn.sale.customer.name,
            amount: cn.amount,
            reason: cn.reason,
            createdAt: cn.createdAt,

            // ✅ guaranteed 1:1
            saleReturnId: cn.saleReturn?.id ?? null,
            saleReturnNumber: cn.saleReturn?.returnNumber ?? null,
        }));

        return NextResponse.json(mapped);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch credit notes" },
            { status: 500 }
        );
    }
}
