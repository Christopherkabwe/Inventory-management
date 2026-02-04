import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const supplier = await prisma.supplier.findUnique({
            where: { id },
        });

        if (!supplier) return NextResponse.json({ error: "Supplier not found" }, { status: 404 });

        return NextResponse.json(supplier);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch supplier" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const body = await req.json();
        const { name, email, phone, address } = body;

        const updated = await prisma.supplier.update({
            where: { id },
            data: { name, email, phone, address },
        });

        return NextResponse.json(updated);
    } catch (err: any) {
        console.error(err);
        if (err.code === "P2002") {
            return NextResponse.json({ error: "Email must be unique" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to update supplier" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        await prisma.supplier.delete({ where: { id } });
        return NextResponse.json({ message: "Supplier deleted" });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
    }
}
