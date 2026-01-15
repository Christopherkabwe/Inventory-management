// lib/exportUtils.ts
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type ExportHeader<T> = {
    key: keyof T;
    label: string;
};

/**
 * Export CSV with optional number formatting
 */
export function exportCSV<T>(
    headers: ExportHeader<T>[],
    data: T[],
    filename = "report.csv"
) {
    const csvHeader = headers.map(h => h.label).join(",");
    const rows = data.map(row =>
        headers.map(h => {
            const value = row[h.key];
            if (typeof value === "number") return value.toFixed(2);
            return value ?? "";
        }).join(",")
    );

    const csvContent = [csvHeader, ...rows].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * Export PDF with optional title, styling, and orientation
 */


export function exportPDF<T>(
    headers: ExportHeader<T>[],
    data: T[],
    filename = "report.pdf",
    title?: string,
    orientation: "portrait" | "landscape" = "portrait"
) {
    const doc = new jsPDF({ orientation });

    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 14;

    if (title) {
        doc.setFontSize(14);
        doc.text(title, margin, 15);
    }

    // Calculate max column width (simple auto-fit based on page width)
    const tableWidth = pageWidth - margin * 2;
    const colWidth = tableWidth / headers.length;

    autoTable(doc, {
        startY: title ? 20 : 10,
        head: [headers.map(h => h.label)],
        body: data.map(row =>
            headers.map(h => {
                const value = row[h.key];
                if (typeof value === "number") return value.toFixed(2);
                return value ?? "";
            })
        ),
        styles: {
            fontSize: 8,
            cellWidth: colWidth,       // allow wrapping within column
            overflow: 'linebreak',     // wrap long text
        },
        headStyles: {
            fontSize: 10, // fixed
            fillColor: [100, 150, 250],
            textColor: 255,
            fontStyle: 'bold',
            cellWidth: colWidth,
            overflow: 'linebreak',
        },
        columnStyles: headers.reduce((acc, _, idx) => {
            acc[idx] = { cellWidth: colWidth, overflow: 'linebreak' };
            return acc;
        }, {} as Record<number, { cellWidth: number; overflow: string }>),
        theme: 'grid',
        tableWidth: tableWidth,
        willDrawCell: (data) => {
            if (data.section === 'body') {
                const colWidth = (doc.internal.pageSize.getWidth() - 28) / headers.length;
                const maxWidth = colWidth - 4;
                const cellText = data.cell.text.join(" ");
                const textWidth = doc.getTextWidth(cellText);
                if (textWidth > maxWidth) {
                    data.cell.styles.fontSize = Math.max(6, (maxWidth / textWidth) * 10);
                }
            }
        }
    });

    doc.save(filename);
}