import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/**
 * =====================================
 * RECEIVE GRN
 * =====================================
 */
export async function receiveGRN(grnId: string) {
    const user = await getCurrentUser();
    const grn = await prisma.gRN.findUnique({
        where: { id: grnId },
        include: {
            items: true,
        },
    });

    if (!grn) throw new Error("GRN not found");
    if (grn.locked) throw new Error("GRN is locked");
    if (grn.status === "RECEIVED") throw new Error("GRN already received");
    if (grn.status === "CLOSED") throw new Error("GRN already closed");

    if (!grn.locationId) throw new Error("GRN location not set");

    return prisma.$transaction(async (tx) => {

        for (const item of grn.items) {
            const poItem = await tx.purchaseOrderItem.findUnique({
                where: { id: item.poItemId },
                include: { product: true },
            });

            if (!poItem) throw new Error("PO Item missing");

            // =========================
            // OVER RECEIVING VALIDATION
            // =========================
            const totalReceived = await tx.gRNItem.aggregate({
                where: {
                    poItemId: item.poItemId,
                    grnId: { not: grnId }, // exclude current GRN
                },
                _sum: { quantityReceived: true },
            });

            const receivedBefore = totalReceived._sum.quantityReceived || 0;
            const totalAfterReceive = receivedBefore + item.quantityReceived;

            if (totalAfterReceive > poItem.quantity) {
                throw new Error(`Over receiving detected for ${poItem.product.name}`);
            }

            // =========================
            // INVENTORY UPDATE AT GRN LOCATION
            // =========================
            await tx.inventory.upsert({
                where: {
                    productId_locationId: {
                        productId: poItem.productId,
                        locationId: grn.locationId, // <-- use GRN's location
                    },
                },
                create: {
                    productId: poItem.productId,
                    locationId: grn.locationId,
                    quantity: item.quantityReceived,
                    lowStockAt: 0,
                    createdById: user.id,
                },
                update: {
                    quantity: { increment: item.quantityReceived },
                },
            });
        }

        // =========================
        // UPDATE GRN STATUS
        // =========================
        return tx.gRN.update({
            where: { id: grnId },
            data: { status: "RECEIVED" },
        });
    });
}


/**
 * =====================================
 * LOCK GRN
 * =====================================
 */
export async function lockGRN(grnId: string) {

    return prisma.gRN.update({
        where: { id: grnId },
        data: { locked: true }
    });
}


/**
 * =====================================
 * SUPPLIER RETURN (REVERSE GRN)
 * =====================================
 */
export async function returnGRNItem(
    grnItemId: string,
    quantity: number
) {

    if (!grnItemId)
        throw new Error("GRN Item ID required");

    if (!quantity || quantity <= 0)
        throw new Error("Invalid quantity");


    const item = await prisma.gRNItem.findUnique({
        where: { id: grnItemId },
        include: {
            poItem: true,
            grn: true,
        },
    });

    if (!item)
        throw new Error("GRN Item not found");


    // 🔒 LOCK CHECK
    if (item.grn.locked)
        throw new Error("GRN is locked and cannot be modified");


    if (item.grn.status !== "RECEIVED")
        throw new Error("Returns allowed only after GRN is received");


    const remainingQty =
        item.quantityReceived - item.returnedQuantity;

    if (quantity > remainingQty)
        throw new Error(
            `Return exceeds received quantity. Remaining: ${remainingQty}`
        );


    return prisma.$transaction(async (tx) => {

        // =========================
        // INVENTORY VALIDATION
        // =========================

        const inventory = await tx.inventory.findUnique({
            where: {
                productId_locationId: {
                    productId: item.poItem.productId,
                    locationId: item.poItem.locationId,
                },
            },
        });

        if (!inventory)
            throw new Error("Inventory record not found");

        if (inventory.quantity < quantity)
            throw new Error(
                `Not enough stock to return. Available: ${inventory.quantity}`
            );


        // =========================
        // DEDUCT INVENTORY
        // =========================

        await tx.inventory.update({
            where: {
                productId_locationId: {
                    productId: item.poItem.productId,
                    locationId: item.poItem.locationId,
                },
            },
            data: {
                quantity: {
                    decrement: quantity,
                },
            },
        });


        // =========================
        // TRACK RETURNED QTY
        // =========================

        return tx.gRNItem.update({
            where: { id: grnItemId },
            data: {
                returnedQuantity: {
                    increment: quantity,
                },
            },
        });
    });
}
