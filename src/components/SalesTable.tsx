"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";
import ViewSelector from "./ViewSelector";
import DateFiltersExports from "./DateFiltersExports";
import { Sale } from "@/types/Sale";

type View = "location" | "customer" | "product";
type SortKey =
    | "name"
    | "saleCount"
    | "quantity"
    | "totalTonnage"
    | "totalSalesValue"
    | "avgOrderValue"
    | "contribution";

interface AggregatedRow {
    id: string;
    name: string;
    saleCount: number;
    quantity: number;
    totalTonnage: number;
    totalSalesValue: number;
    avgOrderValue: number;
    contribution: number;
}

export default function SalesTable() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState<View>("location");
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);

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

    /** ----------------- Fetch Data ----------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales");
                const data = await res.json();
                if (data.success) {
                    setSales(data.data || []);
                }
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    /** ----------------- Options ----------------- */
    const locations = useMemo(() => {
        const map = new Map<string, { id: string; name: string; address?: string }>();
        sales.forEach((sale) => {
            if (sale.location && !map.has(sale.locationId)) {
                map.set(sale.locationId, {
                    id: sale.locationId,
                    name: sale.location.name,
                    address: sale.location?.address,
                });
            }
        });
        return Array.from(map.values());
    }, [sales]);

    const categories = useMemo(() => {
        const categorySet = new Set<string>();
        sales.forEach((sale) =>
            sale.items.forEach((item) => {
                if (item.product?.category) categorySet.add(item.product.category);
            })
        );
        return Array.from(categorySet).sort();
    }, [sales]);

    const products = useMemo(() => {
        const map = new Map<string, { id: string; name: string; category: string | null }>();
        sales.forEach((sale) =>
            sale.items.forEach((item) => {
                if (item.product && !map.has(item.productId)) {
                    map.set(item.productId, {
                        id: item.productId,
                        name: item.product.name,
                        category: item.product.category ?? null,
                    });
                }
            })
        );
        return Array.from(map.values());
    }, [sales]);

    const locationOptions = locations.map((l) => ({ value: l.id, label: l.name }));
    const categoryOptions = categories.map((c) => ({ value: c, label: c }));
    const productOptions = products.map((p) => ({ value: p.id, label: p.name }));

    /** ----------------- Filtered Sales ----------------- */
    const filteredSales = useMemo(() => {
        const filtered = sales.filter((sale) => {
            const date = new Date(sale.saleDate);
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;

            if (selectedLocations.length && !selectedLocations.includes(sale.locationId)) return false;

            if (selectedCategories.length) {
                const categoriesInSale = sale.items.map((i) => i.product.category).filter(Boolean);
                if (!categoriesInSale.some((c) => selectedCategories.includes(c!))) return false;
            }

            if (selectedProducts.length) {
                const productIdsInSale = sale.items.map((i) => i.productId);
                if (!productIdsInSale.some((id) => selectedProducts.includes(id))) return false;
            }

            return true;
        });
        return filtered;
    }, [sales, startDate, endDate, selectedLocations, selectedCategories, selectedProducts]);

    /** ----------------- Aggregation ----------------- */
    const aggregatedData = useMemo(() => {
        const map: Record<string, AggregatedRow> = {};
        filteredSales.forEach(sale => {
            sale.items.forEach(item => {
                let id: string, name: string;
                if (view === "location") {
                    id = sale.locationId;
                    name = sale.location?.name || "Unknown Location";
                } else if (view === "customer") {
                    id = sale.customerId;
                    name = sale.customer?.name || "Unknown Customer";
                } else {
                    id = item.productId;
                    name = item.product?.name || "Unknown Product";
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

                const weightKg = unitToKg(item.product?.weightValue ?? 0, item.product?.weightUnit ?? "kg");
                const tonnage = (weightKg * item.quantity * (item.product?.packSize ?? 1)) / 1000;

                map[id].saleCount += 1;
                map[id].quantity += item.quantity;
                map[id].totalTonnage += tonnage;
                map[id].totalSalesValue += item.total ?? item.price * item.quantity;
            });
        });

        const totalRevenue = Object.values(map).reduce((sum, d) => sum + d.totalSalesValue, 0);

        return Object.values(map).map((d) => ({
            ...d,
            avgOrderValue: d.saleCount ? d.totalSalesValue / d.saleCount : 0,
            contribution: totalRevenue ? (d.totalSalesValue / totalRevenue) * 100 : 0,
        }));
    }, [filteredSales, view]);

    const sortedData = useMemo(() => {
        return [...aggregatedData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (aVal === undefined || bVal === undefined) {
                return 0; // or throw an error, depending on your requirements
            }

            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }

            if (typeof aVal === "number" && typeof bVal === "number") {
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            }

            // Handle other types or mixed types as needed
            console.error("Unsupported data type for sorting:", typeof aVal, typeof bVal);
            return 0;
        });
    }, [aggregatedData, sortKey, sortDir]);


    /** ------------------ Render ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <h2 className="px-2 font-semibold mb-5">Sales Summary</h2>
            <ViewSelector view={view} setView={setView} />

            <div className="flex justify-start items-center mb-2 mt-2">
                <button
                    className="xl:hidden mb-3 px-3 py-1 border rounded-sm text-sm hover:bg-gray-100"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div className={`${showFilters ? "flex flex-col" : "hidden"} xl:flex xl:flex-col`}>
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
                    productOptions={products}
                    exportCSV={() => console.log("Export CSV clicked")}
                    exportPDF={() => console.log("Export PDF clicked")}
                />
            </div>

            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center font-small">#</th>
                            <Header
                                label={view === "location" ? "Location" : view === "customer" ? "Customer" : "Product"}
                                column="name"
                            />
                            <Header label="Orders" column="saleCount" align="center" />
                            <Header label="Quantity" column="quantity" align="center" />
                            <Header label="Tonnage" column="totalTonnage" align="center" />
                            <Header label="Avg Order Value" column="avgOrderValue" align="center" />
                            <Header label="Revenue" column="totalSalesValue" align="center" />
                            <Header label="Contribution" column="contribution" align="center" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                                    Loading...
                                </td>
                            </tr>
                        ) : sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="py-6 text-center text-gray-500 italic">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((d, i) => (
                                <tr key={d.id} className={i % 2 ? "bg-gray-50" : ""}>
                                    <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                    <td className="py-2 px-3 border-r">{d.name}</td>
                                    <td className="py-2 px-3 border-r">{d.saleCount}</td>
                                    <td className="py-2 px-3 border-r">{d.quantity}</td>
                                    <td className="py-2 px-3 border-r">{(d.totalTonnage ?? 0).toFixed(2)}</td>
                                    <td className="py-2 px-3 border-r">K{(d.avgOrderValue ?? 0).toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r">K{(d.totalSalesValue ?? 0).toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r">{(d.contribution ?? 0).toFixed(1)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
