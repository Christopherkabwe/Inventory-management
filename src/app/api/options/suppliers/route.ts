// pages/api/suppliers.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/lib/prisma"; // adjust path to your Prisma client

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    try {
        const suppliers = await prisma.supplier.findMany({
            orderBy: { name: "asc" },
        });
        res.status(200).json(suppliers);
    } catch (error) {
        console.error("Error fetching suppliers:", error);
        res.status(500).json({ error: "Failed to fetch suppliers" });
    }
}
