
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse, NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const salesOrderId = req.nextUrl.searchParams.get("salesOrderId");

        if (!salesOrderId) {
            return NextResponse.json(
                { error: "salesOrderId is required" },
                { status: 400 }
            );
        }

        const invoices = await prisma.sale.findMany({
            where: {
                salesOrderId,
            },
            orderBy: {
                createdAt: "desc",
            },
            include: {
                items: {
                    select: {
                        quantity: true,
                        price: true,
                    },
                },
                payments: {
                    select: {
                        amount: true,
                    },
                },
                creditNotes: {   // ✅ include credit notes
                    select: {
                        amount: true,
                    },
                },
            },
        });

        const result = invoices.map(invoice => {
            const totalAmount = invoice.items.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
            );

            const amountPaid = invoice.payments.reduce(
                (sum, p) => sum + p.amount,
                0
            );

            const creditNotesTotal = invoice.creditNotes.reduce(
                (sum, c) => sum + c.amount,
                0
            ); // ✅ calculate per invoice

            return {
                id: invoice.id,
                invoiceNumber: invoice.invoiceNumber,
                status: invoice.status,
                createdAt: invoice.createdAt,
                totalAmount,
                amountPaid,
                creditNotesTotal,
                balance: totalAmount - amountPaid - creditNotesTotal,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("FETCH INVOICES ERROR:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
