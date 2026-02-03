import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// --------------------
// GET /api/bom/:id
// --------------------
export async function GET(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const bom = await prisma.bOM.findUnique({
            where: { id },
            include: {
                product: true,
                components: {
                    include: {
                        component: true, // include component details
                    },
                },
            },
        });

        if (!bom) return new NextResponse("BOM not found", { status: 404 });

        return NextResponse.json(bom);
    } catch (error) {
        console.error("Failed to fetch BOM", error);
        return new NextResponse("Failed to fetch BOM", { status: 500 });
    }
}

// --------------------
// PUT /api/bom/:id
// --------------------
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;
    const data = await req.json();

    try {
        const updatedBOM = await prisma.bOM.update({
            where: { id },
            data: {
                productId: data.productId,
                components: data.components
                    ? {
                        deleteMany: {}, // delete old components for this BOM
                        create: data.components.map((c: any) => ({
                            componentId: c.componentId,
                            quantity: c.quantity,
                            unit: c.unit,
                            notes: c.notes || "",
                        })),
                    }
                    : undefined,
            },
            include: {
                components: {
                    include: {
                        component: true,
                    },
                },
            },
        });

        return NextResponse.json(updatedBOM);
    } catch (error) {
        console.error("Failed to update BOM", error);
        return new NextResponse("Failed to update BOM", { status: 500 });
    }
}

// --------------------
// DELETE /api/bom/:id
// --------------------
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        await prisma.bOM.delete({ where: { id } });
        return NextResponse.json({ message: "BOM deleted successfully" });
    } catch (error) {
        console.error("Failed to delete BOM", error);
        return new NextResponse("Failed to delete BOM", { status: 500 });
    }
}
