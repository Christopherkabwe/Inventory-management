import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";


export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { saleId, productId, quantity, reason } = await req.json();
    if (!saleId || !productId || !quantity) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const saleReturn = await prisma.saleReturn.create({
        data: {
            returnNumber: `RET-${Date.now()}`,
            saleId,
            productId,
            quantity,
            reason,
            createdById: user.id,
            locationId: (await prisma.sale.findUnique({ where: { id: saleId } }))!.locationId,
        },
    });

    return NextResponse.json({ saleReturn });
}
