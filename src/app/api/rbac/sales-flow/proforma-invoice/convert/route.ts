import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateNumber, runTransaction } from "../../utils";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { proformaId } = await req.json();
    if (!proformaId) {
        return NextResponse.json(
            { error: "Pro-forma ID required" },
            { status: 400 }
        );
    }

    const proforma = await prisma.proformaInvoice.findUnique({
        where: { id: proformaId },
        include: { items: true },
    });

    if (!proforma) {
        return NextResponse.json(
            { error: "Pro-forma not found" },
            { status: 404 }
        );
    }

    if (proforma.status !== "APPROVED") {
        return NextResponse.json(
            { error: "Only approved pro-formas can be invoiced" },
            { status: 400 }
        );
    }

    const existingInvoice = await prisma.sale.findFirst({
        where: { salesOrderId: proforma.salesOrderId },
    });

    if (existingInvoice) {
        return NextResponse.json(
            { error: "Invoice already exists for this sales order" },
            { status: 400 }
        );
    }

    const sale = await runTransaction(async (tx) => {
        const invoice = await tx.sale.create({
            data: {
                invoiceNumber: generateNumber("INV"),
                salesOrderId: proforma.salesOrderId,
                customerId: proforma.customerId,
                locationId: proforma.locationId,
                createdById: user.id,
                status: "CONFIRMED",
                items: {
                    create: proforma.items.map((i) => ({
                        productId: i.productId,
                        quantity: i.quantity,
                        price: i.price,
                        total: i.total,
                    })),
                },
            },
        });

        await tx.proformaInvoice.update({
            where: { id: proforma.id },
            data: { status: "APPROVED" },
        });

        await tx.salesOrder.update({
            where: { id: proforma.salesOrderId },
            data: { status: "INVOICED" },
        });

        return invoice;
    });

    return NextResponse.json({ sale });
}
