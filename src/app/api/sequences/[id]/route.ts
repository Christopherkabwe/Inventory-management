import { NextResponse, NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/rbac";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // RBAC: Admin only
        if (user.role !== "ADMIN") {
            return NextResponse.json(
                { error: "Forbidden: Admin only" },
                { status: 403 }
            );
        }

        const sequences = await prisma.sequence.findMany({
            orderBy: [{ id: "asc" }, { year: "desc" }],
        });

        return NextResponse.json(sequences);

    } catch (error) {
        console.error("Failed to fetch sequences:", error);
        return NextResponse.json(
            { error: "Failed to fetch sequences" },
            { status: 500 }
        );
    }
}

// Reset a sequence at year boundary
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    const { id } = await params;
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { year } = await req.json();
        if (!year) return NextResponse.json({ error: "Year is required" }, { status: 400 });

        const existing = await prisma.sequence.findUnique({
            where: { id_year: { id, year } },
        });

        if (existing) return NextResponse.json({ error: "Sequence already exists for this year" }, { status: 400 });

        // Get last sequence (previous year)
        const prevYear = year - 1;
        const prevSequence = await prisma.sequence.findUnique({
            where: { id_year: { id, year: prevYear } },
        });

        if (!prevSequence) return NextResponse.json({ error: "Previous year sequence not found" }, { status: 404 });
        if (prevSequence.locked === false) return NextResponse.json({ error: "Cannot reset unlocked previous year sequence" }, { status: 400 });

        // Create new sequence for new year
        const newSequence = await prisma.sequence.create({
            data: {
                id,
                year,
                value: 0,
                locked: false,
                lastResetAt: new Date(),
                updatedById: user.id,
            },
        });

        // Audit log
        await prisma.sequenceAudit.create({
            data: {
                sequenceId: newSequence.id,
                year: newSequence.year,
                oldValue: 0,
                newValue: 0,
                action: "RESET",
                performedById: user.id,
                reason: `Reset for financial year ${year}`,
            },
        });

        return NextResponse.json({ success: true, sequence: newSequence });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
