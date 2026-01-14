import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export async function GET() {
    const data = await prisma.productionItem.findMany({
        include: {
            product: true,
            production: {
                include: { location: true },
            },
        },
        orderBy: {
            updatedAt: "desc",
        },
    });

    console.log("Exporting production report with items:", data.length);

    const doc = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: "A4",
    });

    // Title
    doc.setFontSize(14);
    doc.text("Production Report", 40, 40);

    autoTable(doc, {
        startY: 60,
        head: [[
            "Production No",
            "Batch",
            "Product",
            "SKU",
            "Quantity",
            "Location",
            "Date",
        ]],
        body: data.map(d => [
            d.production.productionNo,
            d.production.batchNumber,
            d.product.name,
            d.product.sku,
            d.quantity,
            d.production.location.name,
            new Date(d.production.createdAt).toLocaleDateString(),
        ]),
        styles: {
            fontSize: 9,
            cellPadding: 4,
        },
        headStyles: {
            fillColor: [240, 240, 240],
            textColor: 20,
        },
    });

    const pdfBuffer = Buffer.from(doc.output("arraybuffer"));

    return new NextResponse(pdfBuffer, {
        headers: {
            "Content-Type": "application/pdf",
            "Content-Disposition": "attachment; filename=production-report.pdf",
        },
    });
}
