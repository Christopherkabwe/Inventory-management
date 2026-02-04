import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        // Fetch all customers details
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(suppliers);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch suppliers" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, email, phone, address } = body;

        if (!name) return NextResponse.json({ error: "Name is required" }, { status: 400 });

        const supplier = await prisma.supplier.create({
            data: { name, email, phone, address },
        });

        return NextResponse.json(supplier, { status: 201 });
    } catch (err: any) {
        console.error(err);
        if (err.code === "P2002") {
            return NextResponse.json({ error: "Email must be unique" }, { status: 400 });
        }
        return NextResponse.json({ error: "Failed to create supplier" }, { status: 500 });
    }
}
