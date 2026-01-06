// app/api/sales-orders/route.ts
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, requireSameLocation, UserRole } from "@/lib/rbac";
import { nextSequence } from "@/lib/sequence";
import { NextResponse } from "next/server";

// ---------------- CREATE SALES ORDER ----------------
export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.USER]);

        const body = await req.json();
        const { customerId, locationId, items } = body;

        if (!items?.length) {
            return NextResponse.json({ error: "No items" }, { status: 400 });
        }

        // USER can only create for their own location
        if (user.role === UserRole.USER) {
            requireSameLocation(user, locationId);
        }

        const order = await prisma.$transaction(async (tx) => {
            // 1️⃣ Generate sales order number inside transaction
            const orderNumber = await nextSequence(tx, "SO");

            // 2️⃣ Create sales order with items
            const newOrder = await tx.salesOrder.create({
                data: {
                    orderNumber,
                    customerId,
                    locationId,
                    createdById: user.id,
                    items: {
                        create: items.map((i: { productId: string; quantity: number }) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                        })),
                    },
                },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                },
            });

            return newOrder;
        });

        return NextResponse.json({ success: true, order });
    } catch (err) {
        console.error("Create sales order failed:", err);
        return NextResponse.json(
            { error: "Failed to create sales order", details: (err as Error).message },
            { status: 500 }
        );
    }
}

// ---------------- GET SALES ORDERS ----------------
export async function GET(req: Request) {
    try {
        const user = await getCurrentUser();

        const { searchParams } = new URL(req.url);
        const page = Math.max(Number(searchParams.get("page") ?? 1), 1);
        const limit = Math.max(Number(searchParams.get("limit") ?? 20), 1);

        const where =
            user.role === UserRole.USER
                ? { locationId: user.locationId }
                : {};

        const [orders, total] = await Promise.all([
            prisma.salesOrder.findMany({
                where,
                include: {
                    customer: true,
                    items: { include: { product: true } },
                    deliveryNotes: true,
                    invoices: true,
                },
                orderBy: { createdAt: "desc" },
                skip: (page - 1) * limit,
                take: limit,
            }),
            prisma.salesOrder.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            data: orders,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Fetch sales orders failed:", err);
        return NextResponse.json(
            { error: "Failed to fetch sales orders", details: (err as Error).message },
            { status: 500 }
        );
    }
}
