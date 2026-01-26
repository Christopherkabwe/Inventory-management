import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import withRetries from "@/lib/retry";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { saleId, productId, locationId, quantity, reason } = await req.json();

    if (!saleId || !productId || !locationId || quantity <= 0) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    // Generate sequences outside transaction
    const returnNumber = await nextSequence("SR");
    const creditNoteNumber = await nextSequence("CN");

    try {
        const result = await withRetries(async () => {
            return prisma.$transaction(async (tx) => {
                // Fetch sale and items
                const sale = await tx.sale.findUnique({
                    where: { id: saleId },
                    include: { items: true },
                });

                if (!sale || sale.status === "CANCELLED") {
                    throw new Error("Invalid sale");
                }

                if (sale.locationId !== locationId) {
                    throw new Error("Invalid location");
                }

                const item = sale.items.find(i => i.productId === productId);
                if (!item) throw new Error("Product not in sale");

                const remaining = item.quantityDelivered - item.quantityReturned;
                if (quantity > remaining) {
                    throw new Error("Return exceeds delivered quantity");
                }

                // 1️⃣ Create Sale Return
                const saleReturn = await tx.saleReturn.create({
                    data: {
                        returnNumber,
                        saleId,
                        productId,
                        quantity,
                        reason,
                        locationId,
                        createdById: user.id,
                    },
                });

                // 1️⃣a Create SaleReturnItem
                const saleReturnItem = await tx.saleReturnItem.create({
                    data: {
                        saleReturnId: saleReturn.id,
                        productId,
                        quantity,
                        reason,
                    },
                });

                // 2️⃣ Update sale item quantities
                await tx.saleItem.update({
                    where: { id: item.id },
                    data: {
                        quantityReturned: { increment: quantity },
                    },
                });

                // 3️⃣ Update inventory
                await tx.inventory.upsert({
                    where: {
                        productId_locationId: { productId, locationId },
                    },
                    update: {
                        quantity: { increment: quantity },
                    },
                    create: {
                        productId,
                        locationId,
                        quantity,
                        lowStockAt: 10,
                        createdById: user.id,
                    },
                });

                // 4️⃣ Inventory history (RETURN)
                await tx.inventoryHistory.create({
                    data: {
                        productId,
                        locationId,
                        date: new Date(),
                        delta: quantity,
                        sourceType: "RETURN",
                        reference: `SR-${returnNumber}`,
                        saleReturnId: saleReturn.id,
                        createdById: user.id,
                    },
                });

                // 5️⃣ Create Credit Note
                const creditNote = await tx.creditNote.create({
                    data: {
                        creditNoteNumber,
                        saleId,
                        saleReturnId: saleReturn.id,
                        reason,
                        amount: item.price * quantity,
                        createdById: user.id,
                    },
                });

                return { saleReturn, saleReturnItem, creditNote };
            });
        });

        // Increment sequences after successful transaction
        await incrementSequence("SR");
        await incrementSequence("CN");

        return NextResponse.json(result);
    } catch (err: any) {
        console.error(err);
        return NextResponse.json(
            { error: err.message || "Failed to create sale return" },
            { status: 500 }
        );
    }
}
