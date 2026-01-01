// app/api/sales/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// -------------------- UPDATE SALE --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const { customerId, locationId, transporterId, items } = await req.json();

        if (!customerId || !locationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const updatedSale = await prisma.$transaction(async (tx) => {
            // Fetch existing sale with items
            const sale = await tx.sale.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!sale) throw new Error("Sale not found");

            // Map old vs new quantities for inventory adjustments
            const oldMap = new Map(sale.items.map((i) => [i.productId, i.quantity]));
            const newMap = new Map(items.map((i: any) => [i.productId, i.quantity]));

            const allProductIds = new Set([...oldMap.keys(), ...newMap.keys()]);

            for (const productId of allProductIds) {
                const oldQty = oldMap.get(productId) || 0;
                const newQty = newMap.get(productId) || 0;
                const delta = newQty - oldQty;

                if (delta === 0) continue;

                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${productId}`);
                if (inventory.quantity < -delta) throw new Error(`Insufficient stock for product ${productId}`);

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { increment: -delta } },
                });
            }

            // Replace old sale items
            await tx.saleItem.deleteMany({ where: { saleId: id } });
            for (const item of items) {
                await tx.saleItem.create({
                    data: {
                        saleId: id,
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity,
                    },
                });
            }

            // Update sale main info and include relations
            return tx.sale.update({
                where: { id },
                data: { customerId, locationId, transporterId },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    location: true,
                    transporter: true,
                },
            });
        });

        return NextResponse.json(updatedSale);
    } catch (error) {
        console.error("Update sale failed:", error);
        return NextResponse.json({ error: "Failed to update sale" }, { status: 500 });
    }
}

// -------------------- DELETE SALE --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({ where: { id }, include: { items: true } });
            if (!sale) throw new Error("Sale not found");

            // Rollback inventory
            for (const item of sale.items) {
                const inventory = await tx.inventory.findFirst({ where: { productId: item.productId, locationId: sale.locationId } });
                if (!inventory) throw new Error(`Inventory not found for product ${item.productId}`);

                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { increment: item.quantity } },
                });
            }

            // Delete sale items and sale
            await tx.saleItem.deleteMany({ where: { saleId: id } });
            await tx.sale.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Sale deleted successfully" });
    } catch (error) {
        console.error("Delete sale failed:", error);
        return NextResponse.json({ error: "Failed to delete sale" }, { status: 500 });
    }
}
