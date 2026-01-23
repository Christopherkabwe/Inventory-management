import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch all transporters, ordered by name
        const transporters = await prisma.transporter.findMany({
            orderBy: { name: "asc" },
        });

        // Remove duplicates by name
        const uniqueTransporters = Array.from(
            new Map(transporters.map(t => [t.name, t])).values()
        );

        return NextResponse.json(uniqueTransporters);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch transporters" }, { status: 500 });
    }
}
