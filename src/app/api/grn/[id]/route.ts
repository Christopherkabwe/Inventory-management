import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* -------------------------------
   GET /api/grn/:id
   Get GRN by ID with all related data (raw)
------------------------------- */
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const { id } = await params;

    try {
        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: {
                po: {
                    include: {
                        supplier: true,
                        items: { include: { product: true, grnitems: true } },
                    },
                },
                items: {
                    include: {
                        poItem: { include: { product: true } },
                        inventoryHistories: true,
                        supplierReturnItems: true,
                    },
                },
                location: true,
                supplierReturns: {
                    include: {
                        items: {
                            include: {
                                grnItem: {
                                    include: {
                                        poItem: { include: { product: true } },
                                        inventoryHistories: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!grn) {
            return NextResponse.json({ error: "GRN not found" }, { status: 404 });
        }

        // Return raw data without transformation
        return NextResponse.json(grn);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch GRN" }, { status: 500 });
    }
}
