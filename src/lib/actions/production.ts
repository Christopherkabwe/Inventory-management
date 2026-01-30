import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { nextSequence, incrementSequence } from "@/lib/sequence";
import { recordInventoryTransaction } from "@/lib/inventory";
import { getCurrentUser } from "@/lib/auth";

// ---------------- GET all productions ----------------
export async function GET() {
    try {
        const productions = await prisma.production.findMany({
            include: {
                location: true,
                createdBy: true,
                items: {
                    include: {
                        product: true,
                        inventoryHistories: true,
                    },
                },
                defects: {
                    include: {
                        product: true,
                        recordedBy: true,
                        inventoryHistories: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ data: productions });
    } catch (error) {
        console.error("GET productions error:", error);
        return NextResponse.json({ error: "Failed to fetch productions" }, { status: 500 });
    }
}

// ---------------- POST (create new production) ----------------
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { locationId, notes, items } = await req.json();
        if (!locationId || !Array.isArray(items) || items.length === 0) {
            return NextResponse.json({ error: "Location and at least one item are required" }, { status: 400 });
        }

        const safeItems = items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
        }));
        if (safeItems.some(i => !i.productId || i.quantity <= 0)) {
            return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });
        }

        const productionNo = await nextSequence("PROD");
        const batchNumber = await nextSequence("BATCH");

        const production = await prisma.$transaction(async (tx) => {
            const prod = await tx.production.create({
                data: {
                    productionNo,
                    batchNumber,
                    locationId,
                    notes,
                    status: "DRAFT",
                    createdById: user.id,
                    items: { create: safeItems },
                },
                include: { items: true },
            });

            // Update inventory & record transaction
            for (const item of prod.items) {
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId: item.productId, locationId } },
                    update: { quantity: { increment: item.quantity } },
                    create: { productId: item.productId, locationId, quantity: item.quantity, lowStockAt: 10, createdById: user.id },
                });

                await recordInventoryTransaction({
                    productId: item.productId,
                    locationId,
                    delta: item.quantity,
                    source: "PRODUCTION",
                    reference: productionNo,
                    createdById: user.id,
                    productionItemId: item.id,
                    metadata: { batchNumber, notes },
                });
            }

            return prod;
        });

        await incrementSequence("PROD");
        await incrementSequence("BATCH");

        return NextResponse.json({ data: production });
    } catch (error) {
        console.error("CREATE production error:", error);
        return NextResponse.json({ error: "Failed to create production" }, { status: 500 });
    }
}

// ---------------- POST /productions/:id/defect ----------------
export async function POSTDefect(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { productId, quantity, defectType, disposition, reason } = await req.json();
    if (!productId || !quantity || quantity <= 0) return NextResponse.json({ error: "Invalid product or quantity" }, { status: 400 });

    const production = await prisma.production.findUnique({ where: { id: params.id } });
    if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    if (production.status === "LOCKED") return NextResponse.json({ error: "Production is locked", status: 400 });

    const defect = await prisma.$transaction(async (tx) => {
        const defectRecord = await tx.productionDefect.create({
            data: { productionId: production.id, productId, quantity, defectType, disposition, reason, recordedById: user.id },
        });

        if (disposition === "SCRAPPED") {
            await tx.inventory.upsert({
                where: { productId_locationId: { productId, locationId: production.locationId } },
                update: { quantity: { decrement: quantity } },
                create: { productId, locationId: production.locationId, quantity: -quantity, lowStockAt: 10, createdById: user.id },
            });

            await recordInventoryTransaction({
                productId,
                locationId: production.locationId,
                delta: -quantity,
                source: "PRODUCTION_DEFECT",
                reference: production.productionNo,
                createdById: user.id,
                productionDefectId: defectRecord.id,
                metadata: { defectType, reason },
            });
        }

        return defectRecord;
    });

    return NextResponse.json({ data: defect });
}

// ---------------- POST /productions/:id/confirm ----------------
export async function POSTConfirm(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const production = await prisma.production.findUnique({ where: { id: params.id } });
    if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    if (production.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT productions can be confirmed", status: 400 });

    const updated = await prisma.production.update({ where: { id: production.id }, data: { status: "CONFIRMED" } });
    return NextResponse.json({ data: updated });
}

// ---------------- POST /productions/:id/lock ----------------
export async function POSTLock(req: NextRequest, { params }: { params: { id: string } }) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const production = await prisma.production.findUnique({ where: { id: params.id } });
    if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    if (production.status !== "CONFIRMED") return NextResponse.json({ error: "Only CONFIRMED productions can be locked", status: 400 });

    const updated = await prisma.production.update({ where: { id: production.id }, data: { status: "LOCKED" } });
    return NextResponse.json({ data: updated });
}
