import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["DRAFT", "RECEIVED", "CLOSED"] as const;
export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const { status } = await req.json();
        if (!VALID_STATUSES.includes(status)) {
            return NextResponse.json(
                { error: `Invalid status: ${status}. Must be DRAFT, RECEIVED, or CLOSED.` },
                { status: 400 }
            );
        }

        const grn = await prisma.gRN.findUnique({ where: { id } });
        if (!grn) {
            return NextResponse.json({ error: `GRN ${id} not found` }, { status: 404 });
        }

        const updatedGRN = await prisma.gRN.update({
            where: { id },
            data: { status },
        });
        return NextResponse.json(updatedGRN);
    } catch (err) {
        console.error('GRN update error:', err);
        return NextResponse.json({ error: 'Failed to update GRN status' }, { status: 500 });
    }
}