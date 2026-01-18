// app/api/sale-returns/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { recordInventoryTransaction } from "@/lib/inventory";

type Params = { params: { id: string } };

/**
 * -------------------- PUT /api/sale-returns/:id --------------------
 * Update sale return (ADMIN only)
 */
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN]);

        const { quantity, reason } = await req.json();
        if (!quantity && !reason) {
            return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        const updatedReturn = await prisma.$transaction(async (tx) => {
            const sr = await tx.saleReturn.findUnique({ where: { id } });
            if (!sr) throw new Error("Sale return not found");

            // If quantity changed, adjust inventory
            if (quantity !== undefined && quantity !== sr.quantity) {
                const delta = quantity - sr.quantity; // positive = increase stock more, negative = reduce stock
                const inventory = await tx.inventory.upsert({
                    where: { productId_locationId: { productId: sr.productId, locationId: sr.saleId } },
                    update: { quantity: { increment: delta } },
                    create: {
                        productId: sr.productId,
                        locationId: sr.saleId,
                        quantity: delta > 0 ? delta : 0,
                        lowStockAt: 10,
                        createdById: user.id,
                    },
                });

                await recordInventoryTransaction({
                    productId: sr.productId,
                    locationId: sr.saleId,
                    delta,
                    source: "RETURN",
                    reference: sr.returnNumber,
                    createdById: user.id,
                    metadata: { oldQuantity: sr.quantity, newQuantity: quantity, reason },
                });
            }

            return tx.saleReturn.update({
                where: { id },
                data: {
                    quantity: quantity ?? undefined,
                    reason: reason ?? undefined,
                },
                include: {
                    sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                    product: { select: { id: true, name: true, sku: true } },
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
            });
        });

        return NextResponse.json({ success: true, saleReturn: updatedReturn });
    } catch (error) {
        console.error("Update sale return failed:", error);
        return NextResponse.json(
            { error: "Failed to update sale return", details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * -------------------- DELETE /api/sale-returns/:id --------------------
 * Delete sale return (ADMIN only)
 */
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN]);

        const deletedReturn = await prisma.$transaction(async (tx) => {
            const sr = await tx.saleReturn.findUnique({ where: { id } });
            if (!sr) throw new Error("Sale return not found");

            // Rollback inventory
            const inventory = await tx.inventory.upsert({
                where: { productId_locationId: { productId: sr.productId, locationId: sr.saleId } },
                update: { quantity: { decrement: sr.quantity } },
                create: {
                    productId: sr.productId,
                    locationId: sr.saleId,
                    quantity: 0,
                    lowStockAt: 10,
                    createdById: user.id,
                },
            });

            await recordInventoryTransaction({
                productId: sr.productId,
                locationId: sr.saleId,
                delta: -sr.quantity,
                source: "RETURN",
                reference: sr.returnNumber,
                createdById: user.id,
                metadata: { reason: sr.reason },
            });

            return tx.saleReturn.delete({
                where: { id },
                include: {
                    sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                    product: { select: { id: true, name: true, sku: true } },
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
            });
        });

        return NextResponse.json({ success: true, saleReturn: deletedReturn });
    } catch (error) {
        console.error("Delete sale return failed:", error);
        return NextResponse.json(
            { error: "Failed to delete sale return", details: (error as Error).message },
            { status: 500 }
        );
    }
}
