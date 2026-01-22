import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import withRetries from "@/lib/retry";
import { runTransaction } from "../utils";
import { nextSequence } from "@/lib/sequence";



/* ======================================================
   GET: List Invoices
====================================================== */
export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                customer: true,
                location: true,
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
            },
            orderBy: {
                saleDate: "desc",
            },
        });

        const mapped = sales.map((sale) => {
            const total = sale.items.reduce((a, i) => a + i.total, 0);
            const paid = sale.payments.reduce((a, p) => a + p.amount, 0);
            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber,
                status: sale.status,
                customer: sale.customer,
                location: sale.location,
                items: sale.items.map((item) => ({
                    ...item,
                    product: {
                        id: item.product.id,
                        name: item.product.name,
                        sku: item.product.sku,
                        price: item.product.price,
                        packSize: item.product.packSize,
                        weightValue: item.product.weightValue,
                        weightUnit: item.product.weightUnit,
                    },
                })),
                saleDate: sale.saleDate,
                total,
                paid,
                balance: total - paid,
            };
        });

        return NextResponse.json(mapped);
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to fetch sales" },
            { status: 500 }
        );
    }
}


/* ======================================================
   POST: Create Invoice with Sequence Number & Retries
====================================================== */

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const {
        customerId,
        locationId,
        salesOrderId,
        items,
        payments = [],
    } = await req.json();

    if (!customerId || !locationId || !salesOrderId || !items?.length) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // 🚫 Ignore zero quantities
    const invoiceItems = items.filter((i: any) => i.quantity > 0);
    if (!invoiceItems.length) {
        return NextResponse.json(
            { error: "Invoice must contain at least one item" },
            { status: 400 }
        );
    }

    const invoiceTotal = invoiceItems.reduce(
        (sum: number, i: any) => sum + i.quantity * i.price,
        0
    );

    const amountPaid = payments.reduce(
        (sum: number, p: any) => sum + Number(p.amount || 0),
        0
    );

    const saleStatus =
        amountPaid === 0
            ? "CONFIRMED"
            : amountPaid < invoiceTotal
                ? "PARTIALLY_PAID"
                : "PAID";

    try {
        const sale = await withRetries(async () =>
            runTransaction(async (tx) => {
                // 1️⃣ Load sales order items
                const soItems = await tx.salesOrderItem.findMany({
                    where: { salesOrderId },
                });

                const soItemMap = new Map(soItems.map(i => [i.productId, i]));

                // 2️⃣ Validate quantities
                for (const item of invoiceItems) {
                    const soItem = soItemMap.get(item.productId);
                    if (!soItem) {
                        throw new Error("Product not found in sales order");
                    }

                    const remaining = soItem.quantity - soItem.quantityInvoiced;
                    if (item.quantity > remaining) {
                        throw new Error(
                            `Cannot invoice more than remaining quantity for ${item.productId}`
                        );
                    }
                }

                // 3️⃣ Generate invoice number
                const invoiceNumber = await nextSequence("INV", true);

                // 4️⃣ Create sale
                const createdSale = await tx.sale.create({
                    data: {
                        invoiceNumber,
                        salesOrderId,
                        customerId,
                        locationId,
                        createdById: user.id,
                        status: saleStatus,
                        items: {
                            create: invoiceItems.map((i: any) => ({
                                productId: i.productId,
                                quantity: i.quantity,
                                price: i.price,
                                total: i.quantity * i.price,
                            })),
                        },
                    },
                });

                // 5️⃣ Update sales order item quantities
                for (const item of invoiceItems) {
                    const soItem = soItemMap.get(item.productId)!;
                    await tx.salesOrderItem.update({
                        where: { id: soItem.id },
                        data: {
                            quantityInvoiced: {
                                increment: item.quantity,
                            },
                        },
                    });
                }

                // 6️⃣ Recalculate order status
                const updatedItems = await tx.salesOrderItem.findMany({
                    where: { salesOrderId },
                });

                const fullyInvoiced = updatedItems.every(
                    i => i.quantityInvoiced >= i.quantity
                );

                await tx.salesOrder.update({
                    where: { id: salesOrderId },
                    data: {
                        status: fullyInvoiced
                            ? "CONFIRMED"
                            : "PARTIALLY_INVOICED",
                    },
                });

                // 7️⃣ Payment
                if (payments.length > 0) {
                    await tx.salePayment.createMany({
                        data: payments.map((p: any) => ({
                            saleId: createdSale.id,
                            amount: p.amount,
                            method: p.method,
                            reference: p.reference ?? null,
                        })),
                    });
                }

                return createdSale;
            })
        );

        return NextResponse.json({
            id: sale.id,
            invoiceNumber: sale.invoiceNumber,
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to create invoice" },
            { status: 500 }
        );
    }
}
