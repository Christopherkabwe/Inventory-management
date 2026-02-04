import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    const po = await prisma.purchaseOrder.findUnique({
        where: { id },
        include: { items: { include: { product: true } }, supplier: true },
    });
    if (!po) return NextResponse.json({ error: "PO not found" }, { status: 404 });
    return NextResponse.json(po);
}

// ---------------- UPDATE A PURCHASE ORDER ----------------
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        const { status, notes } = await req.json();
        if (!id) return NextResponse.json({ error: "PO id required" }, { status: 400 });

        const po = await prisma.purchaseOrder.update({
            where: { id },
            data: { ...(status ? { status } : {}), ...(notes ? { notes } : {}) },
        });
        return NextResponse.json(po);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update PO" }, { status: 500 });
    }
}

// ---------------- DELETE A PURCHASE ORDER ----------------
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = params;
        if (!id) return NextResponse.json({ error: "PO id required" }, { status: 400 });

        await prisma.purchaseOrder.delete({ where: { id } });
        return NextResponse.json({ message: "PO deleted successfully" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete PO" }, { status: 500 });
    }
}
