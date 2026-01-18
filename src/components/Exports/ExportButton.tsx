import React from "react";
import { exportCSV, exportPDF, ExportHeader } from "../../lib/ExportUtils";

interface ExportButtonProps<T> {
    type: "csv" | "pdf";
    headers: ExportHeader<T>[];
    data: T[];
    filename?: string;       // optional file name
    label?: string;          // button label
    title?: string;          // optional PDF title
    mode?: "portrait" | "landscape"; // optional PDF orientation
}

export function ExportButton<T>({
    type,
    headers,
    data,
    filename,
    label,
    title,
    mode = "portrait",
}: ExportButtonProps<T>) {
    const handleClick = () => {
        if (type === "csv") {
            exportCSV(headers, data, filename || "report.csv");
        } else {
            exportPDF(headers, data, filename || "report.pdf", title || "Report", mode);
        };
    }
    return (
        <button
            onClick={handleClick}
            className="px-4 py-2 h-10 font-semibold bg-gray-100 border rounded-lg hover:bg-gray-200 cursor-pointer"
        >
            {label || `Export ${type.toUpperCase()}`}
        </button>
    );
}



{/*
    HOW TO USE EXPORTS
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";

const exportHeaders: ExportHeader<InventoryRow>[] = [
  { key: "date", label: "Date" },
  { key: "product", label: "Product" },
  { key: "sku", label: "SKU" },
  { key: "packSize", label: "Pack Size" },
  { key: "weightUnit", label: "UoM" },
  { key: "weightValue", label: "Weight" },
  { key: "category", label: "Category" },
  { key: "locationName", label: "Location" },
  { key: "delta", label: "Δ Qty" },
  { key: "balance", label: "Balance" },
  { key: "tonnage", label: "Tonnage (t)" },
  { key: "reference", label: "Reference" },
];

<div className="flex gap-3 mt-4">
                    <ExportButton
                        type="csv"
                        headers={exportHeaders}
                        data={filteredRows}
                        filename="inventory-stock.csv"
                        label="Export CSV"
                    />

                    <ExportButton
                        type="pdf"
                        headers={exportHeaders}
                        data={filteredRows}
                        filename="inventory-stock.pdf"
                        title="Inventory Stock Report"
                        mode="landscape"
                        label="Export PDF"
                    />
    </div>
*/}