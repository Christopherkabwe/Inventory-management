// app/api/sales-orders/[id]/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRoleAndLocation } from "@/lib/rbac";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { id: string } }
) {
    const user = await getCurrentUser();

    const order = await prisma.salesOrder.findUnique({
        where: { id: params.id },
        include: {
            customer: true,
            items: { include: { product: true } },
            invoices: true,
            deliveryNotes: true,
        },
    });

    if (!order) {
        return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    // RBAC: USER can only access orders in their location
    if (user.role === UserRole.USER) {
        requireRoleAndLocation(user, [UserRole.USER], order.locationId);
    } else {
        // ADMIN/MANAGER can view any
    }

    return NextResponse.json(order);
}
