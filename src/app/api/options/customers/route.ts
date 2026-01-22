import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        // Fetch all customers details
        const customers = await prisma.customer.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(customers);
    } catch (err) {
        console.error(err);
        return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }
}
