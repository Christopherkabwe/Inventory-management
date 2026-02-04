import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
/* -------------------------------
   PUT /api/grn/:id
   Update a GRN
   Body: { items: [{ id: string, quantityReceived: number }] }
------------------------------- */
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    const user = getCurrentUser();
    const { id } = await params;

    if (!user) {
        return ('Unauthorized');
    }
    try {
        const { items } = await req.json();

        if (!items?.length) {
            return NextResponse.json({ error: "Items required" }, { status: 400 });
        }

        // Update GRN items: delete existing, then create new
        const updatedGRN = await prisma.gRN.update({
            where: { id },
            data: {
                items: {
                    deleteMany: {}, // remove old items
                    create: items.map((item: any) => ({
                        poItemId: item.id,
                        quantityReceived: item.quantityReceived,
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json(updatedGRN);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to update GRN" }, { status: 500 });
    }
}

/* -------------------------------
   GET /api/grn/:id
   Get GRN by ID
------------------------------- */
export async function GET_BY_ID(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;
    try {
        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: {
                po: { select: { poNumber: true, status: true } },
                items: true,
            },
        });

        if (!grn) {
            return NextResponse.json({ error: "GRN not found" }, { status: 404 });
        }

        return NextResponse.json(grn);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch GRN" }, { status: 500 });
    }
}
