// app/api/sale-returns/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { nextSequence } from "@/lib/sequence";

// -------------------- GET /api/sale-returns?saleId=... --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const url = new URL(req.url);
        const saleId = url.searchParams.get("saleId") ?? undefined;

        // Build filter
        const where: any = {};
        if (saleId) where.saleId = saleId;
        if (user.role !== UserRole.ADMIN) where.createdById = user.id;

        const saleReturns = await prisma.saleReturn.findMany({
            where,
            include: {
                sale: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        customer: { select: { id: true, name: true } },
                    },
                },
                product: { select: { id: true, name: true, sku: true } },
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, saleReturns });
    } catch (error) {
        console.error("Fetch sale returns failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch sale returns", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- POST /api/sale-returns --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can create sale returns
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        const { saleId, productId, quantity, reason } = await req.json();

        // Validate input
        if (!saleId || !productId || !quantity || !reason) {
            return NextResponse.json(
                { error: "Missing required fields: saleId, productId, quantity, reason" },
                { status: 400 }
            );
        }

        if (quantity <= 0) {
            return NextResponse.json({ error: "Quantity must be greater than 0" }, { status: 400 });
        }

        // Transaction to safely create SR with sequence
        const saleReturn = await prisma.$transaction(async (tx) => {
            // 1️⃣ Check sale
            const sale = await tx.sale.findUnique({ where: { id: saleId } });
            if (!sale) throw new Error("Sale not found");

            // 2️⃣ Check product
            const product = await tx.productList.findUnique({ where: { id: productId } });
            if (!product) throw new Error("Product not found");

            // 3️⃣ Generate SR number
            const returnNumber = await nextSequence(tx, "RETURN");

            // 4️⃣ Create sale return
            const sr = await tx.saleReturn.create({
                data: {
                    saleId,
                    productId,
                    quantity,
                    reason,
                    returnNumber,
                    createdById: user.id,
                },
                include: {
                    sale: { select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } } },
                    product: { select: { id: true, name: true, sku: true } },
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
            });

            return sr;
        });

        return NextResponse.json({ success: true, saleReturn }, { status: 201 });
    } catch (error) {
        console.error("Create sale return failed:", error);
        return NextResponse.json(
            { error: "Failed to create sale return", details: (error as Error).message },
            { status: 500 }
        );
    }
}
