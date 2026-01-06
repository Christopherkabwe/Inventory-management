// app/api/sales-orders/[id]/confirm/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    // Only ADMIN or MANAGER can confirm
    requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

    // Fetch the order
    const order = await prisma.salesOrder.findUnique({
        where: { id: params.id }
    });

    if (!order) {
        return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.status === "CANCELLED") {
        return NextResponse.json({ error: "Cannot confirm a cancelled order" }, { status: 400 });
    }

    if (order.status === "CONFIRMED") {
        return NextResponse.json({ error: "Order is already confirmed" }, { status: 400 });
    }

    // Update order status to CONFIRMED
    const updatedOrder = await prisma.salesOrder.update({
        where: { id: params.id },
        data: { status: "CONFIRMED" } // Or SalesOrderStatus.CONFIRMED if enum imported
    });

    return NextResponse.json(updatedOrder);
}
