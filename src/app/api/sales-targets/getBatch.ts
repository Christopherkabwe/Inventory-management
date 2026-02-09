import { prisma } from "@/lib/prisma";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const year = Number(searchParams.get("year"));
    const month = searchParams.get("month") ? Number(searchParams.get("month")) : null;
    const locationId = searchParams.get("locationId");

    if (!year || !locationId) return new Response("Missing year or location", { status: 400 });

    const batch = await prisma.salesTargetBatch.findFirst({
        where: { year, month, locationId },
        include: { lines: true }
    });

    return new Response(JSON.stringify(batch), { status: 200 });
}
