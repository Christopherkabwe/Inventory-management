import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateNumber } from "./utils";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { customerId, locationId, items } = await req.json();
    if (!customerId || !items?.length) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const quotation = await prisma.quotation.create({
        data: {
            quoteNumber: generateNumber("QT"),
            customerId,
            locationId,
            createdById: user.id,
            items: {
                create: items.map((i: any) => ({
                    productId: i.productId,
                    quantity: i.quantity,
                    price: i.price,
                    total: i.quantity * i.price,
                })),
            },
        },
        include: { items: true },
    });

    return NextResponse.json({ quotation });
}
