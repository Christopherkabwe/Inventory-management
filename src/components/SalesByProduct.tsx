"use client";

import { useMemo, useState } from "react";
import { Package, ArrowUpDown } from "lucide-react";
import { Sale } from "./Sale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

type SortKey =
    | "name"
    | "saleCount"
    | "quantity"
    | "totalTonnage"
    | "totalSalesValue"
    | "avgOrderValue"
    | "contribution";

interface Props {
    sales: Sale[];
    title: string;
    iconColor: string;
}

export default function SalesByProduct({
    sales,
    title,
    iconColor,
}: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    /** ------------------ FILTER SALES ------------------ */
    // Filters
    const [selectedLocation, setSelectedLocation] = useState<string>("all");
    const [selectedCategory, setSelectedCategory] = useState<string>("all");

    const locations = useMemo(() => {
        const set = new Set<string>();
        sales.forEach(sale => {
            if (sale.location?.name) {
                set.add(sale.location.name);
            }
        });
        return Array.from(set).sort();
    }, [sales]);

    const categories = useMemo(() => {
        const set = new Set<string>();
        sales.forEach(sale => {
            if (sale.product?.category) {
                set.add(sale.product.category);
            }
        });
        return Array.from(set).sort();
    }, [sales]);

    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);

            if (startDate && saleDate < startDate) return false;
            if (endDate && saleDate > endDate) return false;

            if (
                selectedLocation !== "all" &&
                sale.location?.name !== selectedLocation
            ) {
                return false;
            }

            if (
                selectedCategory !== "all" &&
                sale.product?.category !== selectedCategory
            ) {
                return false;
            }

            return true;
        });
    }, [sales, startDate, endDate, selectedLocation, selectedCategory]);


    /** ------------------ AGGREGATE BY PRODUCT ------------------ */
    const data = useMemo(() => {
        const map: Record<string, any> = {};

        filteredSales.forEach(sale => {
            const id = sale.productId;
            const name = sale.product?.name || "Unknown Product";

            if (!map[id]) {
                map[id] = {
                    id,
                    name,
                    saleCount: 0,
                    quantity: 0,
                    totalTonnage: 0,
                    totalSalesValue: 0,
                    avgOrderValue: 0,
                    contribution: 0,
                };
            }

            const salesValue =
                sale.totalAmount ?? sale.salePrice * sale.quantity;

            const weight = sale.product?.weightValue || 0;
            const packSize = sale.product?.packSize || 1;
            const tonnage = (weight * sale.quantity * packSize) / 1000;

            map[id].saleCount += 1;
            map[id].quantity += sale.quantity;
            map[id].totalSalesValue += salesValue;
            map[id].totalTonnage += tonnage;
        });

        const totalRevenue = Object.values(map).reduce(
            (sum: number, p: any) => sum + p.totalSalesValue,
            0
        );

        return Object.values(map).map((p: any) => ({
            ...p,
            avgOrderValue:
                p.saleCount > 0 ? p.totalSalesValue / p.saleCount : 0,
            contribution:
                totalRevenue > 0
                    ? (p.totalSalesValue / totalRevenue) * 100
                    : 0,
        }));
    }, [filteredSales]);

    /** ------------------ SORT ------------------ */
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (typeof aVal === "string") {
                return sortDir === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [data, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const Header = ({
        label,
        column,
        align = "left",
    }: {
        label: string;
        column: SortKey;
        align?: "left" | "right";
    }) => (
        <th
            onClick={() => toggleSort(column)}
            className={`py-2 px-3 cursor-pointer border-r hover:text-blue-600 ${align === "right" ? "text-right" : "text-left"
                }`}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown className="w-3 h-3 opacity-60" />
            </span>
        </th>
    );
    // Export to csv
    const exportCSV = () => {
        const headers = [
            "Location",
            "Orders",
            "Quantity",
            "Tonnage",
            "Avg Order Value",
            "Revenue",
            "Contribution %",
        ];

        const rows = sortedData.map(l => [
            l.name,
            l.saleCount,
            l.quantity,
            l.totalTonnage.toFixed(2),
            l.avgOrderValue.toFixed(2),
            l.totalSalesValue.toFixed(2),
            l.contribution.toFixed(2),
        ]);

        const csv = [headers, ...rows]
            .map(r => r.join(","))
            .join("\n");

        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "sales_by_location.csv";
        a.click();

        URL.revokeObjectURL(url);
    };

    // Inside your component
    const exportPDF = (startDate?: Date, endDate?: Date) => {
        const doc = new jsPDF(); // portrait

        // Format dates
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";

        // Title at the top
        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        // Date range below title
        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });

        // Totals calculation
        const totals = {
            saleCount: sortedData.reduce((sum, d) => sum + d.saleCount, 0),
            quantity: sortedData.reduce((sum, d) => sum + d.quantity, 0),
            totalTonnage: sortedData.reduce((sum, d) => sum + d.totalTonnage, 0),
            totalSalesValue: sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0),
        };
        totals.avgOrderValue = totals.saleCount > 0 ? totals.totalSalesValue / totals.saleCount : 0;

        // Table
        autoTable(doc, {
            startY: 30, // start a bit lower so title/date are visible
            head: [[
                "#", "Location", "Orders", "Quantity", "Tonnage (t)",
                "Avg Order Value", "Revenue", "% Share"
            ]],
            body: sortedData.map((loc, index) => [
                index + 1,
                loc.name,
                loc.saleCount,
                loc.quantity,
                loc.totalTonnage.toFixed(2),
                `K${loc.avgOrderValue.toFixed(0)}`,
                `K${loc.totalSalesValue.toFixed(0)}`,
                `${loc.contribution.toFixed(1)}%`
            ]),
            foot: [[
                "Total",
                "-",
                totals.saleCount,
                totals.quantity,
                totals.totalTonnage.toFixed(2),
                `K${totals.avgOrderValue.toFixed(0)}`,
                `K${totals.totalSalesValue.toFixed(0)}`,
                "100%"
            ]],
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            footStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save("sales_by_location.pdf");
    };

    /** ------------------ RENDER ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            <div className="flex flex-wrap justify-between items-center mb-4">
                {/* Left side: Date pickers */}
                <div className="flex gap-2 items-center rounded border bg-gray-30 px-2 py-1">
                    <label className="flex items-center gap-2 font-medium">
                        Start Date:
                        <input
                            type="date"
                            value={startDate ? startDate.toISOString().substring(0, 10) : ""}
                            onChange={(e) =>
                                setStartDate(e.target.value ? new Date(e.target.value) : null)
                            }
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer"
                        />
                    </label>

                    <label className="flex items-center gap-2 font-medium">
                        End Date:
                        <input
                            type="date"
                            value={endDate ? endDate.toISOString().substring(0, 10) : ""}
                            onChange={(e) =>
                                setEndDate(e.target.value ? new Date(e.target.value) : null)
                            }
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer "
                        />
                    </label>
                </div>
                <div className="flex gap-5 rounded border px-2 py-1 flex-wrap">
                    <label className="flex items-center gap-2 font-medium">
                        Select Location:
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer"
                        >
                            <option value="all">All</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-2 font-medium">
                        Select Category:
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer"
                        >
                            <option value="all">All</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                {/* Right side: Export buttons */}
                <div className="flex gap-2 items-center">
                    <button
                        onClick={exportCSV}
                        className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-200"
                    >
                        Export CSV
                    </button>

                    <button
                        onClick={() => exportPDF(startDate ?? undefined, endDate ?? undefined)}
                        className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-200"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center font-small">#</th>
                            <th className="py-2 border-r text-left font-small">Product Name</th>
                            <th className="py-2 px-3 border-r text-center font-small">Orders</th>
                            <th className="py-2 px-3 border-r text-center font-small">Quantity</th>
                            <th className="py-2 px-3 border-r text-center font-small">Tonnage</th>
                            <th className="py-2 border-r text-center font-small">Avg Order Value</th>
                            <th className="py-2 px-3 border-r text-center font-small">Revenue</th>
                            <th className="py-2 px-3 border-r text-center font-small">% Share</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="py-6 text-center text-gray-500 italic"
                                >
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            <>
                                {sortedData.map((p, i) => (
                                    <tr key={p.id} className={i % 2 ? "bg-gray-50" : ""}>
                                        <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                        <td className="py-2 px-3 border-r truncate">{p.name}</td>
                                        <td className="py-2 px-3 border-r text-center">{p.saleCount}</td>
                                        <td className="py-2 px-3 border-r text-center">{p.quantity}</td>
                                        <td className="py-2 px-3 border-r text-center">
                                            {p.totalTonnage.toFixed(2)}
                                        </td>
                                        <td className="py-2 px-3 border-r text-center">
                                            K{p.avgOrderValue.toFixed(0)}
                                        </td>
                                        <td className="py-2 px-3 border-r text-center">
                                            K{p.totalSalesValue.toFixed(0)}
                                        </td>
                                        <td className="py-2 px-3 border-r text-center">
                                            {p.contribution.toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}

                                {/* TOTAL ROW */}
                                <tr className="bg-gray-200 font-bold">
                                    <td className="py-2 px-3 border-r text-center">Total</td>
                                    <td className="py-2 px-3 border-r">-</td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData.reduce((sum, d) => sum + d.saleCount, 0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData.reduce((sum, d) => sum + d.quantity, 0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData
                                            .reduce((sum, d) => sum + d.totalTonnage, 0)
                                            .toFixed(2)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        K{(
                                            sortedData.reduce((s, d) => s + d.totalSalesValue, 0) /
                                            Math.max(
                                                sortedData.reduce((s, d) => s + d.saleCount, 0),
                                                1
                                            )
                                        ).toFixed(0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        K{sortedData
                                            .reduce((sum, d) => sum + d.totalSalesValue, 0)
                                            .toFixed(0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">100%</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
