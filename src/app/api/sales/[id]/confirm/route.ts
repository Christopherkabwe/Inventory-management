// app/api/sales/[id]/confirm/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { NextResponse } from "next/server";
import { recordInventoryTransaction } from "@/lib/inventory";

type Params = { params: { id: string } };

export async function PATCH(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        const sale = await prisma.sale.findUnique({
            where: { id },
            include: { items: true },
        });
        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
        if (sale.isLocked) return NextResponse.json({ error: "Sale already locked/invoiced" }, { status: 400 });

        await prisma.$transaction(async (tx) => {
            // 1️⃣ Update sale items: mark as fully invoiced
            for (const item of sale.items) {
                await tx.saleItem.update({
                    where: { id: item.id },
                    data: { quantityInvoiced: item.quantity },
                });

                // 2️⃣ Record inventory transaction for sold stock
                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId: sale.locationId,
                    delta: -item.quantity, // stock decreases
                    source: "SALE",
                    reference: sale.id,
                    createdById: user.id,
                    metadata: {
                        quantitySold: item.quantity,
                    },
                });
            }

            // 3️⃣ Lock and confirm the sale
            await tx.sale.update({
                where: { id },
                data: { status: "CONFIRMED", isLocked: true },
            });
        });

        return NextResponse.json({ success: true, message: "Sale confirmed and locked" });
    } catch (error) {
        console.error("Confirm sale failed:", error);
        return NextResponse.json(
            { error: "Failed to confirm sale", details: (error as Error).message },
            { status: 500 }
        );
    }
}
