import { prisma } from "@/lib/prisma";
import XLSX from "xlsx";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const batchId = searchParams.get("batchId");
    if (!batchId) return new Response("Missing batchId", { status: 400 });

    const batch = await prisma.salesTargetBatch.findUnique({
        where: { id: batchId },
        include: { lines: true }
    });

    const ws = XLSX.utils.json_to_sheet(batch!.lines.map(l => ({
        SalespersonId: l.userId,
        ProductId: l.productId,
        LocationId: l.branchId,
        TargetAmount: l.targetAmount.toString(),
        Notes: l.notes
    })));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Targets");

    const buf = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

    return new Response(buf, {
        status: 200,
        headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }
    });
}
