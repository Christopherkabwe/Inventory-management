// app/api/sales-orders/[id]/cancel/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    // Only ADMIN/MANAGER can cancel orders
    requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

    // Prevent cancelling if order has any invoices
    const invoicesCount = await prisma.sale.count({
        where: { salesOrderId: params.id },
    });

    if (invoicesCount > 0) {
        return NextResponse.json(
            { error: "Cannot cancel order with invoices" },
            { status: 400 }
        );
    }

    // Update order status to CANCELLED
    const cancelledOrder = await prisma.salesOrder.update({
        where: { id: params.id },
        data: { status: "CANCELLED" }, // or SalesOrderStatus.CANCELLED if enum imported
    });

    return NextResponse.json(cancelledOrder);
}
