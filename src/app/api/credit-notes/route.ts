import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { nextSequence, incrementSequence } from "@/lib/sequence";

export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { saleId, reason, amount } = await req.json();

    if (!saleId || !amount || amount <= 0) {
        return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const creditNoteNumber = await nextSequence("CN");

    const creditNote = await prisma.creditNote.create({
        data: {
            creditNoteNumber,
            saleId,
            reason,
            amount,
            createdById: user.id,
        },
    });

    await incrementSequence("CN");

    // Optional: recalculate sale status
    const sale = await prisma.sale.findUnique({
        where: { id: saleId },
        include: { items: true, payments: true, creditNotes: true },
    });

    if (sale) {
        const total = sale.items.reduce((a, i) => a + i.total, 0);
        const paid = sale.payments.reduce((a, p) => a + p.amount, 0);
        const creditTotal = sale.creditNotes.reduce((a, c) => a + c.amount, 0);
        let status = "CONFIRMED";

        if (paid + creditTotal >= total) status = "PAID";
        else if (paid + creditTotal > 0) status = "PARTIALLY_PAID";

        await prisma.sale.update({
            where: { id: saleId },
            data: { status },
        });
    }

    return NextResponse.json(creditNote);
}
