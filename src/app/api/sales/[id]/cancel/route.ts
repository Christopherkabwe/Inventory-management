// app/api/sales/[id]/cancel/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user.role, [UserRole.ADMIN, UserRole.MANAGER]);

        const sale = await prisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
        if (sale.isLocked) return NextResponse.json({ error: "Cannot cancel locked/invoiced sale" }, { status: 400 });

        await prisma.$transaction(async (tx) => {
            // Restore inventory for all items
            for (const item of sale.items) {
                const inventory = await tx.inventory.findFirst({
                    where: { productId: item.productId, locationId: sale.locationId },
                });
                if (inventory) {
                    await tx.inventory.update({
                        where: { id: inventory.id },
                        data: { quantity: { increment: item.quantity - item.quantityInvoiced } },
                    });
                }
            }

            // Reset sale items quantities
            await tx.saleItem.updateMany({
                where: { saleId: id },
                data: {
                    quantityInvoiced: 0,
                    quantityDelivered: 0,
                    quantityReturned: 0,
                },
            });

            // Update sale status
            await tx.sale.update({
                where: { id },
                data: { status: "CANCELLED", isLocked: false },
            });
        });

        return NextResponse.json({ success: true, message: "Sale cancelled" });
    } catch (error) {
        console.error("Cancel sale failed:", error);
        return NextResponse.json(
            { error: "Failed to cancel sale", details: (error as Error).message },
            { status: 500 }
        );
    }
}
