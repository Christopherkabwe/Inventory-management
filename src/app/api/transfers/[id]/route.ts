// app/api/transfers/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Params = { params: { id: string } };

// -------------------- HELPER: ROLE CHECK --------------------
function ensureAdminOrManager(user: { role: string }) {
    if (!["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized: Admin or Manager required");
    }
}

// -------------------- UPDATE TRANSFER --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        ensureAdminOrManager(user); // Only Admin/Manager can update

        const { fromLocationId, toLocationId, transporterId, items } = await req.json();
        if (!fromLocationId || !toLocationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedTransfer = await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true } });
            if (!transfer) throw new Error("Transfer not found");

            const oldMap = new Map(transfer.items.map(i => [i.productId, i.quantity]));
            const newMap = new Map(items.map((i: any) => [i.productId, i.quantity]));
            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;
                if (delta === 0) continue;

                // Adjust source inventory
                const srcInventory = await tx.inventory.findFirst({ where: { productId, locationId: fromLocationId } });
                if (!srcInventory) throw new Error(`Source inventory not found for product ${productId}`);
                if (delta > 0 && srcInventory.quantity < delta) throw new Error(`Insufficient stock for product ${productId}`);

                await tx.inventory.update({
                    where: { id: srcInventory.id },
                    data: { quantity: delta > 0 ? { decrement: delta } : { increment: -delta } },
                });

                // Adjust destination inventory
                const destInventory = await tx.inventory.findFirst({ where: { productId, locationId: toLocationId } });
                if (destInventory) {
                    if (delta > 0) {
                        await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { increment: delta } } });
                    } else if (delta < 0) {
                        if (destInventory.quantity < -delta) throw new Error(`Cannot reduce destination inventory below zero for product ${productId}`);
                        await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { decrement: -delta } } });
                    }
                } else if (delta > 0) {
                    await tx.inventory.create({ data: { productId, locationId: toLocationId, quantity: delta, lowStockAt: 0, createdById: user.id } });
                }
            }

            // Replace old transfer items
            await tx.transferItem.deleteMany({ where: { transferId: id } });
            for (const item of items) {
                await tx.transferItem.create({ data: { transferId: id, productId: item.productId, quantity: item.quantity } });
            }

            return tx.transfer.update({
                where: { id },
                data: { fromLocationId, toLocationId, transporterId },
                include: { items: { include: { product: true } }, fromLocation: true, toLocation: true, transporter: true },
            });
        });

        return NextResponse.json({ success: true, transfer: updatedTransfer });
    } catch (error) {
        console.error("Update transfer failed:", error);
        const status = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500;
        return NextResponse.json({ error: "Failed to update transfer", details: (error as Error).message }, { status });
    }
}

// -------------------- DELETE TRANSFER --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        ensureAdminOrManager(user); // Only Admin/Manager can delete

        await prisma.$transaction(async (tx) => {
            const transfer = await tx.transfer.findUnique({ where: { id }, include: { items: true, receipt: true } });
            if (!transfer) throw new Error("Transfer not found");

            if (transfer.receipt) throw new Error("Cannot delete transfer: it has already been received.");

            for (const item of transfer.items) {
                const srcInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.fromLocationId } });
                if (!srcInventory) throw new Error(`Source inventory not found for product ${item.productId}`);
                await tx.inventory.update({ where: { id: srcInventory.id }, data: { quantity: { increment: item.quantity } } });

                const destInventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: transfer.toLocationId } });
                if (!destInventory || destInventory.quantity < item.quantity) throw new Error(`Cannot rollback destination inventory for product ${item.productId}`);
                await tx.inventory.update({ where: { id: destInventory.id }, data: { quantity: { decrement: item.quantity } } });
            }

            await tx.transferItem.deleteMany({ where: { transferId: id } });
            await tx.transfer.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Transfer deleted" });
    } catch (error) {
        console.error("Delete transfer failed:", error);
        const status = error instanceof Error && error.message.includes("Unauthorized") ? 403 : 500;
        return NextResponse.json({ error: "Failed to delete transfer", details: (error as Error).message }, { status });
    }
}
