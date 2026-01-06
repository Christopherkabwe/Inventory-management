// app/api/credit-notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { nextSequence } from "@/lib/sequence";

// -------------------- GET /api/credit-notes?saleId=... --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        const url = new URL(req.url);
        const saleId = url.searchParams.get("saleId");

        const where: any = {};
        if (saleId) where.saleId = saleId;
        // USER can only see their created credit notes
        if (user.role === UserRole.USER) where.createdById = user.id;

        const creditNotes = await prisma.creditNote.findMany({
            where,
            include: {
                sale: {
                    select: {
                        id: true,
                        invoiceNumber: true,
                        customer: { select: { id: true, name: true } },
                    },
                },
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ success: true, creditNotes });
    } catch (error) {
        console.error("Fetch credit notes failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch credit notes", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- POST /api/credit-notes --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        const { saleId, reason, amount } = await req.json();
        if (!saleId || !reason || typeof amount !== "number" || amount <= 0) {
            return NextResponse.json(
                { error: "Missing or invalid fields (saleId, reason, amount)" },
                { status: 400 }
            );
        }

        const sale = await prisma.sale.findUnique({ where: { id: saleId } });
        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });

        const creditNote = await prisma.$transaction(async (tx) => {
            // 1️⃣ Generate credit note number
            const creditNoteNumber = await nextSequence(tx, "CN"); // CN = Credit Note

            // 2️⃣ Create credit note record
            return tx.creditNote.create({
                data: { saleId, reason, amount, createdById: user.id, creditNoteNumber },
                include: {
                    sale: {
                        select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } },
                    },
                    createdBy: { select: { id: true, fullName: true, email: true } },
                },
            });
        });

        return NextResponse.json({ success: true, creditNote });
    } catch (error) {
        console.error("Create credit note failed:", error);
        return NextResponse.json(
            { error: "Failed to create credit note", details: (error as Error).message },
            { status: 500 }
        );
    }
}
