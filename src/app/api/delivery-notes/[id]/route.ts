import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(
    _req: Request,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    if (!id) {
        return NextResponse.json(
            { error: "Delivery note ID is required" },
            { status: 400 }
        );
    }

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const deliveryNote = await prisma.deliveryNote.findUnique({
        where: { id },
        include: {
            sale: {
                include: { customer: true },
            },
            items: {
                include: { product: true },
            },
            location: true,
            transporter: true,
            createdBy: {
                select: { fullName: true },
            },
        },
    });

    if (!deliveryNote) {
        return NextResponse.json(
            { error: "Delivery note not found" },
            { status: 404 }
        );
    }

    return NextResponse.json(deliveryNote);
}
