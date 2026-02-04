// app/api/mrp/productions/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const status = url.searchParams.get("status"); // e.g., "DRAFT"

    // Optional: add RBAC / auth check here

    const where: any = {};
    if (status) where.status = status;

    const productions = await prisma.production.findMany({
        where,
        include: {
            location: true,
            createdBy: true,
            items: { include: { product: true } },
            defects: { include: { product: true } },
        },
        orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(productions);
}
