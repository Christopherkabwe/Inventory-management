// app/api/quotations/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole, requireSameLocation } from "@/lib/rbac";

type Params = { params: { id: string } };

// -------------------- GET /api/quotations/:id --------------------
export async function GET(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const quotation = await prisma.quotation.findUnique({
            where: { id },
            include: {
                items: { include: { product: true } },
                customer: true,
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
        });

        if (!quotation) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

        // USER role restriction: only their location
        if (user.role === UserRole.USER) {
            requireSameLocation(user, quotation.locationId);
        }

        return NextResponse.json({ success: true, quotation });
    } catch (error) {
        console.error("Fetch quotation failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch quotation", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- PUT /api/quotations/:id --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        const body = await req.json();
        const { items, locationId } = body;

        // Only ADMIN/MANAGER can update
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        // Fetch quotation
        const quotation = await prisma.quotation.findUnique({ where: { id }, include: { items: true } });
        if (!quotation) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

        // USER location check (optional, if needed)
        if (user.role === UserRole.USER) {
            requireSameLocation(user, quotation.locationId);
        }

        const updatedQuotation = await prisma.quotation.update({
            where: { id },
            data: {
                locationId: locationId ?? quotation.locationId,
                items: items
                    ? {
                        deleteMany: {}, // remove existing items
                        create: items.map((i: any) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                            total: i.quantity * i.price,
                        })),
                    }
                    : undefined,
            },
            include: {
                items: { include: { product: true } },
                customer: true,
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
        });

        return NextResponse.json({ success: true, quotation: updatedQuotation });
    } catch (error) {
        console.error("Update quotation failed:", error);
        return NextResponse.json(
            { error: "Failed to update quotation", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- DELETE /api/quotations/:id --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();

        // Only ADMIN/MANAGER can delete
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        // Fetch quotation
        const quotation = await prisma.quotation.findUnique({ where: { id } });
        if (!quotation) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });

        // USER location check (optional)
        if (user.role === UserRole.USER) {
            requireSameLocation(user, quotation.locationId);
        }

        // Delete quotation (nested items are deleted automatically if you have cascade on items)
        await prisma.quotation.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Quotation deleted" });
    } catch (error) {
        console.error("Delete quotation failed:", error);
        return NextResponse.json(
            { error: "Failed to delete quotation", details: (error as Error).message },
            { status: 500 }
        );
    }
}
