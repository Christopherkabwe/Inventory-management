"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export type Column<T> = {
    key: keyof T;
    label: string;
    align?: "left" | "center" | "right";
    isNumeric?: boolean;
};

interface DataTableProps<T> {
    title: string;
    icon?: React.ReactNode;
    data: T[];
    columns: Column<T>[];
    dateFilter?: boolean;
    exportCSVName?: string;
    exportPDFName?: string;
    calculateTotals?: (data: T[]) => Partial<T>;
}

export function DataTable<T extends Record<string, any>>({
    title,
    icon,
    data,
    columns,
    dateFilter = false,
    exportCSVName = "data.csv",
    exportPDFName = "data.pdf",
    calculateTotals,
}: DataTableProps<T>) {
    const [sortKey, setSortKey] = useState<keyof T | null>(null);
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const toggleSort = (key: keyof T) => {
        if (sortKey === key) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("asc");
        }
    };

    const filteredData = useMemo(() => {
        return data.filter((item: any) => {
            if (!dateFilter) return true;
            const date = new Date(item.saleDate);
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;
            return true;
        });
    }, [data, startDate, endDate, dateFilter]);

    const sortedData = useMemo(() => {
        if (!sortKey) return filteredData;
        return [...filteredData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortDir === "asc" ? (aVal || 0) - (bVal || 0) : (bVal || 0) - (aVal || 0);
        });
    }, [filteredData, sortKey, sortDir]);

    const exportCSV = () => {
        const headers = columns.map(c => c.label);
        const rows = sortedData.map(row => columns.map(c => row[c.key]));
        const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = exportCSVName;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.setFontSize(16);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
        if (dateFilter) {
            const start = startDate ? startDate.toLocaleDateString() : "N/A";
            const end = endDate ? endDate.toLocaleDateString() : "N/A";
            doc.setFontSize(10);
            doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });
        }

        autoTable(doc, {
            startY: 30,
            head: [columns.map(c => c.label)],
            body: sortedData.map((row, i) => columns.map(c => row[c.key])),
            foot: calculateTotals ? [columns.map(c => calculateTotals(sortedData)[c.key] ?? (c.isNumeric ? 0 : "-"))] : undefined,
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            footStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save(exportPDFName);
    };

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold text-lg flex items-center gap-2">{icon} {title}</h3>
                <div className="flex gap-2 items-center">
                    {dateFilter && (
                        <div className="flex gap-2 items-center">
                            <label className="flex items-center gap-2 font-medium">
                                Start Date:
                                <input type="date" value={startDate ? startDate.toISOString().substring(0, 10) : ""} onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)} className="border rounded px-2 py-1 text-sm" />
                            </label>
                            <label className="flex items-center gap-2 font-medium">
                                End Date:
                                <input type="date" value={endDate ? endDate.toISOString().substring(0, 10) : ""} onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)} className="border rounded px-2 py-1 text-sm" />
                            </label>
                        </div>
                    )}
                    <button onClick={exportCSV} className="px-3 py-1 border rounded hover:bg-gray-100">CSV</button>
                    <button onClick={exportPDF} className="px-3 py-1 border rounded hover:bg-gray-100">PDF</button>
                </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm border border-gray-200 border-collapse">
                    <thead className="sticky top-0 bg-gray-200 z-10">
                        <tr>
                            {columns.map(c => (
                                <th key={String(c.key)} className={`py-2 px-3 border-r ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"} cursor-pointer`} onClick={() => toggleSort(c.key)}>
                                    {c.label}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((row, i) => (
                            <tr key={i} className={`${i % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                                {columns.map(c => (
                                    <td key={String(c.key)} className={`py-2 px-3 border-r ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}>
                                        {row[c.key]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                    {calculateTotals && (
                        <tfoot>
                            <tr className="bg-gray-200 font-bold">
                                {columns.map(c => (
                                    <td key={String(c.key)} className={`py-2 px-3 border-r ${c.align === "right" ? "text-right" : c.align === "center" ? "text-center" : "text-left"}`}>
                                        {calculateTotals(sortedData)[c.key] ?? (c.isNumeric ? 0 : "-")}
                                    </td>
                                ))}
                            </tr>
                        </tfoot>
                    )}
                </table>
            </div>
        </div>
    );
}
