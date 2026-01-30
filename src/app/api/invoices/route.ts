import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import withRetries from "@/lib/retry";
import { nextSequence, incrementSequence } from "@/lib/sequence";

export async function GET() {
    try {
        const sales = await prisma.sale.findMany({
            include: {
                customer: true,
                location: true,
                salesOrder: {
                    select: { id: true, orderNumber: true }
                },
                items: {
                    include: { product: true }
                },
                allocations: true, // Customer payments
                creditNoteAllocations: true, // Include credit note allocations
                creditNotes: true,
            },
            orderBy: { saleDate: "desc" },
        });

        // 2️⃣ Fetch all customer payments with allocations
        const payments = await prisma.customerPayment.findMany({
            include: { allocations: true },
        });

        // 3️⃣ Compute unallocated per customer
        const unallocatedMap = new Map<string, number>();
        // Initialize unallocated map with 0 for all customers
        sales.forEach(s => {
            if (!unallocatedMap.has(s.customerId)) unallocatedMap.set(s.customerId, 0);
        });

        // Add unallocated payments to map
        payments.forEach(p => {
            const allocatedSum = p.allocations.reduce((sum, a) => sum + Number(a.amount), 0);
            const unallocated = Number(p.amount) - allocatedSum;
            unallocatedMap.set(p.customerId, (unallocatedMap.get(p.customerId) ?? 0) + unallocated);
        });

        // Add unallocated credit notes to map
        sales.forEach(s => {
            const creditNotesTotal = s.creditNotes.reduce((sum, c) => sum + c.amount, 0);
            const creditNoteAllocationsTotal = s.creditNoteAllocations.reduce((sum, c) => sum + c.amount, 0);
            const unallocatedCreditNotes = creditNotesTotal - creditNoteAllocationsTotal;
            unallocatedMap.set(s.customerId, (unallocatedMap.get(s.customerId) ?? 0) + unallocatedCreditNotes);
        });

        const mapped = sales.map((sale) => {
            const total = sale.items.reduce((sum, i) => sum + i.total, 0);
            // ✅ Include both customer payments and credit note allocations
            const paid = sale.allocations.reduce((sum, a) => sum + a.amount, 0) + sale.creditNoteAllocations.reduce((sum, c) => sum + c.amount, 0);
            const creditNotesTotal = sale.creditNotes.reduce((sum, c) => sum + c.amount, 0);
            const balance = total - paid;
            const paymentStatus = balance <= 0 ? "PAID" : paid > 0 ? "PARTIALLY_PAID" : "UNPAID";
            return {
                id: sale.id,
                invoiceNumber: sale.invoiceNumber,
                orderNumber: sale.salesOrder?.orderNumber ?? null,
                status: sale.status,
                paymentStatus,
                customer: sale.customer,
                location: sale.location,
                items: sale.items,
                saleDate: sale.saleDate,
                total,
                paid,
                creditNotesTotal,
                balance,
                credit: Math.max(0, paid - total),
                salesOrderId: sale.salesOrderId,
                unallocated: unallocatedMap.get(sale.customerId),
            };
        });

        return NextResponse.json(mapped);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
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
        transporterId,
        paymentStatus,
    } = await req.json();

    if (!customerId || !locationId || !salesOrderId || !items?.length) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    const invoiceItems = items.filter((i: any) => i.quantity > 0);
    if (!invoiceItems.length) {
        return NextResponse.json(
            { error: "Invoice must contain at least one item" },
            { status: 400 }
        );
    }

    const saleStatusMap = {
        CONFIRMED: "CONFIRMED",
        PARTIAL: "PARTIALLY_PAID",
        PAID: "PAID",
    } as const;

    try {
        const sale = await withRetries(async () => {
            const soItems = await prisma.salesOrderItem.findMany({
                where: { salesOrderId },
            });

            const soItemMap = new Map(soItems.map(i => [i.productId, i]));

            for (const item of invoiceItems) {
                const soItem = soItemMap.get(item.productId);
                if (!soItem) throw new Error("Product not in sales order");

                const remaining = soItem.quantity - soItem.quantityInvoiced;
                if (item.quantity > remaining) {
                    throw new Error("Quantity exceeds remaining order quantity");
                }
            }

            const invoiceNumber = await nextSequence("INV");

            const createdSale = await prisma.sale.create({
                data: {
                    invoiceNumber,
                    salesOrderId,
                    customerId,
                    locationId,
                    createdById: user.id,
                    status: "PENDING",
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

            await Promise.all(
                invoiceItems.map(item => {
                    const soItem = soItemMap.get(item.productId)!;
                    return prisma.salesOrderItem.update({
                        where: { id: soItem.id },
                        data: { quantityInvoiced: { increment: item.quantity } },
                    });
                })
            );

            const updatedItems = await prisma.salesOrderItem.findMany({
                where: { salesOrderId },
            });

            const fullyInvoiced = updatedItems.every(
                i => i.quantityInvoiced >= i.quantity
            );

            await prisma.salesOrder.update({
                where: { id: salesOrderId },
                data: {
                    status: fullyInvoiced
                        ? "CONFIRMED"
                        : "PARTIALLY_INVOICED",
                },
            });

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
        });

        await incrementSequence("INV");
        await incrementSequence("DN");

        return NextResponse.json({
            id: sale.id,
            invoiceNumber: sale.invoiceNumber,
            status: sale.status,
        });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to create invoice" },
            { status: 500 }
        );
    }
}
