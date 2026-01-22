import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateNumber, runTransaction } from "../utils";

/* ======================================================
   GET: List Sales (Invoices)
====================================================== */
export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status && status !== "ALL") {
        whereClause.status = status;
    }

    const sales = await prisma.sale.findMany({
        where: whereClause,
        include: {
            customer: true,
            location: true,
            items: {
                include: {
                    product: true,
                },
            },
            returns: true,
            creditNotes: true,
        },
        orderBy: { saleDate: "desc" },
    });

    const mapped = sales.map((s) => ({
        id: s.id,
        invoiceNumber: s.invoiceNumber,
        status: s.status,
        saleDate: s.saleDate.toISOString(),
        customer: {
            id: s.customer.id,
            name: s.customer.name,
        },
        location: {
            id: s.location.id,
            name: s.location.name,
        },
        items: s.items.map((i) => ({
            id: i.id,
            quantity: i.quantity,
            quantityDelivered: i.quantityDelivered || 0,
            price: i.price,
            total: i.total,
            product: {
                id: i.product.id,
                name: i.product.name,
                sku: i.product.sku,
                packSize: i.product.packSize,
                weightValue: i.product.weightValue,
                weightUnit: i.product.weightUnit,
            },
        })),
        totalItems: s.items.reduce((acc, i) => acc + i.quantity, 0),
        returnedItems: s.returns.reduce((acc, r) => acc + r.quantity, 0),
        creditNotesCount: s.creditNotes.length,
    }));

    return NextResponse.json({ sales: mapped });
}

/* ======================================================
   POST: Create Sale (Invoice)
====================================================== */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { salesOrderId } = await req.json();
    if (!salesOrderId) {
        return NextResponse.json(
            { error: "SalesOrder ID required" },
            { status: 400 }
        );
    }

    const salesOrder = await prisma.salesOrder.findUnique({
        where: { id: salesOrderId },
        include: {
            items: true,
            customer: true,
            location: true,
        },
    });

    if (!salesOrder) {
        return NextResponse.json(
            { error: "SalesOrder not found" },
            { status: 404 }
        );
    }

    /* -------- BLOCK CANCELLED SALES ORDERS -------- */
    if (salesOrder.status === "CANCELLED") {
        return NextResponse.json(
            { error: "Cannot create invoice for a cancelled sales order" },
            { status: 400 }
        );
    }

    /* -------- Optional: Prevent duplicate invoices -------- */
    const existingSale = await prisma.sale.findFirst({
        where: { salesOrderId },
    });

    if (existingSale) {
        return NextResponse.json(
            { error: "Invoice already exists for this sales order" },
            { status: 400 }
        );
    }

    const sale = await runTransaction(async (tx) => {
        /* -------- Create Sale (Invoice) -------- */
        const newSale = await tx.sale.create({
            data: {
                invoiceNumber: generateNumber("INV"),
                salesOrderId: salesOrder.id,
                customerId: salesOrder.customerId,
                locationId: salesOrder.locationId,
                createdById: user.id,
                status: "CONFIRMED",
                items: {
                    create: salesOrder.items.map((i) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        quantityDelivered: 0,
                        price: 0,  // set pricing logic later
                        total: 0,
                    })),
                },
            },
            include: { items: true },
        });

        /* -------- Update SalesOrder Status -------- */
        await tx.salesOrder.update({
            where: { id: salesOrder.id },
            data: {
                status: "INVOICED",
            },
        });

        return newSale;
    });

    return NextResponse.json({ sale });
}
