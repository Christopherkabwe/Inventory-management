import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
            },
            orderBy: { fullName: "asc" },
        });

        const options = users.map(u => ({ id: u.id, name: u.fullName || "Unnamed User" }));

        return NextResponse.json(options);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
