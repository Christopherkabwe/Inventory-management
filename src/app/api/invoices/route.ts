import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import withRetries from "@/lib/retry";
import { runTransaction } from "./utils";
import { nextSequence, incrementSequence } from "@/lib/sequence";

/* ======================================================
   GET: List Invoices
====================================================== */
export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                customer: true,
                location: true,
                salesOrder: {
                    select: {
                        id: true,
                        orderNumber: true,
                    },
                },
                items: {
                    include: {
                        product: true,
                    },
                },
                payments: true,
                creditNotes: true,
            },
            orderBy: {
                saleDate: "desc",
            },
        });

        const mapped = sales.map((sale) => {
            const total = sale.items.reduce((a, i) => a + i.total, 0);
            const paid = sale.payments.reduce((a, p) => a + p.amount, 0);
            const creditNotesTotal = sale.creditNotes.reduce((a, c) => a + c.amount, 0); // fixed syntax
            const balance = total - paid - creditNotesTotal; // fixed syntax

            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber,
                orderNumber: sale.salesOrder?.orderNumber ?? null,
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
                creditNotesTotal,
                balance,
                credit: Math.max(0, paid + creditNotesTotal - total), // overpayment / advance
                salesOrderId: sale.salesOrderId,
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
   POST: Create Invoice with Sequence Number, Payments, Lock
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
        transporterId,
        driverName,
    } = await req.json();


    if (!customerId || !locationId || !salesOrderId || !items?.length) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Ignore zero quantity items
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

    // Determine invoice status
    const saleStatus =
        amountPaid === 0
            ? "CONFIRMED"
            : amountPaid < invoiceTotal
                ? "PARTIALLY_PAID"
                : "PAID";

    try {
        const sale = await withRetries(async () => {
            // Load sales order items
            const soItems = await prisma.salesOrderItem.findMany({
                where: { salesOrderId },
            });
            const soItemMap = new Map(soItems.map((i) => [i.productId, i]));

            // Validate quantities
            for (const item of invoiceItems) {
                const soItem = soItemMap.get(item.productId);
                if (!soItem) {
                    throw new Error(`Product ${item.productId} not found in sales order`);
                }
                const remaining = soItem.quantity - soItem.quantityInvoiced;
                if (item.quantity > remaining) {
                    throw new Error(`Cannot invoice more than remaining quantity for product ${item.productId}`);
                }
            }

            // Create Invoice (Sale)
            const invoiceNumber = await nextSequence("INV");
            const createdSale = await prisma.sale.create({
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
                            quantityDelivered: i.quantity,
                        })),
                    },
                },
            });

            // Update Sales Order Items
            await Promise.all(
                invoiceItems.map((item) => {
                    const soItem = soItemMap.get(item.productId)!;
                    return prisma.salesOrderItem.update({
                        where: { id: soItem.id },
                        data: { quantityInvoiced: { increment: item.quantity } },
                    });
                })
            );

            // Update Sales Order Status
            const updatedItems = await prisma.salesOrderItem.findMany({
                where: { salesOrderId },
            });
            const fullyInvoiced = updatedItems.every((i) => i.quantityInvoiced >= i.quantity);
            await prisma.salesOrder.update({
                where: { id: salesOrderId },
                data: { status: fullyInvoiced ? "CONFIRMED" : "PARTIALLY_INVOICED" },
            });

            // Record Payments
            if (payments.length > 0) {
                await prisma.salePayment.createMany({
                    data: payments.map((p: any) => ({
                        saleId: createdSale.id,
                        amount: p.amount,
                        method: p.method,
                        reference: p.reference ?? null,
                    })),
                });
            }

            // Lock Invoice if Paid
            if (amountPaid >= invoiceTotal) {
                await prisma.sale.update({
                    where: { id: createdSale.id },
                    data: { status: "PAID" },
                });
            }

            // CREATE DELIVERY NOTE
            const deliveryNoteNo = await nextSequence("DN");
            const deliveryNote = await prisma.deliveryNote.create({
                data: {
                    deliveryNoteNo,
                    saleId: createdSale.id,
                    salesOrderId,
                    locationId,
                    createdById: user.id,
                    dispatchedAt: new Date(),
                    transporterId: transporterId ?? null,
                },
            });

            await prisma.deliveryNoteItem.createMany({
                data: invoiceItems.map((i: any) => ({
                    deliveryNoteId: deliveryNote.id,
                    productId: i.productId,
                    quantityDelivered: i.quantity,
                })),
            });

            return createdSale;
        }, {
            maxWait: 5000, // 5 seconds
            timeout: 10000, // 10 seconds
        });

        // Generate invoice number (just read current value)
        await incrementSequence("INV");
        await incrementSequence("DN");

        return NextResponse.json({ id: sale.id, invoiceNumber: sale.invoiceNumber, status: sale.status });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json({ error: err.message || "Failed to create invoice" }, { status: 500 });
    }
}