"use client";

import { useState } from "react";
import { StockReportRow } from "@/lib/stockReport";
import Pagination from "./pagination";
import { MultiSelectOption } from "./Dropdowns/MultiSelect";
import { ReportControls } from "./ReportControls";

interface Props {
    report: StockReportRow[];
    pageSize?: number; // optional, default 15
}

// Map raw keys to proper headers
const HEADER_MAP: Record<keyof StockReportRow, string> = {
    productName: "Product Name",
    sku: "SKU",
    category: "Category",
    weightValue: "Weight",
    location: "Location",
    openingStock: "Opening Stock",
    production: "Production",
    ibtReceived: "IBT Received",
    ibtIssued: "IBT Issued",
    rebagGain: "Rebag Gain",
    rebagLoss: "Rebag Loss",
    damaged: "Damaged",
    expired: "Expired",
    returns: "Returns",
    salesQty: "Sales Qty",
    closingStock: "Closing Stock",
};

export default function StockReportTable({ report, pageSize = 15 }: Props) {
    const [sortedReport, setSortedReport] = useState(report);
    const [sortConfig, setSortConfig] = useState<{ key: keyof StockReportRow; ascending: boolean } | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string[]>([]);


    const filteredReport = sortedReport.filter(r =>
        (selectedProducts.length === 0 || selectedProducts.includes(r.productName)) &&
        (selectedLocations.length === 0 || selectedLocations.includes(r.location)) &&
        (selectedCategory.length === 0 || selectedCategory.includes(r.category || ""))
    );

    const totalPages = Math.ceil(filteredReport.length / pageSize);
    const currentData = filteredReport.slice((currentPage - 1) * pageSize, currentPage * pageSize);

    const sortByColumn = (key: keyof StockReportRow) => {
        let ascending = true;
        if (sortConfig?.key === key) {
            ascending = !sortConfig.ascending;
        }
        const sorted = [...sortedReport].sort((a, b) => {
            if (a[key] === b[key]) return 0;
            return a[key] > b[key] ? (ascending ? 1 : -1) : ascending ? -1 : 1;
        });
        setSortedReport(sorted);
        setSortConfig({ key, ascending });
        setCurrentPage(1); // reset to first page on sort
    };

    // Calculate totals
    const totalsRow: Partial<StockReportRow> = {};
    const numericKeys: (keyof StockReportRow)[] = [
        "openingStock",
        "production",
        "ibtReceived",
        "ibtIssued",
        "rebagGain",
        "rebagLoss",
        "damaged",
        "expired",
        "returns",
        "salesQty",
        "closingStock",
    ];

    numericKeys.forEach(key => {
        totalsRow[key] = filteredReport.reduce((sum, r) => sum + (r[key] || 0), 0);
    });

    const productOptions: MultiSelectOption[] = Array.from(
        new Map(sortedReport.map(r => [r.productName, { id: r.productName, name: r.productName }])).values()
    );

    const locationOptions: MultiSelectOption[] = Array.from(
        new Map(sortedReport.map(r => [r.location, { id: r.location, name: r.location }])).values()
    );

    const categoryOptions: MultiSelectOption[] = Array.from(
        new Map(sortedReport.map(r => [r.category, { id: r.category, name: r.category }])).values()
    );


    // Exports Headers

    const headers: ExportHeader<StockReportRow>[] = [
        { key: "productName", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "weightValue", label: "Weight" },
        { key: "location", label: "Location" },
        { key: "openingStock", label: "Opening Stock" },
        { key: "production", label: "Production" },
        { key: "ibtReceived", label: "IBT Received" },
        { key: "ibtIssued", label: "IBT Issued" },
        { key: "rebagGain", label: "Rebag Gain" },
        { key: "rebagLoss", label: "Rebag Loss" },
        { key: "damaged", label: "Damaged" },
        { key: "expired", label: "Expired" },
        { key: "returns", label: "Returns" },
        { key: "salesQty", label: "Sales Qty" },
        { key: "closingStock", label: "Closing Stock" },
    ];

    return (
        <div className="bg-white rounded-lg">
            <div className="flex gap-5">
                <ReportControls
                    productOptions={productOptions}
                    locationOptions={locationOptions}
                    categoryOptions={categoryOptions}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={(vals) => { setSelectedProducts(vals); setCurrentPage(1); }}
                    selectedLocations={selectedLocations}
                    setSelectedLocations={(vals) => { setSelectedLocations(vals); setCurrentPage(1); }}
                    selectedCategory={selectedCategory}
                    setSelectedCategory={(vals) => { setSelectedCategory(vals); setCurrentPage(1); }}
                    headers={headers}
                    data={filteredReport}
                />
            </div>
            <div className="overflow-auto max-h-[700px] p-2">
                <table className="table-auto border-collapse border border-gray-300 w-full">
                    <thead className="bg-gray-200 dark:bg-gray-800 sticky top-0">
                        <tr>
                            {Object.keys(HEADER_MAP).map((key) => {
                                const isSorted = sortConfig?.key === key;
                                const arrow = isSorted
                                    ? sortConfig!.ascending
                                        ? "▲"
                                        : "▼"
                                    : "⇅"; // default arrow

                                return (
                                    <th
                                        key={key}
                                        className="border px-2 py-1 cursor-pointer select-none border border-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                                        onClick={() => sortByColumn(key as keyof StockReportRow)}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span>{HEADER_MAP[key as keyof StockReportRow]}</span>
                                            <span className="ml-1 text-sm">{arrow}</span>
                                        </div>
                                    </th>
                                );
                            })}
                        </tr>
                    </thead>

                    <tbody>
                        {currentData.map((row, i) => (
                            <tr
                                key={i}
                                className={`even:bg-gray-50 dark:even:bg-gray-700 odd:bg-white 
                                    dark:odd:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors`}
                            >
                                {Object.keys(HEADER_MAP).map((key, colIndex) => (
                                    <td
                                        key={key}
                                        className={`border px-4 py-1 whitespace-nowrap ${colIndex < 5 ? "text-left" : "text-right"}`}
                                    >
                                        {(row as any)[key]}
                                    </td>
                                ))}
                            </tr>
                        ))}

                        {/* Totals row */}
                        <tr className="bg-gray-300 dark:bg-gray-600 font-semibold sticky bottom-0 z-10">
                            <td
                                className="border px-4 py-1 text-left whitespace-nowrap"
                                colSpan={4} // spans Product + SKU + Pack Size + Location
                            >
                                Total
                            </td>

                            {Object.keys(HEADER_MAP)
                                .slice(4) // numeric columns start from openingStock
                                .map((key) => (
                                    <td
                                        key={key}
                                        className="border px-4 py-1 text-right whitespace-nowrap"
                                    >
                                        {totalsRow[key as keyof StockReportRow] ?? ""}
                                    </td>
                                ))}
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="mt-2 bg-white p-2">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                />
            </div>
        </div>
    );
}
