import { prisma } from "@/lib/prisma";
import XLSX from "xlsx";

export async function POST(req: Request) {
    const data = await req.formData();
    const file = data.get("file") as File;

    if (!file) return new Response("No file uploaded", { status: 400 });

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const batchId = data.get("batchId") as string;

    const createdLines = [];
    for (const row of rows) {
        const line = await prisma.salesTargetLine.create({
            data: {
                batchId,
                userId: row["SalespersonId"],
                productId: row["ProductId"],
                branchId: row["LocationId"],
                targetAmount: Number(row["TargetAmount"]),
                notes: row["Notes"] || ""
            }
        });
        createdLines.push(line);
    }

    return new Response(JSON.stringify(createdLines), { status: 200 });
}
