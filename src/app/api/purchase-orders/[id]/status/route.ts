import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ================= STATUS FLOW ================= */

const STATUS_FLOW = ["DRAFT", "SUBMITTED", "APPROVED", "SENT", "RECEIVED"] as const;
type POStatus = typeof STATUS_FLOW[number] | "CANCELLED";

/* ================= VALIDATE TRANSITION ================= */

function canTransition(current: POStatus, next: POStatus) {
    if (next === "CANCELLED") return true; // allow cancel anytime

    const currentIndex = STATUS_FLOW.indexOf(current as any);
    const nextIndex = STATUS_FLOW.indexOf(next as any);

    return nextIndex === currentIndex + 1;
}

/* ================= ROUTE ================= */

export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const { status } = await req.json();

        if (!status) {
            return NextResponse.json(
                { error: "Status is required" },
                { status: 400 }
            );
        }

        /* ===== Fetch Current PO ===== */

        const existingPO = await prisma.purchaseOrder.findUnique({
            where: { id },
            select: { status: true },
        });

        if (!existingPO) {
            return NextResponse.json(
                { error: "Purchase Order not found" },
                { status: 404 }
            );
        }

        const currentStatus = existingPO.status as POStatus;
        if (currentStatus === "CANCELLED") {
            return NextResponse.json(
                { error: "Cancelled POs cannot be modified" },
                { status: 400 }
            );
        }
        const nextStatus = status as POStatus;

        /* ===== Validate Status ===== */

        if (
            !STATUS_FLOW.includes(nextStatus as any) &&
            nextStatus !== "CANCELLED"
        ) {
            return NextResponse.json(
                { error: "Invalid status" },
                { status: 400 }
            );
        }

        /* ===== Validate Transition ===== */

        if (!canTransition(currentStatus, nextStatus)) {
            return NextResponse.json(
                {
                    error: `Invalid status transition from ${currentStatus} → ${nextStatus}`,
                },
                { status: 400 }
            );
        }

        /* ===== Update ===== */

        const po = await prisma.purchaseOrder.update({
            where: { id },
            data: { status: nextStatus },
        });

        return NextResponse.json(po);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to update status" },
            { status: 500 }
        );
    }
}