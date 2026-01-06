// app/api/quotations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence } from "@/lib/sequence";
import { UserRole } from "@/lib/rbac";

type QuotationItemInput = {
    productId: string;
    quantity: number;
    price: number;
};

// -------------------- GET /api/quotations --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const page = Math.max(Number(url.searchParams.get("page") ?? 1), 1);
        const limit = Math.max(Number(url.searchParams.get("limit") ?? 20), 1);
        const skip = (page - 1) * limit;

        const locationId = url.searchParams.get("locationId");
        const customerId = url.searchParams.get("customerId");

        const where: any = {};
        if (locationId) where.locationId = locationId;
        if (customerId) where.customerId = customerId;

        // USER can only see their own location quotations
        if (user.role === UserRole.USER) where.locationId = user.locationId;

        const [quotations, total] = await Promise.all([
            prisma.quotation.findMany({
                where,
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
                orderBy: { createdAt: "desc" },
                skip,
                take: limit,
            }),
            prisma.quotation.count({ where }),
        ]);

        return NextResponse.json({
            success: true,
            quotations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error("Fetch quotations failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch quotations", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- POST /api/quotations --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { customerId, locationId, items } = await req.json();
        if (!customerId || !locationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        // USER can only create for their assigned location
        if (user.role === UserRole.USER && user.locationId !== locationId) {
            return NextResponse.json({ error: "Forbidden location", status: 403 });
        }

        const quotation = await prisma.$transaction(async (tx) => {
            // 1️⃣ Generate quote number using nextSequence
            const quoteNumber = await nextSequence(tx, "QUOTE");

            // 2️⃣ Create quotation with items
            return tx.quotation.create({
                data: {
                    quoteNumber,
                    customerId,
                    locationId,
                    createdById: user.id,
                    items: {
                        create: items.map((i: QuotationItemInput) => ({
                            productId: i.productId,
                            quantity: i.quantity,
                            price: i.price,
                            total: i.quantity * i.price,
                        })),
                    },
                },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
            });
        });

        return NextResponse.json({ success: true, quotation }, { status: 201 });
    } catch (error) {
        console.error("Create quotation failed:", error);
        return NextResponse.json(
            { error: "Failed to create quotation", details: (error as Error).message },
            { status: 500 }
        );
    }
}
