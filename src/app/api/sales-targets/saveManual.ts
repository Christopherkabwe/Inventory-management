import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const body = await req.json();
    const { batchId, lines } = body;

    if (!batchId || !lines?.length) return new Response("Missing data", { status: 400 });

    const savedLines = [];
    for (const line of lines) {
        const updated = await prisma.salesTargetLine.upsert({
            where: { id: line.id || "" },
            create: {
                batchId,
                userId: line.userId,
                productId: line.productId,
                branchId: line.branchId,
                targetAmount: line.targetAmount,
                notes: line.notes || ""
            },
            update: {
                targetAmount: line.targetAmount,
                notes: line.notes || ""
            }
        });
        savedLines.push(updated);
    }

    return new Response(JSON.stringify(savedLines), { status: 200 });
}
