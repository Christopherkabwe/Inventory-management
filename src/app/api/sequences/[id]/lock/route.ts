import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/rbac";

// Lock a sequence (set locked = true)
export async function POST(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (user.role !== UserRole.ADMIN) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        const { id } = await params;
        const { year } = await req.json(); // <-- get the year to lock

        if (!year) return NextResponse.json({ error: "Year is required" }, { status: 400 });

        const sequence = await prisma.sequence.findUnique({
            where: { id_year: { id, year } },
        });

        if (!sequence) return NextResponse.json({ error: "Sequence not found" }, { status: 404 });
        if (sequence.locked) return NextResponse.json({ message: "Already locked" });

        // Lock sequence
        const currentYear = new Date().getFullYear();
        if (year !== currentYear) {
            await prisma.sequence.update({
                where: { id_year: { id, year } },
                data: { locked: true, updatedById: user.id },
            });
        }

        // Audit log
        await prisma.sequenceAudit.create({
            data: {
                sequenceId: sequence.id,
                year: sequence.year,
                oldValue: sequence.value,
                newValue: sequence.value,
                action: "LOCK",
                performedById: user.id,
                reason: `Sequence locked for year ${year}`,
            },
        });

        return NextResponse.json({ success: true, message: `Sequence ${id} for year ${year} locked` });
    } catch (err) {
        return NextResponse.json({ error: (err as Error).message }, { status: 500 });
    }
}
