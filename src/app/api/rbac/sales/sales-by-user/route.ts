import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // -------------------- BUILD ROLE-BASED FILTER --------------------
        let whereClause: any = {};

        if (user.role === "ADMIN") {
            // Admin sees all sales
            whereClause = {};
        } else if (user.role === "MANAGER") {
            // Manager sees:
            // 1️⃣ Sales they created
            // 2️⃣ Sales for customers assigned to users they manage
            // 3️⃣ Sales happening in their location
            const managedUserIds = await prisma.user
                .findMany({ where: { managerId: user.id }, select: { id: true } })
                .then((res) => res.map((u) => u.id));

            whereClause = {
                OR: [
                    { createdById: user.id },
                    { customer: { userId: { in: managedUserIds } } },
                    ...(user.locationId ? [{ locationId: user.locationId }] : []),
                ],
            };
        } else if (user.role === "USER") {
            // Regular user sees:
            // 1️⃣ Sales they created
            // 2️⃣ Sales for their assigned customers
            whereClause = {
                OR: [
                    { createdById: user.id },
                    { customer: { userId: user.id } },
                ],
            };
        }

        // -------------------- FETCH SALES --------------------
        const sales = await prisma.sale.findMany({
            where: whereClause,
            include: {
                customer: {
                    include: {
                        user: true, // to know the assigned user
                        location: true,
                    },
                },
                location: true,
                createdBy: true,
                transporter: true,
                items: {
                    include: { product: true },
                },
                creditNotes: {
                    include: { createdBy: true },
                },
                returns: {
                    include: { product: true, createdBy: true },
                },
                deliveryNotes: {
                    include: {
                        transporter: true,
                        createdBy: true,
                        items: { include: { product: true } },
                    },
                },
            },
            orderBy: { saleDate: "desc" },
        });

        // -------------------- TRANSFORM INTO REPORT --------------------
        const report = sales.map((s) => ({
            saleId: s.id,
            invoiceNumber: s.invoiceNumber,
            saleDate: s.saleDate,
            status: s.status,
            location: s.location?.name,
            customer: s.customer?.name,
            customerEmail: s.customer?.email,
            assignedUser: s.customer?.user?.fullName,
            createdBy: s.createdBy?.fullName,
            transporter: s.transporter?.name,
            items: s.items.map((i) => ({
                product: i.product.name,
                sku: i.product.sku,
                quantity: i.quantity,
                price: i.price,
                total: i.total,
            })),
            creditNotes: s.creditNotes.map((c) => ({
                number: c.creditNoteNumber,
                amount: c.amount,
                reason: c.reason,
                createdBy: c.createdBy?.fullName,
            })),
            returns: s.returns.map((r) => ({
                returnNumber: r.returnNumber,
                product: r.product.name,
                quantity: r.quantity,
                reason: r.reason,
                createdBy: r.createdBy?.fullName,
            })),
            deliveryNotes: s.deliveryNotes.map((dn) => ({
                deliveryNoteNo: dn.deliveryNoteNo,
                transporter: dn.transporter?.name,
                dispatchedAt: dn.dispatchedAt,
                createdBy: dn.createdBy?.fullName,
                items: dn.items.map((di) => ({
                    product: di.product.name,
                    quantityDelivered: di.quantityDelivered,
                })),
            })),
        }));

        return NextResponse.json({ report });
    } catch (error) {
        console.error("❌ Failed to generate sales report:", error);
        return NextResponse.json({ error: "Failed to generate sales report" }, { status: 500 });
    }
}
