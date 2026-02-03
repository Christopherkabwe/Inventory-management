import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createBOM } from "@/services/create-bom";

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

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = await req.json();

        const bom = await createBOM({
            productId: body.productId,
            version: body.version,
            status: body.status,
            components: body.items,
            userId: user.id,
        });

        return NextResponse.json(bom, { status: 201 });
    } catch (error: any) {
        console.error("[BOM_CREATE_ERROR]", error);

        return NextResponse.json(
            { message: error.message ?? "Failed to create BOM" },
            { status: 400 }
        );
    }
}
