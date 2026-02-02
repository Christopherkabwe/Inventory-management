import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const bom = await prisma.bOM.findUnique({
        where: { id },
        include: {
            product: true,
            components: { include: { component: true } },
            createdBy: { select: { id: true, fullName: true } },
        },
    });
    if (!bom) return NextResponse.json({ error: "BOM not found" }, { status: 404 });
    return NextResponse.json(bom);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    const data = await req.json();

    const updatedBOM = await prisma.bOM.update({
        where: { id },
        data: {
            description: data.description,
            status: data.status,
            components: data.components
                ? {
                    deleteMany: {}, // remove old components
                    create: data.components.map((c: any) => ({
                        componentId: c.componentId,
                        quantity: c.quantity,
                        unit: c.unit,
                        notes: c.notes,
                    })),
                }
                : undefined,
        },
        include: { components: true },
    });

    return NextResponse.json(updatedBOM);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;
    await prisma.bOM.delete({ where: { id } });
    return NextResponse.json({ message: "BOM deleted successfully" });
}
