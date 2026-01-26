import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { error: "Credit note ID is required" },
            { status: 400 }
        );
    }

    try {
        // Fetch credit note with sale return items
        const creditNote = await prisma.creditNote.findUnique({
            where: { id },
            include: {
                sale: {
                    include: {
                        customer: true,
                        location: true,
                    },
                },
                saleReturn: {
                    include: {
                        items: {
                            include: { product: true },
                        },
                    },
                },
                createdBy: { select: { fullName: true } },
            },
        });

        if (!creditNote) {
            return NextResponse.json(
                { error: "Credit note not found" },
                { status: 404 }
            );
        }

        const sr = creditNote.saleReturn;

        // Always return an array for items, even if empty
        const saleReturnItems = sr?.items?.map((item) => ({
            id: item.id,
            quantity: item.quantity,
            reason: item.reason,
            product: {
                id: item.product.id,
                name: item.product.name,
                sku: item.product.sku,
                packSize: item.product.packSize,
                price: item.product.price,
                weightValue: item.product.weightValue,
                weightUnit: item.product.weightUnit,
            },
        })) || [];

        const saleReturnData = sr
            ? {
                id: sr.id,
                returnNumber: sr.returnNumber,
                items: saleReturnItems,
            }
            : { items: [] }; // ensures frontend always has items array

        return NextResponse.json({
            id: creditNote.id,
            creditNoteNumber: creditNote.creditNoteNumber,
            createdAt: creditNote.createdAt,
            amount: creditNote.amount,
            reason: creditNote.reason,

            saleInvoiceNumber: creditNote.sale.invoiceNumber,
            customer: creditNote.sale.customer,
            location: creditNote.sale.location,

            createdBy: creditNote.createdBy.fullName,

            saleReturn: saleReturnData,
        });
    } catch (err: any) {
        console.error("Failed to fetch credit note:", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to fetch credit note" },
            { status: 500 }
        );
    }
}
