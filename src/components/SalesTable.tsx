
"use client";
import { useMemo, useState } from "react";
import { MapPin, User, Package, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";
import { Sale } from "./Sale";
import { useRef, useEffect } from 'react';
import ViewSelector from "./ViewSelector";
import DateFiltersExports from "./DateFiltersExports";


interface Props {
    sales: Sale[];
}

type View = "location" | "customer" | "product";
type SortKey =
    | "name"
    | "saleCount"
    | "quantity"
    | "totalTonnage"
    | "totalSalesValue"
    | "avgOrderValue"
    | "contribution";

export default function SalesTable({ sales }: Props) {
    const [view, setView] = useState<View>("location");
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);

    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);

    const locationRef = useRef(null);
    const categoryRef = useRef(null);
    const productRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocations(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategories(false);
            }
            if (productRef.current && !productRef.current.contains(event.target)) {
                setShowProducts(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

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
            className={`py-2 px-3 cursor-pointer border-r ${align === "right" ? "text-right" : "text-left"
                }`}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown className="w-3 h-3 opacity-60" />
            </span>
        </th>
    );

    const locations = useMemo(
        () =>
            Array.from(
                new Map(
                    sales
                        .filter((s) => s.location)
                        .map((s) => [s.locationId, s.location])
                ).values()
            ),
        [sales]
    );

    const categories = useMemo(() => {
        const set = new Set<string>();
        sales.forEach((s) => s.product?.category && set.add(s.product.category));
        return Array.from(set).sort();
    }, [sales]);

    const products = useMemo(
        () =>
            Array.from(
                new Map(
                    sales
                        .filter((s) => s.product)
                        .map((s) => [s.product.id, { ...s.product, category: s.product.category }])
                ).values()
            ),
        [sales]
    );

    const filteredSales = useMemo(() => {
        if (!Array.isArray(sales)) return [];
        return sales.filter((sale) => {
            const saleDate = new Date(sale.saleDate);
            if (startDate && saleDate < startDate) return false;
            if (endDate && saleDate > endDate) return false;
            if (
                selectedLocations.length > 0 &&
                !selectedLocations.includes(sale.locationId)
            )
                return false;
            if (
                selectedCategories.length > 0 &&
                !selectedCategories.includes(sale.product?.category)
            )
                return false;
            if (
                selectedProducts.length > 0 &&
                !selectedProducts.includes(sale.productId)
            )
                return false;
            return true;
        });
    }, [
        sales,
        startDate,
        endDate,
        selectedLocations,
        selectedCategories,
        selectedProducts,
    ]);

    const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));
    const categoryOptions = categories.map((c) => ({ value: c, label: c }));
    const productOptions = products.map((p) => ({ value: p.id, label: p.name, category: p.category }));

    const aggregatedData = useMemo(() => {
        const map: Record<string, any> = {};
        filteredSales.forEach((sale) => {
            let id: string, name: string;
            if (view === "location") {
                id = sale.locationId;
                name = sale.location?.name || "Unknown Location";
            } else if (view === "customer") {
                id = sale.customerId;
                name = sale.customerName || "Unknown Customer";
            } else {
                id = sale.productId;
                name = sale.product?.name || "Unknown Product";
            }
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
            const weightKg = unitToKg(
                sale.product?.weightValue || 0,
                sale.product?.weightUnit
            );

            const tonnage =
                (weightKg * sale.quantity * (sale.product?.packSize || 1)) / 1000;
            map[id].saleCount += 1;
            map[id].quantity += sale.quantity;
            map[id].totalSalesValue += salesValue;
            map[id].totalTonnage += tonnage;
        });

        const totalRevenue = Object.values(map).reduce(
            (sum: number, d: any) => sum + d.totalSalesValue,
            0
        );
        return Object.values(map).map((d: any) => ({
            ...d,
            avgOrderValue: d.saleCount ? d.totalSalesValue / d.saleCount : 0,
            contribution: totalRevenue ? (d.totalSalesValue / totalRevenue) * 100 : 0,
        }));
    }, [filteredSales, view]);

    const sortedData = useMemo(() => {
        return [...aggregatedData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === "string")
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [aggregatedData, sortKey, sortDir]);

    const exportCSV = () => {
        const headers = ["Name", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "% Share"];
        const rows = sortedData.map((d) => [
            d.name,
            d.saleCount,
            d.quantity,
            d.totalTonnage.toFixed(2),
            d.avgOrderValue.toFixed(2),
            d.totalSalesValue.toFixed(2),
            d.contribution.toFixed(2),
        ]);

        // Add total row
        const totalRow = [
            "Total",
            sortedData.reduce((sum, d) => sum + d.saleCount, 0),
            sortedData.reduce((sum, d) => sum + d.quantity, 0),
            sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2),
            (sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) / sortedData.reduce((sum, d) => sum + d.saleCount, 0)).toFixed(2),
            sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(2),
            "100%",
        ];

        const csv = [headers, ...rows, totalRow].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `sales_by_${view}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";

        doc.setFontSize(16);
        doc.setFont("helvetica", "bold");
        doc.text(`Sales by ${view}`, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        doc.setFontSize(10);
        doc.setFont("helvetica", "normal");
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });

        const body = sortedData.map((d, i) => [
            i + 1,
            d.name,
            d.saleCount,
            d.quantity,
            d.totalTonnage.toFixed(2),
            `K${d.avgOrderValue.toFixed(0)}`,
            `K${d.totalSalesValue.toFixed(0)}`,
            `${d.contribution.toFixed(1)}%`,
        ]);

        // Add total row with same style as header
        const totalRow = [
            "",
            "Total",
            sortedData.reduce((sum, d) => sum + d.saleCount, 0),
            sortedData.reduce((sum, d) => sum + d.quantity, 0),
            sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2),
            `K${(sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) / sortedData.reduce((sum, d) => sum + d.saleCount, 0)).toFixed(0)}`,
            `K${sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(0)}`,
            "100%",
        ];

        autoTable(doc, {
            head: [
                ["#", "Name", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "% Share"],
            ],
            body: [...body, totalRow],
            startY: 30,
            styles: {
                fontSize: 10,
            },
            headStyles: {
                fillColor: [87, 100, 85],
                fontStyle: "bold",
                halign: "center",
            },
            didParseCell: (data) => {
                // Apply header style to total row
                if (data.row.index === sortedData.length) {
                    data.cell.styles.fillColor = [87, 100, 85];
                    data.cell.styles.fontStyle = "bold";
                    data.cell.styles.textColor = 250;
                    data.cell.styles.halign = "center";
                }
            },
        });

        doc.save(`sales_by_${view}.pdf`);
    };


    /** ------------------ Render ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <ViewSelector view={view} setView={setView} />
            <DateFiltersExports
                view={view}
                startDate={startDate}
                endDate={endDate}
                setStartDate={setStartDate}
                setEndDate={setEndDate}
                selectedLocations={selectedLocations}
                setSelectedLocations={setSelectedLocations}
                selectedCategories={selectedCategories}
                setSelectedCategories={setSelectedCategories}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                locationOptions={locationOptions}
                categoryOptions={categoryOptions}
                productOptions={productOptions}
                exportCSV={exportCSV}
                exportPDF={exportPDF}
                setView={setView}
            />

            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center font-small">#</th>
                            <th className="py-2 px-3 border-r text-left font-small">Product Name</th>
                            <th className="py-2 px-3 border-r text-center font-small">Orders</th>
                            <th className="py-2 px-3 border-r text-center font-small">Quantity</th>
                            <th className="py-2 px-3 border-r text-center font-small">Tonnage</th>
                            <th className="py-2 px-3 border-r text-center font-small">Avg Order Value</th>
                            <th className="py-2 px-3 border-r text-center font-small">Revenue</th>
                            <th className="py-2 px-3 border-r text-center font-small">Contribution</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            <>
                                {sortedData.map((d, i) => (
                                    <tr key={d.id} className={i % 2 ? "bg-gray-50" : ""}>
                                        <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                        <td className="py-2 px-3 border-r">{d.name}</td>
                                        <td className="py-2 px-3 border-r text-center">{d.saleCount}</td>
                                        <td className="py-2 px-3 border-r text-center">{d.quantity}</td>
                                        <td className="py-2 px-3 border-r text-center">{d.totalTonnage.toFixed(2)}</td>
                                        <td className="py-2 px-3 border-r text-center">K{d.avgOrderValue.toFixed(0)}</td>
                                        <td className="py-2 px-3 border-r text-center">K{d.totalSalesValue.toFixed(0)}</td>
                                        <td className="py-2 px-3 border-r text-center">{d.contribution.toFixed(1)}%</td>
                                    </tr>
                                ))}
                                <tr className="bg-gray-200 font-bold">
                                    <td className="py-2 px-3 border-r text-center font-small" colSpan={2}>
                                        Total
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">
                                        {sortedData.reduce((sum, d) => sum + d.saleCount, 0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">
                                        {sortedData.reduce((sum, d) => sum + d.quantity, 0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">
                                        {sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">
                                        K{(
                                            sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) /
                                            sortedData.reduce((sum, d) => sum + d.saleCount, 0)
                                        ).toFixed(0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">
                                        K{sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center font-small">100%</td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
