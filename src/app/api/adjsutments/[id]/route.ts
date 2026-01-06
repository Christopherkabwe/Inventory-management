// app/api/adjustments/[id]/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

type Params = { params: { id: string } };

// -------------------- UPDATE ADJUSTMENT --------------------
export async function PUT(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can update
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
            // 1️⃣ Fetch existing adjustment
            const adjustment = await tx.adjustment.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!adjustment) throw new Error("Adjustment not found");

            // 2️⃣ Compute delta per product
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

                let data: { increment?: number; decrement?: number } = {};

                switch (type) {
                    case "DAMAGED":
                    case "EXPIRED":
                        if (delta > 0 && inventory.quantity < delta) throw new Error(`Insufficient stock for product ${productId}`);
                        data.decrement = delta > 0 ? delta : 0;
                        data.increment = delta < 0 ? -delta : 0;
                        break;
                    case "MANUAL":
                        data.increment = delta > 0 ? delta : 0;
                        data.decrement = delta < 0 ? -delta : 0;
                        break;
                }

                await tx.inventory.update({ where: { id: inventory.id }, data });
            }

            // 3️⃣ Replace old items
            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
            for (const item of items) {
                await tx.adjustmentItem.create({ data: { adjustmentId: id, productId: item.productId, quantity: item.quantity } });
            }

            // 4️⃣ Update adjustment metadata
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
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can delete
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        await prisma.$transaction(async (tx) => {
            const adjustment = await tx.adjustment.findUnique({ where: { id }, include: { items: true } });
            if (!adjustment) throw new Error("Adjustment not found");

            // Rollback inventory safely
            for (const item of adjustment.items) {
                const inventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: adjustment.locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${item.productId}`);

                let data: { increment?: number; decrement?: number } = {};
                switch (adjustment.type) {
                    case "DAMAGED":
                    case "EXPIRED":
                        data.increment = item.quantity; // rollback decrement
                        break;
                    case "MANUAL":
                        if (inventory.quantity < item.quantity) throw new Error(`Cannot rollback inventory for product ${item.productId}`);
                        data.decrement = item.quantity; // rollback increment
                        break;
                }

                await tx.inventory.update({ where: { id: inventory.id }, data });
            }

            await tx.adjustmentItem.deleteMany({ where: { adjustmentId: id } });
            await tx.adjustment.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Adjustment deleted" });
    } catch (error) {
        console.error("Delete adjustment failed:", error);
        return NextResponse.json({ error: "Failed to delete adjustment", details: (error as Error).message }, { status: 500 });
    }
}
