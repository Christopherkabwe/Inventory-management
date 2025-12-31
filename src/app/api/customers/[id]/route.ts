import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const data = await req.json();
    const customer = await prisma.customer.update({
        where: { id: params.id },
        data,
    });
    return NextResponse.json(customer);
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    await prisma.customer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
}
