import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
            },
            orderBy: { name: "asc" },
        });

        return NextResponse.json(locations);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch locations" }, { status: 500 });
    }
}
