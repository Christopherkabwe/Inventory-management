import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ---------------- Confirm Production ----------------
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const production = await prisma.production.findUnique({ where: { id } });
    if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    if (production.status !== "DRAFT") return NextResponse.json({ error: "Only DRAFT productions can be confirmed", status: 400 });

    const updated = await prisma.production.update({ where: { id: production.id }, data: { status: "CONFIRMED" } });
    return NextResponse.json({ data: updated });
}