import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { generateNumber, runTransaction } from "./utils";

// Handles both Returns & CreditNotes
export async function POST(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { type, saleId, productId, quantity, reason, amount } = await req.json();
    if (!type || !saleId) return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    if (type === "RETURN") {
        const saleReturn = await prisma.saleReturn.create({
            data: {
                returnNumber: generateNumber("RET"),
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

    if (type === "CREDIT") {
        const creditNote = await prisma.creditNote.create({
            data: {
                creditNoteNumber: generateNumber("CN"),
                saleId,
                reason,
                amount,
                createdById: user.id,
            },
        });
        return NextResponse.json({ creditNote });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
}
