import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// -------------------- PUT /api/adjustments/:id --------------------
export async function PUT(req: Request, { params }: Params) {
    const { id } = params;
    try {
        const { locationId, type, reason, items } = await req.json();

        if (!locationId || !type || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Fetch existing adjustment
            const adjustment = await tx.adjustment.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!adjustment) throw new Error("Adjustment not found");

            const oldMap = new Map(adjustment.items.map((i) => [i.productId, i.quantity]));
            const newMap = new Map(items.map((i: any) => [i.productId, i.quantity]));

            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;

                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);

                let updatedQty = inventory.quantity;

                if (type.toUpperCase() === "REBAG_GAIN" || type.toUpperCase() === "GAIN") {
                    updatedQty += delta;
                } else {
                    if (inventory.quantity < delta) throw new Error(`Insufficient stock for product ${productId}`);
                    updatedQty -= delta;
                }

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: updatedQty },
                });
            }

            // Delete old items and create new ones
            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });

            for (const item of items) {
                await tx.adjustmentItem.create({
                    data: {
                        adjustmentId: id,
                        productId: item.productId,
                        quantity: item.quantity,
                    },
                });
            }

            return tx.adjustment.update({
                where: { id },
                data: { locationId, type, reason },
                include: { items: true },
            });
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error("Update adjustment failed:", error);
        return NextResponse.json({ error: "Failed to update adjustment" }, { status: 500 });
    }
}

// -------------------- DELETE /api/adjustments/:id --------------------
export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;
    try {
        await prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.findUnique({ where: { id }, include: { items: true } });
            if (!adjustment) throw new Error("Adjustment not found");

            // Rollback inventory
            for (const item of adjustment.items) {
                const inventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: adjustment.locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${item.productId}`);

                let updatedQty = inventory.quantity;

                if (adjustment.type.toUpperCase() === "REBAG_GAIN" || adjustment.type.toUpperCase() === "GAIN") {
                    updatedQty -= item.quantity;
                    if (updatedQty < 0) throw new Error(`Cannot rollback inventory for product ${item.productId}`);
                } else {
                    updatedQty += item.quantity;
                }

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: updatedQty },
                });
            }

            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
            await tx.adjustment.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Adjustment deleted" });
    } catch (error) {
        console.error("Delete adjustment failed:", error);
        return NextResponse.json({ error: "Failed to delete adjustment" }, { status: 500 });
    }
}
