// app/api/purchase-orders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createPurchaseOrder } from "@/modules/purchasing/purchaseOrder.service";
import { getCurrentUser } from "@/lib/auth"; // <-- your auth helper
import { prisma } from "@/lib/prisma";
import { incrementSequence } from "@/lib/sequence";

// GET all POs
export async function GET() {
    try {
        const pos = await prisma.purchaseOrder.findMany({
            include: {
                supplier: true,
                location: true,
                items: { include: { product: true } },
            },
            orderBy: { createdAt: "desc" },
        });
        return NextResponse.json(pos);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch purchase orders" }, { status: 500 });
    }
}

// CREATE PO
export async function POST(req: NextRequest) {
    try {
        // Get logged-in user
        const user = await getCurrentUser(); // pass request if needed

        if (!user?.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();

        const po = await createPurchaseOrder({
            ...body,
            createdById: user.id, // ✅ automatically assign current user
        });

        await incrementSequence("PO");
        return NextResponse.json(po, { status: 201 });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: error.message ?? "Failed to create PO" }, { status: 400 });
    }
}
