import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

// ---------------- Lock Production ----------------
export async function POST(
    req: NextRequest,
    context: { params: Promise<{ id: string }> }
) {
    const { id } = await context.params;

    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const production = await prisma.production.findUnique({ where: { id } });
    if (!production) return NextResponse.json({ error: "Production not found" }, { status: 404 });
    if (production.status !== "CONFIRMED") return NextResponse.json({ error: "Only CONFIRMED productions can be locked", status: 400 });

    const updated = await prisma.production.update({ where: { id: production.id }, data: { status: "LOCKED" } });
    return NextResponse.json({ data: updated });
}