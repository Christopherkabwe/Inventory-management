import { prisma } from "@/lib/prisma";
import { NextRequest } from "next/server";
import { nextSequence, incrementSequence } from "@/lib/sequence";

export async function GET(req: NextRequest) {
    try {
        // Generate PROD and BATCH sequences
        const productionNo = await nextSequence("PROD");
        const batchNumber = await nextSequence("BATCH");

        return new Response(
            JSON.stringify({ data: { productionNo, batchNumber } }),
            { headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("Failed to fetch sequence:", err);
        return new Response(
            JSON.stringify({ error: "Failed to fetch sequence" }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
