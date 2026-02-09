import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { batchId, userId } = await req.json();

    if (!batchId || !userId) return new Response("Missing batchId or userId", { status: 400 });

    const updated = await prisma.salesTargetBatch.update({
        where: { id: batchId },
        data: { status: "APPROVED" }
    });

    return new Response(JSON.stringify(updated), { status: 200 });
}
