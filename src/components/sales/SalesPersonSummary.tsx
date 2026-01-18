"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { unitToKg } from "@/lib/UnitToKg";
import ViewSelector from "../ViewSelector";
import DateFiltersExports from "../Exports/DateFiltersExports";
import { Sale } from "@/types/Sale";

type View = "location" | "customer" | "product" | "salesperson";
type SortKey =
    | "name"
    | "supervisor"
    | "saleCount"
    | "quantity"
    | "totalTonnage"
    | "totalSalesValue"
    | "avgOrderValue"
    | "target"
    | "achievement"
    | "contribution";

interface AggregatedRow {
    id: string;
    name: string;
    supervisor?: string;
    saleCount: number;
    quantity: number;
    totalTonnage: number;
    totalSalesValue: number;
    avgOrderValue: number;
    target: number;
    achievement: number;
    contribution: number;
}

export default function SalesPersonSummary() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState<View>("salesperson");
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedSupervisors, setSelectedSupervisors] = useState<string[]>([]);
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

    /** ----------------- Fetch Data (mock salesPerson) ----------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);

                // MOCK SALES DATA
                const mockSales: Sale[] = Array.from({ length: 30 }, (_, i) => {
                    const salespersonList = [
                        { id: "s1", name: "Alice", supervisor: "John" },
                        { id: "s2", name: "Bob", supervisor: "John" },
                        { id: "s3", name: "Charlie", supervisor: "Mary" },
                    ];
                    const sp = salespersonList[i % 3];
                    return {
                        id: `sale-${i + 1}`,
                        locationId: `l${(i % 5) + 1}`,
                        location: { name: `Location ${(i % 5) + 1}` },
                        customerId: `c${(i % 10) + 1}`,
                        customer: { name: `Customer ${(i % 10) + 1}` },
                        saleDate: new Date(2026, 0, (i % 28) + 1).toISOString(),
                        items: [
                            {
                                productId: `p${(i % 7) + 1}`,
                                product: {
                                    name: `Product ${(i % 7) + 1}`,
                                    category: ["Cat A", "Cat B", "Cat C"][i % 3],
                                    weightValue: 5 + (i % 5),
                                    weightUnit: "kg",
                                    packSize: 1,
                                },
                                quantity: 1 + (i % 4),
                                price: 100 + i * 5,
                                total: undefined,
                            },
                        ],
                        salespersonId: sp.id,
                        salesperson: sp,
                    } as Sale;
                });

                setSales(mockSales);
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
        const map = new Map<string, { id: string; name: string }>();
        sales.forEach((sale) => {
            if (sale.location && !map.has(sale.locationId)) {
                map.set(sale.locationId, { id: sale.locationId, name: sale.location.name });
            }
        });
        return Array.from(map.values());
    }, [sales]);

    const categories = useMemo(() => {
        const set = new Set<string>();
        sales.forEach((s) => s.items.forEach((i) => i.product?.category && set.add(i.product.category)));
        return Array.from(set).sort();
    }, [sales]);

    const products = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();
        sales.forEach((s) => s.items.forEach((i) => i.product && !map.has(i.productId) && map.set(i.productId, { id: i.productId, name: i.product.name })));
        return Array.from(map.values());
    }, [sales]);

    const supervisors = useMemo(() => {
        const set = new Set<string>();
        sales.forEach((s) => s.salesperson?.supervisor && set.add(s.salesperson.supervisor));
        return Array.from(set);
    }, [sales]);

    /** ----------------- Filtered Sales ----------------- */
    const filteredSales = useMemo(() => {
        return sales.filter((sale) => {
            const date = new Date(sale.saleDate);
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;

            if (selectedLocations.length && !selectedLocations.includes(sale.locationId)) return false;

            if (selectedCategories.length) {
                const cats = sale.items.map((i) => i.product.category).filter(Boolean);
                if (!cats.some((c) => selectedCategories.includes(c!))) return false;
            }

            if (selectedProducts.length) {
                const ids = sale.items.map((i) => i.productId);
                if (!ids.some((id) => selectedProducts.includes(id))) return false;
            }

            if (selectedSupervisors.length && !selectedSupervisors.includes(sale.salesperson?.supervisor || "")) return false;

            return true;
        });
    }, [sales, startDate, endDate, selectedLocations, selectedCategories, selectedProducts, selectedSupervisors]);

    /** ----------------- Aggregation ----------------- */
    const aggregatedData = useMemo(() => {
        const map: Record<string, AggregatedRow> = {};

        filteredSales.forEach((sale) => {
            sale.items.forEach((item) => {
                if (!sale.salesperson) return;

                const id = sale.salespersonId;
                const name = sale.salesperson.name;
                const supervisor = sale.salesperson.supervisor;

                if (!map[id]) {
                    map[id] = {
                        id,
                        name,
                        supervisor,
                        saleCount: 0,
                        quantity: 0,
                        totalTonnage: 0,
                        totalSalesValue: 0,
                        avgOrderValue: 0,
                        target: 20000, // mock target
                        achievement: 0,
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
            achievement: d.target ? (d.totalSalesValue / d.target) * 100 : 0,
            contribution: totalRevenue ? (d.totalSalesValue / totalRevenue) * 100 : 0,
        }));
    }, [filteredSales]);

    /** ----------------- Sorting ----------------- */
    const sortedData = useMemo(() => {
        return [...aggregatedData].sort((a, b) => {
            const aVal = a[sortKey as keyof AggregatedRow];
            const bVal = b[sortKey as keyof AggregatedRow];

            if (typeof aVal === "number" && typeof bVal === "number") return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            if (typeof aVal === "string" && typeof bVal === "string") return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            return 0;
        });
    }, [aggregatedData, sortKey, sortDir]);

    /** ------------------ Render ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <h2 className="px-2 font-semibold mb-5">Salesperson KPI Summary</h2>

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
                    selectedSupervisors={selectedSupervisors}
                    setSelectedSupervisors={setSelectedSupervisors}
                    locationOptions={locations.map((l) => ({ value: l.id, label: l.name }))}
                    categoryOptions={categories.map((c) => ({ value: c, label: c }))}
                    productOptions={products.map((p) => ({ value: p.id, label: p.name }))}
                    supervisorOptions={supervisors.map((s) => ({ value: s, label: s }))}
                    exportCSV={() => console.log("Export CSV clicked")}
                    exportPDF={() => console.log("Export PDF clicked")}
                />
            </div>

            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center font-small">#</th>
                            <Header label="Salesperson" column="name" />
                            <Header label="Supervisor" column="supervisor" />
                            <Header label="Orders" column="saleCount" align="center" />
                            <Header label="Quantity" column="quantity" align="center" />
                            <Header label="Tonnage" column="totalTonnage" align="center" />
                            <Header label="Avg Order Value" column="avgOrderValue" align="center" />
                            <Header label="Target" column="target" align="center" />
                            <Header label="Achievement %" column="achievement" align="center" />
                            <Header label="Revenue" column="totalSalesValue" align="center" />
                            <Header label="Contribution" column="contribution" align="center" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={10} className="py-6 text-center text-gray-500 italic">
                                    Loading...
                                </td>
                            </tr>
                        ) : sortedData.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="py-6 text-center text-gray-500 italic">
                                    No data available
                                </td>
                            </tr>
                        ) : (
                            sortedData.map((d, i) => (
                                <tr key={d.id} className={i % 2 ? "bg-gray-50" : ""}>
                                    <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                    <td className="py-2 px-3 border-r">{d.name}</td>
                                    <td className="py-2 px-3 border-r">{d.supervisor}</td>
                                    <td className="py-2 px-3 border-r text-center">{d.saleCount}</td>
                                    <td className="py-2 px-3 border-r text-center">{d.quantity}</td>
                                    <td className="py-2 px-3 border-r text-center">{d.totalTonnage.toFixed(2)}</td>
                                    <td className="py-2 px-3 border-r text-center">K{d.avgOrderValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r text-center">K{d.target.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r text-center">{d.achievement.toFixed(1)}%</td>
                                    <td className="py-2 px-3 border-r text-center">K{d.totalSalesValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r text-center">{d.contribution.toFixed(1)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
