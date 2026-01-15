import React from "react";
import { exportCSV, exportPDF, ExportHeader } from "../lib/ExportUtils";

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
            className="px-4 py-2 h-10 mt-6 font-semibold bg-gray-100 border rounded-lg hover:bg-gray-200 cursor-pointer"
        >
            {label || `Export ${type.toUpperCase()}`}
        </button>
    );
}
