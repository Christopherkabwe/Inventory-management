import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";
import { nextSequence } from "@/lib/sequence";

export async function GET() {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const notes = await prisma.deliveryNote.findMany({
            orderBy: { dispatchedAt: "desc" },
            include: {
                sale: {
                    select: {
                        invoiceNumber: true,
                        customer: { select: { name: true } }
                    }
                },
                transporter: true,
            },
        });

        return NextResponse.json(notes);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch delivery notes" }, { status: 500 });
    }
}


export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const { customerId, locationId, salesOrderId, items, payments, transporterId } = body;

    try {
        const result = await prisma.$transaction(async (tx) => {
            // ========================
            // 1️⃣ Generate Invoice Number
            // ========================
            const invoiceNumber = await nextSequence("INV", true);

            // ========================
            // 2️⃣ Create Sale (Invoice)
            // ========================
            const sale = await tx.sale.create({
                data: {
                    invoiceNumber,
                    customerId,
                    locationId,
                    salesOrderId,
                    createdById: user.id,
                    transporterId: transporterId ?? null,
                    items: {
                        create: items.map((i: any) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                            total: i.quantity * i.price,
                        })),
                    },
                    payments: {
                        create: payments.map((p: any) => ({
                            method: p.method,
                            amount: p.amount,
                            reference: p.reference,
                        })),
                    },
                },
                include: { items: true },
            });

            // ========================
            // 3️⃣ Update SalesOrderItem.quantityInvoiced
            // ========================
            for (const item of items) {
                await tx.salesOrderItem.updateMany({
                    where: { salesOrderId, productId: item.productId },
                    data: { quantityInvoiced: { increment: item.quantity } },
                });
            }

            // ========================
            // 4️⃣ Generate Delivery Note Number
            // ========================
            const deliveryNoteNo = await nextSequence("DN", true);

            // ========================
            // 5️⃣ Create Delivery Note
            // ========================
            await tx.deliveryNote.create({
                data: {
                    deliveryNoteNo,
                    saleId: sale.id,
                    salesOrderId,
                    locationId,
                    createdById: user.id,
                    transporterId: transporterId ?? null,
                    items: {
                        create: sale.items.map((i: any) => ({
                            productId: i.productId,
                            quantityDelivered: i.quantity,
                        })),
                    },
                },
            });

            return sale;
        });

        return NextResponse.json(result);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Failed to create invoice" }, { status: 500 });
    }
}
