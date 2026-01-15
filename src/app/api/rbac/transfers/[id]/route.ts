import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

/* ===================== UPDATE TRANSFER ===================== */
export async function PUT(
    req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await req.json();

        const {
            productId,
            fromLocationId,
            toLocationId,
            quantity,
        } = body;

        if (!productId || !fromLocationId || !toLocationId || quantity <= 0) {
            return NextResponse.json(
                { message: "Invalid payload" },
                { status: 400 }
            );
        }

        const existing = await prisma.transfer.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Transfer not found" },
                { status: 404 }
            );
        }

        const updatedTransfer = await prisma.transfer.update({
            where: { id },
            data: {
                productId,
                fromLocationId,
                toLocationId,
                quantity,
            },
        });

        return NextResponse.json({
            message: "Transfer updated successfully",
            transfer: updatedTransfer,
        });
    } catch (error) {
        console.error("PUT /transfers/[id] error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}

/* ===================== DELETE TRANSFER ===================== */
export async function DELETE(
    _req: Request,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const existing = await prisma.transfer.findUnique({
            where: { id },
        });

        if (!existing) {
            return NextResponse.json(
                { message: "Transfer not found" },
                { status: 404 }
            );
        }

        await prisma.transfer.delete({
            where: { id },
        });

        return NextResponse.json({
            message: "Transfer deleted successfully",
        });
    } catch (error) {
        console.error("DELETE /transfers/[id] error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
