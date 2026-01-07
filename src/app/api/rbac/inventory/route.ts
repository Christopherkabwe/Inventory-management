import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const whereClause: any = {};

    // Apply RBAC
    if (user.role === "MANAGER" || user.role === "USER") {
        whereClause.OR = [
            { createdById: user.id }, // data created by user
            { locationId: user.locationId }, // data for user's location
        ];
    }

    const inventories = await prisma.inventory.findMany({
        where: whereClause,
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

    return NextResponse.json(inventories);
}