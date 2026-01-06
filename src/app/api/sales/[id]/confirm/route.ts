// app/api/sales/[id]/confirm/route.ts
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
        if (sale.isLocked) return NextResponse.json({ error: "Sale already locked/invoiced" }, { status: 400 });

        // Confirm sale: mark all items as fully invoiced
        await prisma.$transaction(async (tx) => {
            for (const item of sale.items) {
                await tx.saleItem.update({
                    where: { id: item.id },
                    data: { quantityInvoiced: item.quantity },
                });
            }

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
