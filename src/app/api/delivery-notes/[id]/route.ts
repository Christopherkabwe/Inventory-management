// app/api/delivery-notes/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole, requireSameLocation } from "@/lib/rbac";

type Params = { params: { id: string } };

/**
 * -------------------- GET /api/delivery-notes/:id --------------------
 */
export async function GET(req: NextRequest, { params }: Params) {
    try {
        const user = await getCurrentUser();
        const { id } = params;

        const deliveryNote = await prisma.deliveryNote.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                salesOrder: { select: { id: true, orderNumber: true } },
                transporter: true,
                createdBy: { select: { id: true, fullName: true } },
            },
        });

        if (!deliveryNote) return NextResponse.json({ error: "Not found" }, { status: 404 });

        // USER restriction by location
        if (user.role === UserRole.USER) {
            requireSameLocation(user, deliveryNote.locationId);
        }

        return NextResponse.json({ success: true, deliveryNote });
    } catch (error) {
        console.error("Fetch delivery note failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch delivery note", details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * -------------------- DELETE /api/delivery-notes/:id --------------------
 * Only ADMIN/ MANAGER can delete a delivery note
 */
export async function DELETE(req: NextRequest, { params }: Params) {
    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        const { id } = params;

        // Ensure the delivery note exists
        const deliveryNote = await prisma.deliveryNote.findUnique({
            where: { id },
        });
        if (!deliveryNote) {
            return NextResponse.json({ error: "Delivery note not found" }, { status: 404 });
        }

        // Optional: prevent deletion if already dispatched
        if (deliveryNote.dispatchedAt) {
            return NextResponse.json({ error: "Cannot delete a dispatched delivery note" }, { status: 400 });
        }

        const deleted = await prisma.deliveryNote.delete({
            where: { id },
            include: {
                items: { include: { product: true } },
                sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                salesOrder: { select: { id: true, orderNumber: true } },
                transporter: true,
                createdBy: { select: { id: true, fullName: true } },
            },
        });

        return NextResponse.json({ success: true, deliveryNote: deleted });
    } catch (error) {
        console.error("Delete delivery note failed:", error);
        return NextResponse.json(
            { error: "Failed to delete delivery note", details: (error as Error).message },
            { status: 500 }
        );
    }
}
