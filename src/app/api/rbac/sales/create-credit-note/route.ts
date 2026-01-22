import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { saleId, reason, amount } = await req.json();
    if (!saleId || !reason || !amount) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const creditNote = await prisma.creditNote.create({
        data: {
            creditNoteNumber: `CN-${Date.now()}`,
            saleId,
            reason,
            amount,
            createdById: user.id,
        },
    });

    return NextResponse.json({ creditNote });
}
