// app/api/sequences/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const typesParam = req.nextUrl.searchParams.get("types") || "";
        const types = typesParam
            .split(",")
            .map((t) => t.trim())
            .filter((t) => t.length > 0); // Remove empty strings

        if (!types.length) {
            return NextResponse.json({ success: false, error: "No sequence types provided" }, { status: 400 });
        }

        const result: Record<string, string> = {};

        // Use a single transaction to handle all types atomically
        await prisma.$transaction(async (tx) => {
            for (const type of types) {
                const seq = await tx.sequence.upsert({
                    where: { id: type },
                    update: { value: { increment: 1 } },
                    create: { id: type, value: 1 },
                });

                // Format as TYPE000001
                result[type] = `${type}${seq.value.toString().padStart(6, "0")}`;
            }
        });

        return NextResponse.json({ success: true, data: result });
    } catch (err) {
        console.error("Sequence fetch error:", err);
        return NextResponse.json({ success: false, error: "Failed to get sequences" }, { status: 500 });
    }
}
