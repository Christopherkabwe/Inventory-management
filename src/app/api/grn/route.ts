import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { incrementSequence, nextSequence } from "@/lib/sequence";

/* -------------------------------
   GET /api/grn
------------------------------- */
export async function GET() {
    try {
        const grns = await prisma.gRN.findMany({
            include: {
                location: true, // ⭐ NEW
                po: {
                    select: {
                        poNumber: true,
                        status: true,
                        supplier: true,
                    },
                },
                items: {
                    include: {
                        poItem: {
                            include: {
                                product: true,
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
        return NextResponse.json(
            { error: "Failed to fetch GRNs" },
            { status: 500 }
        );
    }
}

/* -------------------------------
   POST /api/grn
------------------------------- */
export async function POST(req: NextRequest) {
    try {
        const { poId, locationId, items } = await req.json();

        if (!poId || !locationId || !items?.length) {
            return NextResponse.json(
                { error: "PO ID, locationId and items required" },
                { status: 400 }
            );
        }

        // =========================
        // Validate PO
        // =========================
        const po = await prisma.purchaseOrder.findUnique({
            where: { id: poId },
        });

        if (!po) {
            return NextResponse.json(
                { error: "Purchase Order not found" },
                { status: 404 }
            );
        }

        if (po.status === "CANCELLED") {
            return NextResponse.json(
                { error: "Cannot receive against cancelled PO" },
                { status: 400 }
            );
        }

        // =========================
        // Validate Location
        // =========================
        const location = await prisma.location.findUnique({
            where: { id: locationId },
        });

        if (!location) {
            return NextResponse.json(
                { error: "Invalid receiving location" },
                { status: 400 }
            );
        }

        // =========================
        // Generate GRN Number
        // =========================
        const grnNumber = await nextSequence("GRN");

        // =========================
        // Create GRN
        // =========================
        const grn = await prisma.gRN.create({
            data: {
                poId,
                locationId,
                grnNumber,
                status: "DRAFT",
                items: {
                    create: items.map((item: any) => ({
                        poItemId: item.poItemId,
                        quantityReceived: 0,
                    })),
                },
            },
            include: {
                location: true,
                items: true,
            },
        });
        await incrementSequence("GRN")
        return NextResponse.json(grn);

    } catch (err) {
        console.error(err);

        return NextResponse.json(
            { error: "Failed to create GRN" },
            { status: 500 }
        );
    }
}
