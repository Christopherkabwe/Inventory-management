import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

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


/**
 * Payload shape (ERP-grade, explicit)
 */
type CreateBOMPayload = {
    productId: string;
    version?: number; // optional, auto-incremented if omitted
    status?: "DRAFT" | "ACTIVE" | "ARCHIVED";
    items: {
        componentId: string;
        quantity: number; // precise decimal, > 0
        unit: string;     // e.g. pcs, kg, m
    }[];
};

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json(
                { message: "Unauthorized" },
                { status: 401 }
            );
        }

        const body = (await req.json()) as CreateBOMPayload;

        // -----------------------------
        // Validation (strict)
        // -----------------------------
        if (!body.productId) {
            return NextResponse.json(
                { message: "productId is required" },
                { status: 400 }
            );
        }

        if (!body.items || body.items.length === 0) {
            return NextResponse.json(
                { message: "At least one BOM item is required" },
                { status: 400 }
            );
        }

        for (const item of body.items) {
            if (item.quantity <= 0) {
                return NextResponse.json(
                    { message: "Item quantity must be greater than 0" },
                    { status: 400 }
                );
            }
        }

        // -----------------------------
        // Versioning logic
        // -----------------------------
        const latestBOM = await prisma.bOM.findFirst({
            where: { productId: body.productId },
            orderBy: { version: "desc" },
            select: { version: true },
        });

        const nextVersion =
            body.version ??
            (latestBOM ? Number(latestBOM.version) + 1 : 1);

        // -----------------------------
        // Transaction (atomic)
        // -----------------------------
        const bom = await prisma.$transaction(async (tx) => {
            const createdBOM = await tx.bOM.create({
                data: {
                    productId: body.productId,
                    version: nextVersion,
                    status: body.status ?? "DRAFT",
                    createdById: user.id,
                    items: {
                        create: body.items.map((item) => ({
                            componentId: item.componentId,
                            quantity: item.quantity,
                            unit: item.unit,
                        })),
                    },
                },
                include: {
                    product: true,
                    items: {
                        include: {
                            component: true,
                        },
                    },
                },
            });

            return createdBOM;
        });

        return NextResponse.json(bom, { status: 201 });
    } catch (error) {
        console.error("[BOM_CREATE_ERROR]", error);

        return NextResponse.json(
            { message: "Failed to create BOM" },
            { status: 500 }
        );
    }
}
