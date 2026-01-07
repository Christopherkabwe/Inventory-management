import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const id = req.url.split("/").pop();

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const inventory = await prisma.inventory.findUnique({
        where: { id: id! },
        include: {
            product: {
                include: {
                    createdBy: true,
                    saleItems: true,
                    transferItems: true,
                    productionItems: true,
                    adjustmentItems: true,
                    orderItems: true,
                    quotationItems: true,
                    saleReturns: true,
                    deliveryNoteItems: true,
                    transferReceiptItems: true,
                },
            },
            location: true,
            createdBy: true,
        },
    });

    if (!inventory) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // RBAC check
    if (user.role !== "ADMIN") {
        const allowed =
            inventory.createdById === user.id || inventory.locationId === user.locationId;
        if (!allowed) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(inventory);
}
