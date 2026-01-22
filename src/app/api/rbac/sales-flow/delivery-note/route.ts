import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

/* -------------------- Utilities -------------------- */
export const generateNumber = (prefix: string) => `${prefix}-${Date.now()}`;

export async function runTransaction<T>(
    actions: (tx: typeof prisma) => Promise<T>
) {
    return prisma.$transaction(actions);
}

/* -------------------- POST: Create Delivery Note -------------------- */
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { saleId, items, transporterId } = body;

    if (!saleId) {
        return NextResponse.json({ error: "Sale ID is required" }, { status: 400 });
    }

    if (!items || !Array.isArray(items) || items.length === 0) {
        return NextResponse.json(
            { error: "At least one delivery item is required" },
            { status: 400 }
        );
    }

    for (const i of items) {
        if (!i.productId) {
            return NextResponse.json(
                { error: "productId is required for each item" },
                { status: 400 }
            );
        }
        if (!i.quantityDelivered || i.quantityDelivered <= 0) {
            return NextResponse.json(
                { error: "quantityDelivered must be greater than 0" },
                { status: 400 }
            );
        }
    }

    try {
        const deliveryNote = await runTransaction(async (tx) => {
            /* -------- Fetch sale with items -------- */
            const sale = await tx.sale.findUnique({
                where: { id: saleId },
                include: { items: true },
            });

            if (!sale) {
                throw new Error("Sale not found");
            }

            /* -------- BLOCK CANCELLED SALES -------- */
            if (sale.status === "CANCELLED") {
                throw new Error("Cannot create delivery for a cancelled sale");
            }

            /* -------- Create Delivery Note (AUDIT) -------- */
            const dn = await tx.deliveryNote.create({
                data: {
                    deliveryNoteNo: generateNumber("DN"),
                    saleId,
                    salesOrderId: sale.salesOrderId,
                    locationId: sale.locationId,
                    transporterId: transporterId || null,
                    createdById: user.id,
                    items: {
                        create: items.map((i: any) => ({
                            productId: i.productId,
                            quantityDelivered: i.quantityDelivered,
                        })),
                    },
                },
                include: { items: true },
            });

            /* -------- Update SALE STATE -------- */
            for (const i of items) {
                const saleItem = sale.items.find(
                    (si) => si.productId === i.productId
                );

                if (!saleItem) {
                    throw new Error("Sale item not found for product");
                }

                const remaining =
                    saleItem.quantity - saleItem.quantityDelivered;

                if (i.quantityDelivered > remaining) {
                    throw new Error(
                        `Over-delivery not allowed for product ${i.productId}`
                    );
                }

                await tx.saleItem.update({
                    where: { id: saleItem.id },
                    data: {
                        quantityDelivered: {
                            increment: i.quantityDelivered,
                        },
                    },
                });
            }

            /* -------- Recalculate sale status -------- */
            const updatedItems = await tx.saleItem.findMany({
                where: { saleId },
            });

            const fullyDelivered = updatedItems.every(
                (i) => i.quantityDelivered >= i.quantity
            );

            await tx.sale.update({
                where: { id: saleId },
                data: {
                    status: fullyDelivered
                        ? "CONFIRMED"
                        : "PARTIALLY_DELIVERED",
                },
            });

            return dn;
        });

        return NextResponse.json({ deliveryNote });
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to create delivery note" },
            { status: 400 }
        );
    }
}
