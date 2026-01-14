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

    const productionWhere: any = {
        ...productionAccess,
        createdAt: {
            gte: from ? new Date(from) : undefined,
            lte: to ? new Date(to) : undefined,
        },
    };

    // Group by location
    const data = await prisma.production.groupBy({
        by: ["locationId"],
        _count: { id: true },
        where: productionWhere
    });

    // Fetch location details
    const locations = await prisma.location.findMany({
        where: { id: { in: data.map(d => d.locationId) } },
    });

    // Fetch all production items for these locations and date range
    const productionItems = await prisma.productionItem.findMany({
        where: {
            production: productionWhere,
        },
        include: {
            product: true,
            production: true,
        },
    });

    // Map results per location
    const result = data.map(d => {
        const location = locations.find(l => l.id === d.locationId)!;
        const items = productionItems.filter(i => i.production.locationId === d.locationId);

        const totalQty = items.reduce((sum, i) => sum + (i.quantity || 0), 0);
        const totalTonnage = items.reduce((sum, i) => {
            const packSize = i.product.packSize || 1;
            const weight = i.product.weightValue || 0;
            return sum + ((i.quantity || 0) * packSize * weight) / 1000;
        }, 0);

        return {
            locationId: location.id,
            location: location.name,
            productions: d._count.id,
            totalQty,
            totalTonnage,
        };
    });

    return NextResponse.json({ data: result });
}
