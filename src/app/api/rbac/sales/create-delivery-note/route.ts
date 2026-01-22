import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { saleId, items, transporterId } = await req.json();
    if (!saleId || !items?.length) {
        return NextResponse.json({ error: "SaleId and items are required" }, { status: 400 });
    }

    const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { salesOrder: true, location: true },
    });
    if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });

    // Transactional creation of DeliveryNote
    const deliveryNote = await prisma.$transaction(async (tx) => {
        const dn = await tx.deliveryNote.create({
            data: {
                deliveryNoteNo: `DN-${Date.now()}`,
                saleId: sale.id,
                salesOrderId: sale.salesOrderId,
                locationId: sale.locationId,
                transporterId: transporterId || undefined,
                createdById: user.id,
                items: {
                    create: items.map((item) => ({
                        productId: item.productId,
                        quantityDelivered: item.quantityDelivered,
                    })),
                },
            },
            include: { items: true },
        });

        return dn;
    });

    return NextResponse.json({ deliveryNote });
}
