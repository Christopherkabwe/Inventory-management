import { NextResponse } from "next/server";
import { prisma, $Enums } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordInventoryTransaction } from "@/lib/inventory";

type Params = { params: { id: string } };

// -------------------- UPDATE ADJUSTMENT --------------------
export async function PUT(req: Request, { params }: Params) {
    const { id } = params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { locationId, type, reason, items }: {
            locationId: string;
            type: "DAMAGED" | "EXPIRED" | "MANUAL";
            reason?: string;
            items: { productId: string; quantity: number }[];
        } = await req.json();

        if (!locationId || !type || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedAdjustment = await prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.findUnique({ where: { id }, include: { items: true } });
            if (!adjustment) throw new Error("Adjustment not found");

            // Compute delta per product
            const oldMap = new Map(adjustment.items.map(i => [i.productId, i.quantity]));
            const newMap = new Map(items.map(i => [i.productId, i.quantity]));
            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;
                if (delta === 0) continue;

                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);

                // Only MANUAL adjustments affect stock
                if (type === "MANUAL") {
                    const data: { increment?: number; decrement?: number } = {};
                    data.increment = delta > 0 ? delta : 0;
                    data.decrement = delta < 0 ? -delta : 0;

                    await tx.inventory.update({ where: { id: inventory.id }, data });

                    await recordInventoryTransaction({
                        tx,
                        productId,
                        locationId,
                        delta,
                        source: "ADJUSTMENT",
                        reference: `ADJ-${id}`,
                        createdById: user.id,
                        metadata: { type, oldQuantity: oldQty, newQuantity: newQty },
                    });
                } else {
                    // DAMAGED / EXPIRED do NOT affect stock yet; just record the adjustment
                    await recordInventoryTransaction({
                        tx,
                        productId,
                        locationId,
                        delta: 0,
                        source: "ADJUSTMENT",
                        reference: `ADJ-${id}`,
                        createdById: user.id,
                        metadata: { type, oldQuantity: oldQty, newQuantity: newQty },
                    });
                }
            }

            // Replace old items
            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
            for (const item of items) {
                await tx.adjustmentItem.create({ data: { adjustmentId: id, productId: item.productId, quantity: item.quantity } });
            }

            return tx.adjustment.update({
                where: { id },
                data: { locationId, type, reason, updatedAt: new Date() },
                include: { items: true },
            });
        });

        return NextResponse.json({ success: true, adjustment: updatedAdjustment });
    } catch (error) {
        console.error("Update adjustment failed:", error);
        return NextResponse.json({ error: "Failed to update adjustment", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE ADJUSTMENT --------------------
export async function DELETE(req: Request, { params }: Params) {
    const { id } = params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.findUnique({ where: { id }, include: { items: true } });
            if (!adjustment) throw new Error("Adjustment not found");

            // Rollback MANUAL adjustments only; DAMAGED/EXPIRED do not change stock
            for (const item of adjustment.items) {
                if (adjustment.type === "MANUAL") {
                    const inventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: adjustment.locationId } });
                    if (!inventory) throw new Error(`Inventory not found for product ${item.productId}`);

                    if (inventory.quantity < item.quantity) throw new Error(`Cannot rollback inventory for product ${item.productId}`);

                    await tx.inventory.update({
                        where: { id: inventory.id },
                        data: { quantity: { decrement: item.quantity } },
                    });

                    await recordInventoryTransaction({
                        tx,
                        productId: item.productId,
                        locationId: adjustment.locationId,
                        delta: -item.quantity,
                        source: "ADJUSTMENT",
                        reference: `ADJ-${id}`,
                        createdById: user.id,
                        metadata: { type: adjustment.type, action: "ROLLBACK", quantity: item.quantity },
                    });
                }
            }

            // Remove adjustment records
            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
            await tx.adjustment.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Adjustment deleted" });
    } catch (error) {
        console.error("Delete adjustment failed:", error);
        return NextResponse.json({ error: "Failed to delete adjustment", details: (error as Error).message }, { status: 500 });
    }
}
