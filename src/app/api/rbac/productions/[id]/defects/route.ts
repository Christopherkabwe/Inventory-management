import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordInventoryTransaction } from "@/lib/inventory";

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity, defectType, disposition, reason } =
        await req.json();

    if (!productId || !quantity || quantity <= 0) {
        return NextResponse.json(
            { error: "Invalid product or quantity" },
            { status: 400 }
        );
    }

    const production = await prisma.production.findUnique({
        where: { id },
        include: { items: true },
    });

    if (!production)
        return NextResponse.json(
            { error: "Production not found" },
            { status: 404 }
        );

    if (production.status === "LOCKED") {
        return NextResponse.json(
            { error: "Production is locked" },
            { status: 400 }
        );
    }
    /* ================= QUANTITY GUARD ================= */

    const producedItem = production.items.find(
        (i) => i.productId === productId
    );

    if (!producedItem) {
        return NextResponse.json(
            { error: "Product not part of this production" },
            { status: 400 }
        );
    }

    const totalDefects = await prisma.productionDefect.aggregate({
        where: { productionId: production.id, productId },
        _sum: { quantity: true },
    });

    const alreadyDefected = totalDefects._sum.quantity || 0;

    if (alreadyDefected + quantity > producedItem.quantity) {
        return NextResponse.json(
            { error: "Defect quantity exceeds produced quantity" },
            { status: 400 }
        );
    }

    /* ================= TRANSACTION ================= */

    const defect = await prisma.$transaction(async (tx) => {
        const defectRecord = await tx.productionDefect.create({
            data: {
                productionId: production.id,
                productId,
                quantity,
                defectType,
                disposition,
                reason,
                recordedById: user.id,
            },
        });

        /* ================= SCRAP INVENTORY ================= */

        if (disposition === "SCRAPPED") {
            const inventory = await tx.inventory.findUnique({
                where: {
                    productId_locationId: {
                        productId,
                        locationId: production.locationId,
                    },
                },
            });

            if (!inventory || inventory.quantity < quantity) {
                throw new Error("Insufficient inventory to scrap");
            }

            await tx.inventory.update({
                where: {
                    productId_locationId: {
                        productId,
                        locationId: production.locationId,
                    },
                },
                data: {
                    quantity: { decrement: quantity },
                },
            });

            await recordInventoryTransaction({
                productId,
                locationId: production.locationId,
                delta: -quantity,
                source: "PRODUCTION_DEFECT",
                reference: production.productionNo,
                createdById: user.id,
                productionDefectId: defectRecord.id,
                metadata: { defectType, disposition, reason },
            });
        }

        return defectRecord;
    });

    return NextResponse.json({ data: defect }, { status: 201 });
}
