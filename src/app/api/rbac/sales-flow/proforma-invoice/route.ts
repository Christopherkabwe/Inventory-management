import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateNumber, runTransaction } from "../utils";

/* ======================================================
   POST: Create Pro-forma Invoice
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

    /* -------- BLOCK CANCELLED ORDERS -------- */
    if (salesOrder.status === "CANCELLED") {
        return NextResponse.json(
            { error: "Cannot create pro-forma for a cancelled sales order" },
            { status: 400 }
        );
    }

    const proforma = await runTransaction(async (tx) => {
        return tx.proformaInvoice.create({
            data: {
                proformaNumber: generateNumber("PF"),
                salesOrderId: salesOrder.id,
                customerId: salesOrder.customerId,
                locationId: salesOrder.locationId,
                createdById: user.id,
                status: "DRAFT",
                items: {
                    create: salesOrder.items.map((i) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price ?? 0,
                        total: (i.price ?? 0) * i.quantity,
                    })),
                },
            },
            include: {
                items: {
                    include: { product: true },
                },
                customer: true,
            },
        });
    });

    return NextResponse.json({ proforma });
}
