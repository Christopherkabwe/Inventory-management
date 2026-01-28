import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ paymentId: string }> }
) {
    const user = await getCurrentUser();
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { paymentId } = await params;

    try {
        const audit = await prisma.allocationAudit.findMany({
            where: { customerPaymentId: paymentId },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json({ audit });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to fetch audit" }, { status: 500 });
    }
}