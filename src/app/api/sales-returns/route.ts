import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import withRetries from "@/lib/retry"; // make sure the path is correct

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    console.log("Creating a return");

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { saleId, productId, locationId, quantity, reason } = body;

    if (!saleId || !productId || !locationId || quantity <= 0) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    try {
        const saleReturn = await withRetries(async () => {
            return prisma.$transaction(async (tx) => {
                // 1️⃣ Load sale + items
                const sale = await tx.sale.findUnique({
                    where: { id: saleId },
                    include: { items: true, location: true },
                });

                if (!sale || sale.status === "CANCELLED") {
                    throw new Error("Invalid sale");
                }

                if (sale.locationId !== locationId) {
                    throw new Error("Invalid location for sale");
                }

                const item = sale.items.find(i => i.productId === productId);
                if (!item) {
                    throw new Error("Product not found on sale");
                }

                const remainingReturnable = item.quantityDelivered - item.quantityReturned;
                if (quantity > remainingReturnable) {
                    throw new Error("Return quantity exceeds delivered quantity");
                }

                // 2️⃣ Generate return number
                const returnNumber = await nextSequence("SR");

                // 3️⃣ Create SaleReturn
                const saleReturn = await tx.saleReturn.create({
                    data: {
                        returnNumber,
                        saleId,
                        productId,
                        quantity,
                        reason,
                        locationId: sale.locationId,
                        createdById: user.id,
                    },
                });

                await incrementSequence("SR");

                // 4️⃣ Update sale item
                await tx.saleItem.update({
                    where: { id: item.id },
                    data: { quantityReturned: { increment: quantity } },
                });

                // 5️⃣ Update inventory
                await tx.inventory.upsert({
                    where: {
                        productId_locationId: {
                            productId,
                            locationId: sale.locationId,
                        },
                    },
                    update: { quantity: { increment: quantity } },
                    create: {
                        productId,
                        locationId: sale.locationId,
                        quantity,
                        lowStockAt: 10,
                        createdById: user.id,
                    },
                });

                // 6️⃣ Inventory audit
                await tx.inventoryHistory.create({
                    data: {
                        productId,
                        locationId: sale.locationId,
                        date: new Date(),
                        delta: quantity,
                        sourceType: "RETURN",
                        reference: `SR-${returnNumber}`,
                        createdById: user.id,
                        saleReturnId: saleReturn.id,
                    },
                });

                return saleReturn;
            });
        }, 3, 500); // retry 3 times, 500ms delay

        return NextResponse.json(saleReturn);
    } catch (err: any) {
        console.error("Failed to create sale return:", err);
        return NextResponse.json(
            { error: err.message ?? "Failed to create sale return" },
            { status: 500 }
        );
    }
}
