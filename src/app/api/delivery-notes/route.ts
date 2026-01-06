// app/api/delivery-notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";

/**
 * -------------------- POST /api/delivery-notes --------------------
 * Create a new delivery note
 * ✅ Only ADMIN can create
 * ✅ Sale must have an invoice number
 */
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN can create
        requireRole(user, [UserRole.ADMIN]);

        const { saleId, locationId, transporterId, items } = await req.json();

        if (!saleId || !locationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // Verify sale exists and has invoice
        const sale = await prisma.sale.findUnique({ where: { id: saleId } });
        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });
        if (!sale.invoiceNumber) {
            return NextResponse.json(
                { error: "Cannot create delivery note: Sale does not have an invoice" },
                { status: 400 }
            );
        }

        // Create delivery note
        const deliveryNote = await prisma.deliveryNote.create({
            data: {
                saleId,
                locationId,
                transporterId,
                createdById: user.id,
                items: {
                    create: items.map((i: any) => ({
                        productId: i.productId,
                        quantityDelivered: i.quantityDelivered,
                    })),
                },
            },
            include: {
                items: { include: { product: true } },
                sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                transporter: true,
                createdBy: { select: { id: true, fullName: true } },
            },
        });

        return NextResponse.json({ success: true, deliveryNote });
    } catch (error) {
        console.error("Create delivery note failed:", error);
        return NextResponse.json(
            { error: "Failed to create delivery note", details: (error as Error).message },
            { status: 500 }
        );
    }
}

/**
 * -------------------- GET /api/delivery-notes --------------------
 * List all delivery notes (filter by location or sale if needed)
 */
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();

        const url = new URL(req.url);
        const saleId = url.searchParams.get("saleId");
        const salesOrderId = url.searchParams.get("salesOrderId");
        const page = Number(url.searchParams.get("page") ?? 1);
        const limit = Number(url.searchParams.get("limit") ?? 20);

        const where: any = {};
        if (saleId) where.saleId = saleId;
        if (salesOrderId) where.salesOrderId = salesOrderId;

        // USER only sees their location
        if (user.role === UserRole.USER) {
            where.locationId = user.locationId;
        }

        const deliveryNotes = await prisma.deliveryNote.findMany({
            where,
            include: {
                items: { include: { product: true } },
                sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                salesOrder: { select: { id: true, orderNumber: true } },
                transporter: true,
                createdBy: { select: { id: true, fullName: true } },
            },
            orderBy: { dispatchedAt: "desc" },
            skip: (page - 1) * limit,
            take: limit,
        });

        return NextResponse.json({ success: true, deliveryNotes });
    } catch (error) {
        console.error("Fetch delivery notes failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch delivery notes", details: (error as Error).message },
            { status: 500 }
        );
    }
}
