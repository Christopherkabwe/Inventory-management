import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* -------------------------------
   GET /api/grn
   List all GRNs
------------------------------- */
export async function GET() {
    try {
        const grns = await prisma.gRN.findMany({
            include: {
                po: { select: { poNumber: true, status: true, supplier: true } },
                items: {
                    include: {
                        poItem: {
                            include: {
                                product: true, // includes product details
                            },
                        },
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(grns);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch GRNs" }, { status: 500 });
    }
}


/* -------------------------------
   POST /api/grn
   Create a new GRN
   Body: { poId: string, items: [{ id: string, quantityReceived: number }] }
------------------------------- */
export async function POST(req: NextRequest) {
    try {
        const { poId, items } = await req.json();

        if (!poId || !items?.length) {
            return NextResponse.json({ error: "PO ID and items required" }, { status: 400 });
        }

        // Generate GRN number
        const grnNumber = `GRN-${Date.now()}`;

        const grn = await prisma.gRN.create({
            data: {
                poId,
                grnNumber,
                items: {
                    create: items.map((item: any) => ({
                        poItemId: item.poItemId,
                        quantityReceived: item.quantityReceived,
                    })),
                },
            },
            include: { items: true },
        });

        return NextResponse.json(grn);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to create GRN" }, { status: 500 });
    }
}
