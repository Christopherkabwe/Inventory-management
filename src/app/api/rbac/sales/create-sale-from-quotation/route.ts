import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { quotationId } = await req.json();
        if (!quotationId) return NextResponse.json({ error: "Quotation ID required" }, { status: 400 });

        const quotation = await prisma.quotation.findUnique({
            where: { id: quotationId },
            include: { items: true, customer: true, location: true },
        });

        if (!quotation) return NextResponse.json({ error: "Quotation not found" }, { status: 404 });
        if (quotation.status !== "APPROVED") return NextResponse.json({ error: "Quotation not approved" }, { status: 400 });

        const salesOrder = await prisma.salesOrder.create({
            data: {
                orderNumber: `SO-${Date.now()}`,
                customerId: quotation.customerId,
                locationId: quotation.locationId,
                createdById: user.id,
                status: "PENDING",
                items: {
                    create: quotation.items.map((item) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                    })),
                },
            },
            include: { items: { include: { product: true } } },
        });

        return NextResponse.json({ salesOrder });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
