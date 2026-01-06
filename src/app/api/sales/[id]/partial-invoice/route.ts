// app/api/sales/[id]/partial-invoice/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

type Params = { params: { id: string } };

// -------------------- PARTIAL INVOICE SALE --------------------
export async function PATCH(req: Request, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user.role, [UserRole.ADMIN, UserRole.MANAGER]);

        const { items } = await req.json();
        if (!items?.length) {
            return NextResponse.json({ error: "No items provided for partial invoicing" }, { status: 400 });
        }

        const updatedSale = await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!sale) throw new Error("Sale not found");
            if (sale.isLocked) throw new Error("Sale already fully invoiced/locked");

            // Update quantityInvoiced per item
            for (const item of items) {
                const saleItem = sale.items.find(si => si.id === item.id);
                if (!saleItem) throw new Error(`Sale item not found: ${item.id}`);

                const newInvoicedQty = saleItem.quantityInvoiced + (item.quantity ?? 0);
                if (newInvoicedQty > saleItem.quantity) {
                    throw new Error(`Cannot invoice more than ordered for item ${saleItem.id}`);
                }

                await tx.saleItem.update({
                    where: { id: saleItem.id },
                    data: { quantityInvoiced: newInvoicedQty },
                });
            }

            // Check if all items fully invoiced
            const fullyInvoiced = sale.items.every(si =>
                (items.find(i => i.id === si.id)?.quantity ?? 0) + si.quantityInvoiced >= si.quantity
            );

            // Update sale status
            const newStatus = fullyInvoiced ? "CONFIRMED" : "PARTIALLY_INVOICED";
            const isLocked = fullyInvoiced;

            const updated = await tx.sale.update({
                where: { id },
                data: { status: newStatus, isLocked },
            });

            return updated;
        });

        return NextResponse.json({ success: true, sale: updatedSale });
    } catch (error) {
        console.error("Partial invoice failed:", error);
        return NextResponse.json(
            { error: "Failed to partial invoice sale", details: (error as Error).message },
            { status: 500 }
        );
    }
}
