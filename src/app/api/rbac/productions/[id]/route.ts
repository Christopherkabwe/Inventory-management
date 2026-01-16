import { NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { updateInventoryHistory } from "@/lib/updateInventoryHistory";

interface Params {
    params: { id: string };
}

export async function PUT(req: NextRequest, { params }: Params) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const { notes, items } = await req.json();
        if (!Array.isArray(items) || items.length === 0) {
            return NextResponse.json(
                { error: "At least one item is required" },
                { status: 400 }
            );
        }
        const safeItems = items.map((i: any) => ({
            productId: i.productId,
            quantity: Number(i.quantity),
        }));
        if (safeItems.some(i => !i.productId || i.quantity <= 0)) {
            return NextResponse.json(
                { error: "Invalid product or quantity" },
                { status: 400 }
            );
        }
        /* 1️⃣ Fetch production OUTSIDE transaction */
        const productionId = (await params).id;
        const production = await prisma.production.findUnique({
            where: { id: productionId },
            include: { items: true },
        });
        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }
        const rollbackOps = production.items.map(item => prisma.inventory.upsert({
            where: {
                productId_locationId: {
                    productId: item.productId,
                    locationId: production.locationId,
                },
            },
            update: {
                quantity: { decrement: item.quantity },
            },
            create: {
                productId: item.productId,
                locationId: production.locationId,
                quantity: 0,
                lowStockAt: 10,
                createdById: user.id,
            },
        }));

        const applyOps = safeItems.map(item => prisma.inventory.upsert({
            where: {
                productId_locationId: {
                    productId: item.productId,
                    locationId: production.locationId,
                },
            },
            update: {
                quantity: { increment: item.quantity },
            },
            create: {
                productId: item.productId,
                locationId: production.locationId,
                quantity: item.quantity,
                lowStockAt: 10,
                createdById: user.id,
            },
        }));

        /* 2️⃣ Atomic batch transaction */
        const [updatedProduction] = await prisma.$transaction([
            ...rollbackOps,
            prisma.production.update({
                where: { id: productionId },
                data: {
                    notes,
                    items: {
                        deleteMany: {},
                        create: safeItems,
                    },
                },
                include: {
                    items: {
                        include: { product: true }
                    },
                    location: true,
                    createdBy: true,
                },
            }),
            ...applyOps.map(async (op, index) => {
                await updateInventoryHistory(safeItems[index].productId, production.locationId, safeItems[index].quantity, new Date());
            }),
        ]);

        return NextResponse.json({ data: updatedProduction });
    } catch (error: any) {
        console.error("🔥 PUT production FAILED", error);
        return NextResponse.json(
            { error: error.message ?? "Failed to update production" },
            { status: 500 }
        );
    }
}

export async function DELETE(req: NextRequest, { params }: Params) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    try {
        const productionId = (await params).id;
        const production = await prisma.production.findUnique({
            where: { id: productionId },
            include: { items: true },
        });
        if (!production) {
            return NextResponse.json(
                { error: "Production not found" },
                { status: 404 }
            );
        }
        await prisma.$transaction(async (tx) => {
            /* Rollback inventory */
            for (const item of production.items) {
                await tx.inventory.updateMany({
                    where: {
                        productId: item.productId,
                        locationId: production.locationId,
                    },
                    data: {
                        quantity: { decrement: item.quantity }
                    },
                });
                await updateInventoryHistory(item.productId, production.locationId, -item.quantity, new Date());
            }
            /* Delete production */
            await tx.production.delete({
                where: { id: productionId },
            });
        });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("DELETE production error:", error);
        return NextResponse.json(
            { error: "Failed to delete production" },
            { status: 500 }
        );
    }
}
