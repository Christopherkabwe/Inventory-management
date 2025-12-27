"use client";
import { useMemo, useState } from "react";
import { ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";
import { Sale } from "./Sale";
import ViewSelector from "./ViewSelector";
import DateFiltersExports from "./DateFiltersExports";

interface Props {
    sales: Sale[];
    locations: Location[];
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

    /** ----------------- Sorting ----------------- */
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
            className={`py-2 px-3 cursor-pointer border-r select-none hover:text-blue-600 ${align === "right" ? "text-right" : "text-left"
                }`}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {sortKey === column && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
                <ArrowUpDown className="w-3 h-3 opacity-40" />
            </span>
        </th>
    );

    /** ----------------- Options ----------------- */
    const locations = useMemo(() => {
        if (!sales || sales.length === 0) return [];

        // Use Map to deduplicate by location id
        const map = new Map<string, { id: string; name: string; address?: string }>();
        sales.forEach(sale => {
            if (sale.location && !map.has(sale.locationId)) {
                map.set(sale.locationId, {
                    id: sale.locationId,
                    name: sale.location.name,
                    address: sale.location?.address,
                });
            }
        });

        // Convert to array of objects suitable for dropdowns
        return Array.from(map.values());
    }, [sales]);
    console.log(locations)

    const categories = useMemo(() => Array.from(new Set(sales.map(s => s.product?.category).filter(Boolean))).sort(), [sales]);

    const products = useMemo(() => {
        const map = new Map<string, { id: string; name: string; category: string | null }>();
        sales.forEach(s => {
            if (s.product && !map.has(s.productId)) {
                map.set(s.productId, {
                    id: s.productId,
                    name: s.product.name,
                    category: s.product.category,
                });
            }
        });
        return Array.from(map.values());
    }, [sales]);

    const locationOptions = locations.map(l => ({ value: l.id, label: l.name }));
    const categoryOptions = categories.map(c => ({ value: c, label: c }));
    const productOptions = products.map(p => ({ value: p.id, label: p.name }));


    /** ----------------- Filtered Sales ----------------- */
    const filteredSales = useMemo(() => {
        return sales.filter(sale => {
            const date = new Date(sale.saleDate);
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;
            if (selectedLocations.length && !selectedLocations.includes(sale.locationId)) return false;
            if (selectedCategories.length && !selectedCategories.includes(sale.product?.category)) return false;
            if (selectedProducts.length && !selectedProducts.includes(sale.productId)) return false;
            return true;
        });
    }, [sales, startDate, endDate, selectedLocations, selectedCategories, selectedProducts]);

    /** ----------------- Aggregation ----------------- */
    const aggregatedData = useMemo(() => {
        const map: Record<string, any> = {};
        filteredSales.forEach(sale => {
            let id: string, name: string;
            if (view === "location") {
                id = sale.locationId; name = sale.location?.name || "Unknown Location";
            } else if (view === "customer") {
                id = sale.customerId; name = sale.customerName || "Unknown Customer";
            } else {
                id = sale.productId; name = sale.product?.name || "Unknown Product";
            }
            if (!map[id]) map[id] = { id, name, saleCount: 0, quantity: 0, totalTonnage: 0, totalSalesValue: 0, avgOrderValue: 0, contribution: 0 };
            const salesValue = sale.totalAmount ?? sale.salePrice * sale.quantity;
            const weightKg = unitToKg(sale.product?.weightValue || 0, sale.product?.weightUnit);
            const tonnage = (weightKg * sale.quantity * (sale.product?.packSize || 1)) / 1000;
            map[id].saleCount += 1;
            map[id].quantity += sale.quantity;
            map[id].totalSalesValue += salesValue;
            map[id].totalTonnage += tonnage;
        });
        const totalRevenue = Object.values(map).reduce((sum, d) => sum + d.totalSalesValue, 0);
        return Object.values(map).map(d => ({
            ...d,
            avgOrderValue: d.saleCount ? d.totalSalesValue / d.saleCount : 0,
            contribution: totalRevenue ? (d.totalSalesValue / totalRevenue) * 100 : 0
        }));
    }, [filteredSales, view]);

    /** ----------------- Sorting ----------------- */
    const sortedData = useMemo(() => {
        return [...aggregatedData].sort((a, b) => {
            const aVal = a[sortKey], bVal = b[sortKey];
            if (typeof aVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [aggregatedData, sortKey, sortDir]);

    /** ----------------- Export Functions ----------------- */
    const exportCSV = () => {
        const headers = [view === "location" ? "Location" : view === "customer" ? "Customer" : "Product", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "% Share"];
        const rows = sortedData.map(d => [d.name, d.saleCount, d.quantity, d.totalTonnage.toFixed(2), d.avgOrderValue.toFixed(2), d.totalSalesValue.toFixed(2), d.contribution.toFixed(2)]);
        const totalRow = ["Total", sortedData.reduce((sum, d) => sum + d.saleCount, 0), sortedData.reduce((sum, d) => sum + d.quantity, 0), sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2), (sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) / sortedData.reduce((sum, d) => sum + d.saleCount, 0)).toFixed(2), sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(2), "100%"];
        const csv = [headers, ...rows, totalRow].map(r => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob); const a = document.createElement("a");
        a.href = url; a.download = `sales_by_${view}.csv`; a.click(); URL.revokeObjectURL(url);
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";
        doc.setFontSize(16); doc.setFont("helvetica", "bold");
        doc.text(`Sales by ${view}`, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
        doc.setFontSize(10); doc.setFont("helvetica", "normal");
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });
        const body = sortedData.map((d, i) => [i + 1, d.name, d.saleCount, d.quantity, d.totalTonnage.toFixed(2), `K${d.avgOrderValue.toFixed(0)}`, `K${d.totalSalesValue.toFixed(0)}`, `${d.contribution.toFixed(1)}%`]);
        const totalRow = ["", "Total", sortedData.reduce((sum, d) => sum + d.saleCount, 0), sortedData.reduce((sum, d) => sum + d.quantity, 0), sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2), `K${(sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) / sortedData.reduce((sum, d) => sum + d.saleCount, 0)).toFixed(0)}`, `K${sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(0)}`, "100%"];
        autoTable(doc, { head: [["#", "Name", "Orders", "Quantity", "Tonnage", "Avg Order Value", "Revenue", "% Share"]], body: [...body, totalRow], startY: 30, styles: { fontSize: 10 }, headStyles: { fillColor: [87, 100, 85], fontStyle: "bold", halign: "center" } });
        doc.save(`sales_by_${view}.pdf`);
    };

    /** ------------------ Render ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <ViewSelector view={view} setView={setView} />
            <DateFiltersExports
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
                sales={sales}
                exportCSV={exportCSV}
                exportPDF={exportPDF}
            />
            <div className="max-h-[420px] overflow-y-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center font-small">#</th>
                            <Header label={view === "location" ? "Location" : view === "customer" ? "Customer" : "Product"} column="name" />
                            <Header label="Orders" column="saleCount" align="center" />
                            <Header label="Quantity" column="quantity" align="center" />
                            <Header label="Tonnage" column="totalTonnage" align="center" />
                            <Header label="Avg Order Value" column="avgOrderValue" align="center" />
                            <Header label="Revenue" column="totalSalesValue" align="center" />
                            <Header label="Contribution" column="contribution" align="center" />
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length === 0 ? (
                            <tr><td colSpan={8} className="py-6 text-center text-gray-500 italic">No data available</td></tr>
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
                                    <td colSpan={2} className="py-2 px-3 border-r text-center font-small">Total</td>
                                    <td className="py-2 px-3 border-r text-center">{sortedData.reduce((sum, d) => sum + d.saleCount, 0)}</td>
                                    <td className="py-2 px-3 border-r text-center">{sortedData.reduce((sum, d) => sum + d.quantity, 0)}</td>
                                    <td className="py-2 px-3 border-r text-center">{sortedData.reduce((sum, d) => sum + d.totalTonnage, 0).toFixed(2)}</td>
                                    <td className="py-2 px-3 border-r text-center">K{(sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0) / sortedData.reduce((sum, d) => sum + d.saleCount, 0)).toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r text-center">K{sortedData.reduce((sum, d) => sum + d.totalSalesValue, 0).toFixed(0)}</td>
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
