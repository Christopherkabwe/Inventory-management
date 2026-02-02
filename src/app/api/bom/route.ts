import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET: List all BOMs
export async function GET() {
    const boms = await prisma.bOM.findMany({
        include: {
            product: true,
            components: {
                include: { component: true },
            },
            createdBy: { select: { id: true, fullName: true, email: true } },
        },
        orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(boms);
}

// POST: Create a new BOM
export async function POST(req: Request) {
    const data = await req.json();
    const { productId, version, description, status, components, createdById } = data;

    const bom = await prisma.bOM.create({
        data: {
            productId,
            version,
            description,
            status,
            createdById,
            components: {
                create: components.map((c: any) => ({
                    componentId: c.componentId,
                    quantity: c.quantity,
                    unit: c.unit,
                    notes: c.notes,
                })),
            },
        },
        include: { components: true },
    });

    return NextResponse.json(bom, { status: 201 });
}
