"use client";

import { useMemo, useState } from "react";
import { MapPin, ArrowUpDown } from "lucide-react";
import { Sale } from "./Sale";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from "@/components/ui/select";

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
    limit?: number;
}

export default function SalesByLocation({ sales, title, iconColor, limit = 10 }: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [selectedCategory, setSelectedCategory] = useState("all");
    const [selectedProduct, setSelectedProduct] = useState("all");

    // ------------------ Filter Options ------------------
    const categories = useMemo(() => {
        const set = new Set<string>();
        sales.forEach(s => s.product?.category && set.add(s.product.category));
        return Array.from(set).sort();
    }, [sales]);

    const products = useMemo(() => {
        const set = new Set<string>();
        sales.forEach(s => s.product?.name && set.add(s.product.name));
        return Array.from(set).sort();
    }, [sales]);

    // ------------------ Filter Sales ------------------
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const saleDate = new Date(sale.saleDate);
            if (startDate && saleDate < startDate) return false;
            if (endDate && saleDate > endDate) return false;

            if (selectedCategory !== "all" && sale.product?.category !== selectedCategory)
                return false;

            if (selectedProduct !== "all" && sale.product?.name !== selectedProduct)
                return false;

            return true;
        });
    }, [sales, startDate, endDate, selectedCategory, selectedProduct]);

    // ------------------ Aggregate By Location ------------------
    const data = useMemo(() => {
        const map: Record<string, any> = {};

        filteredSales.forEach(sale => {
            const id = sale.locationId;
            const name = sale.location?.name || "Unknown";

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

            const salesValue = sale.totalAmount ?? sale.salePrice * sale.quantity;
            const weight = sale.product?.weightValue || 0;
            const packSize = sale.product?.packSize || 1;
            const tonnage = (weight * sale.quantity * packSize) / 1000;

            map[id].saleCount += 1;
            map[id].quantity += sale.quantity;
            map[id].totalSalesValue += salesValue;
            map[id].totalTonnage += tonnage;
        });

        const totalRevenue = Object.values(map).reduce((sum, loc) => sum + loc.totalSalesValue, 0);

        return Object.values(map).map(loc => ({
            ...loc,
            avgOrderValue: loc.saleCount > 0 ? loc.totalSalesValue / loc.saleCount : 0,
            contribution: totalRevenue > 0 ? (loc.totalSalesValue / totalRevenue) * 100 : 0,
        }));
    }, [filteredSales]);

    // ------------------ Sort ------------------
    const sortedData = useMemo(() => {
        return [...data]
            .sort((a, b) => {
                const aVal = a[sortKey];
                const bVal = b[sortKey];

                if (typeof aVal === "string") {
                    return sortDir === "asc" ? aVal.localeCompare(bVal) : (bVal as string).localeCompare(aVal);
                }

                return sortDir === "asc" ? (aVal as number) - (bVal as number) : (bVal as number) - (aVal as number);
            })
            .slice(0, limit);
    }, [data, sortKey, sortDir, limit]);

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const Header = ({ label, column, align = "left" }: any) => (
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

    // ------------------ Export CSV ------------------
    const exportCSV = () => {
        const headers = ["Location", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "Contribution %"];
        const rows = sortedData.map(d => [
            d.name,
            d.saleCount,
            d.quantity,
            d.totalTonnage.toFixed(2),
            d.avgOrderValue.toFixed(2),
            d.totalSalesValue.toFixed(2),
            d.contribution.toFixed(2),
        ]);

        const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "sales_by_location.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    // ------------------ Export PDF ------------------
    const exportPDF = () => {
        const doc = new jsPDF();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });

        const totals = {
            saleCount: sortedData.reduce((sum, d) => sum + d.saleCount, 0),
            quantity: sortedData.reduce((sum, d) => sum + d.quantity, 0),
            totalTonnage: sortedData.reduce((sum, d) => sum + d.totalTonnage, 0),
            totalSalesValue: sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0),
        };
        totals.avgOrderValue = totals.saleCount > 0 ? totals.totalSalesValue / totals.saleCount : 0;

        autoTable(doc, {
            startY: 30,
            head: [["#", "Location", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "% Share"]],
            body: sortedData.map((d, i) => [
                i + 1,
                d.name,
                d.saleCount,
                d.quantity,
                d.totalTonnage.toFixed(2),
                `K${d.avgOrderValue.toFixed(0)}`,
                `K${d.totalSalesValue.toFixed(0)}`,
                `${d.contribution.toFixed(1)}%`
            ]),
            foot: [["Total", "-", totals.saleCount, totals.quantity, totals.totalTonnage.toFixed(2), `K${totals.avgOrderValue.toFixed(0)}`, `K${totals.totalSalesValue.toFixed(0)}`, "100%"]],
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            footStyles: { fillColor: [100, 100, 100], fontStyle: "bold", textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save("sales_by_location.pdf");
    };

    // ------------------ Render ------------------
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            {/* Filter Bar */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-3">
                <div className="flex gap-2 items-center rounded border bg-gray-50 px-2 py-1 flex-wrap">
                    <label className="flex items-center gap-2 font-medium">
                        Start Date:
                        <input
                            type="date"
                            value={startDate?.toISOString().substring(0, 10) || ""}
                            onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200"
                        />
                    </label>

                    <label className="flex items-center gap-2 font-medium">
                        End Date:
                        <input
                            type="date"
                            value={endDate?.toISOString().substring(0, 10) || ""}
                            onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-200"
                        />
                    </label>
                </div>

                <div className="flex gap-4 rounded border bg-gray-50 px-2 py-1 flex-wrap">
                    <label className="flex items-center gap-2 font-medium">
                        Category:
                        <Select
                            value={selectedCategory}
                            onValueChange={(value) => {
                                setSelectedCategory(value);
                                setSelectedProduct("all");
                            }}
                        >
                            <SelectTrigger className="w-36 h-7 text-xs text-black">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 text-xs text-black w-[inherit] overflow-auto">
                                <SelectItem value="all" className="text-black hover:bg-blue-500 hover:text-white">All Categories</SelectItem>
                                {categories.map(cat => (
                                    <SelectItem key={cat} value={cat} className="text-black hover:bg-blue-500 hover:text-white">{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </label>

                    <label className="flex items-center gap-2 font-medium">
                        Product:
                        <Select
                            value={selectedProduct}
                            onValueChange={(value) => setSelectedProduct(value)}
                        >
                            <SelectTrigger className="w-36 h-7 text-xs text-black">
                                <SelectValue placeholder="All" />
                            </SelectTrigger>
                            <SelectContent className="max-h-60 text-xs text-black w-[inherit] overflow-auto">
                                <SelectItem value="all" className="text-black hover:bg-blue-500 hover:text-white">All Products</SelectItem>
                                {products
                                    .filter(p => selectedCategory === "all" ? true : sales.some(s => s.product?.name === p && s.product?.category === selectedCategory))
                                    .map(product => (
                                        <SelectItem key={product} value={product} className="text-black hover:bg-blue-500 hover:text-white">{product}</SelectItem>
                                    ))}
                            </SelectContent>
                        </Select>
                    </label>
                </div>

                <div className="flex gap-2 items-center">
                    <button onClick={exportCSV} className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-100">Export CSV</button>
                    <button onClick={exportPDF} className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-100">Export PDF</button>
                </div>
            </div>

            {/* Table */}
            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm border border-gray-200 border-collapse">
                    <thead className="sticky top-0 bg-gray-200 z-10 whitespace-nowrap">
                        <tr className="text-gray-600">
                            <th className="py-2 px-3 border-r ">#</th>
                            <Header label="Location" column="name" />
                            <Header label="Orders" column="saleCount" align="right" />
                            <Header label="Quantity" column="quantity" align="right" />
                            <Header label="Tonnage" column="totalTonnage" align="right" />
                            <Header label="Avg Order Value" column="avgOrderValue" align="right" />
                            <Header label="Revenue" column="totalSalesValue" align="right" />
                            <Header label="% Share" column="contribution" align="right" />
                        </tr>
                    </thead>

                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-2 px-3 text-center text-gray-500">
                                    No data available for selected filters
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((loc, index) => (
                                <tr key={loc.id} className={`${index % 2 === 0 ? "bg-white" : "bg-gray-50"} hover:bg-blue-50`}>
                                    <td className="py-2 px-3 border-r text-center font-small">{index + 1}</td>
                                    <td className="py-2 px-3 border-r font-small truncate">{loc.name}</td>
                                    <td className="py-2 px-3 border-r text-center font-small">{loc.saleCount}</td>
                                    <td className="py-2 px-3 border-r text-center font-small">{loc.quantity}</td>
                                    <td className="py-2 px-3 border-r text-center font-small">{loc.totalTonnage.toFixed(2)}</td>
                                    <td className="py-2 px-3 border-r text-center font-small">K{loc.avgOrderValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 text-center font-small">K{loc.totalSalesValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r text-center font-small">{loc.contribution.toFixed(1)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
