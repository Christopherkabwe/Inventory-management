// /api/rbac/reports/production/by-batch.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let productionAccess: any = {};

    if (user.role === "ADMIN") {
        productionAccess = {}; // sees everything
    } else if (user.role === "MANAGER") {
        const managedUserIds = await prisma.user
            .findMany({ where: { managerId: user.id }, select: { id: true } })
            .then((res) => res.map((u) => u.id));

        productionAccess = {
            OR: [
                { createdById: user.id }, // inventory created by manager
                { locationId: user.locationId }, // inventory in manager's location

            ],
        };
    } else if (user.role === "USER") {
        productionAccess = {
            OR: [
                { createdById: user.id }, // inventory they created
                { locationId: user.locationId }, // inventory in location
            ],
        };
    }

    const { searchParams } = new URL(req.url);

    const from = searchParams.get("from");
    const to = searchParams.get("to");
    const batch = searchParams.get("batch");
    const locationId = searchParams.get("locationId");

    const where: any = {
        production: {
            ...productionAccess,
        }
    };

    if (from || to) {
        where.production = {
            createdAt: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
            },
        };
    }
    if (batch) {
        where.production = { ...(where.production || {}), batchNumber: batch };
    }
    if (locationId) {
        where.production = { ...(where.production || {}), locationId };
    }

    const data = await prisma.productionItem.findMany({
        where,
        include: {
            product: true, // Full product details here
            production: {
                include: {
                    location: true,
                },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    // Map response for frontend
    // Map response for frontend
    const response = data.map(d => {
        const qty = d.quantity || 0;
        const prod = d.product;

        return {
            productionNo: d.production.productionNo,
            batchNumber: d.production.batchNumber,
            product: prod.name,
            sku: prod.sku,
            category: prod.category,
            packSize: prod.packSize,
            weightValue: prod.weightValue,
            weightUnit: prod.weightUnit,
            price: prod.price,
            quantity: qty,
            location: d.production.location.name,
            date: d.production.createdAt,
            totalValue: qty * (prod.price || 0),
            tonnage: (qty * (prod.weightValue || 0) * (prod.packSize || 1)) / 1000,
        };
    });

    return NextResponse.json({ data: response });
}
