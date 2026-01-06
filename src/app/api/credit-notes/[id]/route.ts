// app/api/credit-notes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";

type Params = { params: { id: string } };



// -------------------- PUT /api/credit-notes/:id --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN]);

        const { reason, amount } = await req.json();
        if (!reason && (typeof amount !== "number" || amount <= 0)) {
            return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        const updatedCreditNote = await prisma.creditNote.update({
            where: { id },
            data: {
                reason: reason ?? undefined,
                amount: typeof amount === "number" && amount > 0 ? amount : undefined,
            },
            include: {
                sale: {
                    select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } },
                },
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
        });

        return NextResponse.json({ success: true, creditNote: updatedCreditNote });
    } catch (error) {
        console.error("Update credit note failed:", error);
        return NextResponse.json(
            { error: "Failed to update credit note", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- DELETE /api/credit-notes/:id --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN]);

        const deletedCreditNote = await prisma.creditNote.delete({
            where: { id },
            include: {
                sale: {
                    select: { id: true, invoiceNumber: true, customer: { select: { id: true, name: true } } },
                },
                createdBy: { select: { id: true, fullName: true, email: true } },
            },
        });

        return NextResponse.json({ success: true, creditNote: deletedCreditNote });
    } catch (error) {
        console.error("Delete credit note failed:", error);
        return NextResponse.json(
            { error: "Failed to delete credit note", details: (error as Error).message },
            { status: 500 }
        );
    }
}
