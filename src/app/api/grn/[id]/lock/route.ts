import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
    req: Request,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const grn = await prisma.gRN.findUnique({
            where: { id },
            include: { items: true }
        });

        if (!grn)
            return NextResponse.json(
                { error: "GRN not found" },
                { status: 404 }
            );

        if (grn.locked)
            return NextResponse.json(
                { error: "GRN already locked" },
                { status: 400 }
            );

        const hasActivity = grn.items.some(
            i => i.quantityReceived > 0 || i.returnedQuantity > 0
        );

        if (!hasActivity)
            return NextResponse.json(
                { error: "Cannot lock empty GRN" },
                { status: 400 }
            );

        await prisma.gRN.update({
            where: { id: grn.id },
            data: {
                status: "CLOSED",
                locked: true
            }
        });

        return NextResponse.json({ success: true });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { error: "Failed to lock GRN" },
            { status: 500 }
        );
    }
}
