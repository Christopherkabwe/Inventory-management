import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/transfers?limit=10
export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const limit = Number(searchParams.get("limit") || 10);

    try {
        const transfers = await prisma.transfer.findMany({
            orderBy: { createdAt: "desc" },
            take: limit,
            include: {
                product: true,
                fromLocation: true,
                toLocation: true,
            },
        });

        return NextResponse.json({ transfers });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 });
    }
}

// POST /api/transfers
export async function POST(req: Request) {
    try {
        const { productId, fromLocationId, toLocationId, quantity } = await req.json();

        if (!productId || !quantity) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const createdBy = "4ba8d662-e7b2-4157-9d04-854d2d4601e6"; // replace with logged-in user

        const transfer = await prisma.transfer.create({
            data: {
                productId,
                fromLocationId: fromLocationId || null,
                toLocationId: toLocationId || null,
                quantity: Number(quantity),
                createdBy,
            },
            include: {
                product: true,
                fromLocation: true,
                toLocation: true,
            },
        });

        return NextResponse.json({ transfer });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create transfer" }, { status: 500 });
    }
}
