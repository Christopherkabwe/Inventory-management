import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { runTransaction } from "../utils";
import { nextSequence } from "@/lib/sequence";


export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const whereClause: any = {};

        // Apply RBAC: MANAGER and USER can see their own orders or orders for their location
        if (user.role === "MANAGER" || user.role === "USER") {
            whereClause.OR = [
                { createdById: user.id },
                { locationId: user.locationId },
            ];
        }

        const salesOrders = await prisma.salesOrder.findMany({
            where: whereClause,
            orderBy: { createdAt: "desc" }, // sort by creation date descending
            include: {
                location: true,
                customer: true,
                createdBy: true,
                items: { include: { product: true } },
                invoices: {
                    include: {
                        location: true,
                        customer: true,
                        transporter: true,
                        createdBy: true,
                        items: { include: { product: true } },
                    },
                },
                deliveryNotes: {
                    include: {
                        transporter: true,
                        createdBy: true,
                        items: { include: { product: true } },
                    },
                },
                proformaInvoices: {
                    include: {
                        location: true,
                        customer: true,
                        items: { include: { product: true } },
                    },
                },
            },
        });

        return NextResponse.json(salesOrders);
    } catch (err) {
        console.error("Failed to fetch sales orders:", err);
        return NextResponse.json({ error: "Failed to fetch sales orders" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user)
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { quotationId } = await req.json();
        if (!quotationId)
            return NextResponse.json({ error: "Quotation ID required" }, { status: 400 });

        const quotation = await prisma.quotation.findUnique({
            where: { id: quotationId },
            include: { items: true },
        });

        if (!quotation)
            return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

        // Run everything inside a transaction
        const salesOrder = await runTransaction(async (tx) => {
            // 1️⃣ Generate sequential order number
            const orderNumber = await nextSequence("SO", true);

            // 2️⃣ Create SalesOrder with items
            const order = await tx.salesOrder.create({
                data: {
                    orderNumber,
                    customerId: quotation.customerId,
                    locationId: quotation.locationId,
                    createdById: user.id,
                    items: {
                        create: quotation.items.map((i) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                        })),
                    },
                },
                include: {
                    items: true,
                },
            });

            // 3️⃣ Mark quotation as APPROVED
            await tx.quotation.update({
                where: { id: quotation.id },
                data: { status: "APPROVED" },
            });
            return order;
        });

        return NextResponse.json(salesOrder);
    } catch (err) {
        console.error("Failed to create sales order:", err);
        return NextResponse.json(
            { error: "Failed to create sales order" },
            { status: 500 }
        );
    }
}
