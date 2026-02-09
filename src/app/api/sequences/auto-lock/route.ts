import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole } from "@/lib/rbac";
import { SequenceAction } from "@/generated/prisma";

export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        if (user.role !== UserRole.ADMIN) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

        const currentYear = new Date().getFullYear();

        // Find sequences not locked and NOT current year
        const sequencesToLock = await prisma.sequence.findMany({
            where: { locked: false, NOT: { year: currentYear } },
        });

        if (sequencesToLock.length === 0) {
            return NextResponse.json({ success: true, lockedCount: 0, message: "No sequences to lock" });
        }

        // Prepare audit log data
        const auditData = sequencesToLock.map(seq => ({
            sequenceId: seq.id,
            year: seq.year,
            oldValue: seq.value,
            newValue: seq.value,
            action: SequenceAction.LOCK,
            performedById: user.id,
            reason: `Auto-locked past year sequence (${seq.year})`,
        }));

        // Lock sequences and create audit logs in a transaction
        await prisma.$transaction([
            ...sequencesToLock.map(seq =>
                prisma.sequence.update({
                    where: { id_year: { id: seq.id, year: seq.year } },
                    data: { locked: true, updatedById: user.id },
                })
            ),
            prisma.sequenceAudit.createMany({
                data: auditData,
                skipDuplicates: true,
            }),
        ]);

        return NextResponse.json({ success: true, lockedCount: sequencesToLock.length });

    } catch (err) {
        console.error("AutoLock failed:", err);
        return NextResponse.json({ error: (err as Error).message || "Auto-lock failed" }, { status: 500 });
    }
}
