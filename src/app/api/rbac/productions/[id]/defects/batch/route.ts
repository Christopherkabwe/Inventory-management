import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { recordInventoryTransaction } from "@/lib/inventory";
import { DefectType } from "@/generated/prisma";

type BatchDefectInput = {
    productId: string;
    quantity: number;
    defectType: DefectType;
    disposition: "SCRAPPED" | "REWORKED" | "HELD";
    reason?: string;
};

export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await req.json();
    const defects: BatchDefectInput[] = body.defects;

    if (!Array.isArray(defects) || defects.length === 0) {
        return NextResponse.json(
            { error: "No defects provided" },
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

    /* ================= VALIDATION (NO SIDE EFFECTS) ================= */

    for (const d of defects) {
        if (
            !d.productId ||
            !d.quantity ||
            d.quantity <= 0 ||
            !d.defectType ||
            !d.disposition
        ) {
            return NextResponse.json(
                { error: "Invalid defect payload" },
                { status: 400 }
            );
        }

        const producedItem = production.items.find(
            (i) => i.productId === d.productId
        );

        if (!producedItem) {
            return NextResponse.json(
                {
                    error: `Product ${d.productId} not part of this production`,
                },
                { status: 400 }
            );
        }
        if (!Object.values(DefectType).includes(d.defectType)) {
            return NextResponse.json(
                { error: `Invalid defectType: ${d.defectType}` },
                { status: 400 }
            );
        }

        const totalDefects = await prisma.productionDefect.aggregate({
            where: {
                productionId: production.id,
                productId: d.productId,
            },
            _sum: { quantity: true },
        });

        const alreadyDefected = totalDefects._sum.quantity || 0;

        if (alreadyDefected + d.quantity > producedItem.quantity) {
            return NextResponse.json(
                {
                    error: `Defect quantity exceeds produced quantity for product ${d.productId}`,
                },
                { status: 400 }
            );
        }

        if (d.disposition === "SCRAPPED") {
            const inventory = await prisma.inventory.findUnique({
                where: {
                    productId_locationId: {
                        productId: d.productId,
                        locationId: production.locationId,
                    },
                },
            });

            if (!inventory || inventory.quantity < d.quantity) {
                return NextResponse.json(
                    {
                        error: `Insufficient inventory to scrap product ${d.productId}`,
                    },
                    { status: 400 }
                );
            }
        }
    }

    /* ================= TRANSACTION ================= */

    const createdDefects = await prisma.$transaction(async (tx) => {
        const results = [];

        for (const d of defects) {
            const defectRecord = await tx.productionDefect.create({
                data: {
                    productionId: production.id,
                    productId: d.productId,
                    quantity: d.quantity,
                    defectType: d.defectType,
                    disposition: d.disposition,
                    reason: d.reason,
                    recordedById: user.id,
                },
            });

            if (d.disposition === "SCRAPPED") {
                await tx.inventory.update({
                    where: {
                        productId_locationId: {
                            productId: d.productId,
                            locationId: production.locationId,
                        },
                    },
                    data: {
                        quantity: { decrement: d.quantity },
                    },
                });

                await recordInventoryTransaction({
                    productId: d.productId,
                    locationId: production.locationId,
                    delta: -d.quantity,
                    source: "PRODUCTION_DEFECT",
                    reference: production.productionNo,
                    createdById: user.id,
                    productionDefectId: defectRecord.id,
                    metadata: {
                        defectType: d.defectType,
                        disposition: d.disposition,
                        reason: d.reason,
                        batch: true,
                    },
                });
            }

            results.push(defectRecord);
        }

        return results;
    });

    return NextResponse.json(
        { data: createdDefects },
        { status: 201 }
    );
}
