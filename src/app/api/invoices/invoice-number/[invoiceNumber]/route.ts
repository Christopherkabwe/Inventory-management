import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ invoiceNumber: string }> }) {
    const { invoiceNumber } = await params;
    const user = await getCurrentUser;

    if (!invoiceNumber || !user) {
        return NextResponse.json(
            { error: "Invoice number and user is required" },
            { status: 400 });
    }

    try {
        const sale = await prisma.sale.findUnique({
            where: { invoiceNumber },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                creditNotes: true,
                returns: true,
                customer: true,
                location: true,
            },
        });

        if (!sale) {
            return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
        }

        // Map sale items to include already returned quantity
        const saleWithReturns = {
            ...sale,
            items: sale.items.map((item) => {
                const returnedQty = sale.returns
                    .filter((r) => r.productId === item.productId)
                    .reduce((sum, r) => sum + r.quantity, 0);
                return {
                    id: item.id,
                    productId: item.productId,
                    productName: item.product.name,
                    quantityDelivered: item.quantityDelivered,
                    quantityReturned: returnedQty,
                    price: item.price,
                };
            }),
        };

        return NextResponse.json(saleWithReturns);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
