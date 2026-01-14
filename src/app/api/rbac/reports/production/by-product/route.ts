
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
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
    const locationId = searchParams.get("locationId");

    const where: any = {
        production: {
            ...productionAccess,
        }
    };

    const data = await prisma.productionItem.groupBy({
        by: ["productId"],
        _sum: { quantity: true },
        where: {
            production: {
                ...productionAccess,
                createdAt: {
                    gte: from ? new Date(from) : undefined,
                    lte: to ? new Date(to) : undefined,
                },
                locationId: locationId || undefined,
            },
        },
    });

    const products = await prisma.productList.findMany({
        where: { id: { in: data.map(d => d.productId) } },
    });

    const result = data.map(d => {
        const product = products.find(p => p.id === d.productId)!;
        const quantity = d._sum.quantity || 0;  // use _sum.quantity

        return {
            productId: product.id,
            name: product.name,
            sku: product.sku,
            category: product.category,
            packSize: product.packSize,
            weightValue: product.weightValue,
            weightUnit: product.weightUnit,
            price: product.price,
            quantity,  // total quantity
            totalQty: quantity,
            totalValue: quantity * product.price,
            tonnage: (quantity * (product.weightValue || 0) * product.packSize) / 1000,
        };
    });

    return NextResponse.json({ data: result });
}
