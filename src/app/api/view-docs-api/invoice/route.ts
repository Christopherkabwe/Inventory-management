import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("id");
        console.log('Id:', id);
        if (!id) {
            return NextResponse.json(
                { error: "ID is required" },
                { status: 400 }
            );
        }

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        let sale = null;

        /**
         * 1️⃣ Try resolving as SALE (invoice) ID
         */
        sale = await prisma.sale.findUnique({
            where: { id },
            include: saleIncludes,
        });

        /**
         * 2️⃣ Try resolving as DELIVERY NOTE ID
         */
        if (!sale) {
            const deliveryNote = await prisma.deliveryNote.findUnique({
                where: { id },
                select: { saleId: true },
            });
            console.log('deliveryNote:', deliveryNote);

            if (deliveryNote) {
                sale = await prisma.sale.findUnique({
                    where: { id: deliveryNote.saleId },
                    include: saleIncludes,
                });
            }
        }

        /**
         * 3️⃣ Try resolving as SALES ORDER ID
         */
        if (!sale) {
            sale = await prisma.sale.findFirst({
                where: { salesOrderId: id },
                include: saleIncludes,
            });
        }

        if (!sale) {
            return NextResponse.json(
                { error: "Invoice not found for provided ID" },
                { status: 404 }
            );
        }

        return NextResponse.json(sale);

    } catch (error) {
        console.error("Resolve invoice error:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

/**
 * Shared include tree (single source of truth)
 */
const saleIncludes = {
    customer: true,
    location: true,
    transporter: true,
    salesOrder: true,
    items: {
        include: {
            product: true,
        },
    },
    deliveryNotes: {
        include: {
            items: {
                include: { product: true },
            },
            transporter: true,
            location: true,
            createdBy: { select: { fullName: true } },
        },
    },
    payments: true,
};
