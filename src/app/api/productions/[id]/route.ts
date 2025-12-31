import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

/* ===========================
   PUT /api/productions/:id
   Adjust inventory by DELTA
=========================== */
export async function PUT(req: Request, { params }: Params) {
    try {
        const { id } = params;
        const body = await req.json();
        const { productId, quantity } = body;

        if (!productId || quantity <= 0) {
            return NextResponse.json(
                { error: "Invalid payload" },
                { status: 400 }
            );
        }

        const result = await prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch existing production
            const existing = await tx.production.findUnique({
                where: { id },
            });

            if (!existing) {
                throw new Error("Production not found");
            }

            // 2️⃣ Calculate delta
            const delta = quantity - existing.quantity;

            // 3️⃣ Find inventory for this product
            const inventory = await tx.inventory.findFirst({
                where: { productId: existing.productId },
                orderBy: { createdAt: "desc" },
            });

            if (!inventory) {
                throw new Error("Inventory record not found");
            }

            // 4️⃣ Prevent negative stock
            if (inventory.quantity + delta < 0) {
                throw new Error("Insufficient inventory for update");
            }

            // 5️⃣ Update inventory
            await tx.inventory.update({
                where: { id: inventory.id },
                data: {
                    quantity: {
                        increment: delta,
                    },
                },
            });

            // 6️⃣ Update production
            const production = await tx.production.update({
                where: { id },
                data: {
                    productId,
                    quantity,
                },
                include: {
                    product: true,
                },
            });

            return production;
        });

        return NextResponse.json({ production: result });
    } catch (error) {
        console.error("Update production failed:", error);
        return NextResponse.json(
            { error: "Failed to update production" },
            { status: 500 }
        );
    }
}

/* ===========================
   DELETE /api/productions/:id
   Rollback inventory
=========================== */
export async function DELETE(_: Request, { params }: Params) {
    try {
        const { id } = params;

        await prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch production
            const production = await tx.production.findUnique({
                where: { id },
            });

            if (!production) {
                throw new Error("Production not found");
            }

            // 2️⃣ Find inventory
            const inventory = await tx.inventory.findFirst({
                where: { productId: production.productId },
                orderBy: { createdAt: "desc" },
            });

            if (!inventory) {
                throw new Error("Inventory record not found");
            }

            // 3️⃣ Prevent negative inventory
            if (inventory.quantity < production.quantity) {
                throw new Error("Insufficient inventory to rollback");
            }

            // 4️⃣ Rollback inventory
            await tx.inventory.update({
                where: { id: inventory.id },
                data: {
                    quantity: {
                        decrement: production.quantity,
                    },
                },
            });

            // 5️⃣ Delete production
            await tx.production.delete({
                where: { id },
            });
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Delete production failed:", error);
        return NextResponse.json(
            { error: "Failed to delete production" },
            { status: 500 }
        );
    }
}
