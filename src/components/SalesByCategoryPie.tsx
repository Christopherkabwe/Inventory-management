"use client";

import { useEffect, useMemo, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import CustomTooltip from "./CustomTooltip";
import { Package } from "lucide-react";

interface SaleItem {
    quantity: number;
    product: {
        category: string | null;
        weightValue: number;
        packSize: number;
    };
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
}

interface CategoryData {
    category: string;
    tonnage: number;
}

export default function SalesByCategoryPie() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const COLORS = [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
    ];

    const [categoryStartDate, setCategoryStartDate] = useState<string>("");
    const [categoryEndDate, setCategoryEndDate] = useState<string>("");

    const [oldestDate, setOldestDate] = useState<string>(""); // oldest sale date
    const today = new Date().toISOString().split("T")[0]; // always today

    // -----------------------------
    // FETCH SALES
    // -----------------------------
    useEffect(() => {
        const fetchSales = async () => {
            try {
                const res = await fetch(`/api/rbac/sales`);
                const json = await res.json(); // read body only once
                const data: Sale[] = Array.isArray(json) ? json : [];

                setSales(data);

                if (data.length > 0) {
                    const oldest = new Date(
                        Math.min(...data.map((s) => new Date(s.saleDate).getTime()))
                    );
                    const oldestStr = oldest.toISOString().split("T")[0];
                    setOldestDate(oldestStr);
                    setCategoryStartDate(oldestStr);
                    setCategoryEndDate(today);
                } else {
                    setOldestDate(today);
                    setCategoryStartDate(today);
                    setCategoryEndDate(today);
                }
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, [today]);

    useEffect(() => {
        //console.log('Sales:', sales);
    }, [sales]);

    // -----------------------------
    // COMPUTE TONNAGE BY CATEGORY
    // -----------------------------
    const categoryData: CategoryData[] = useMemo(() => {
        if (!sales.length) return [];
        const map: Record<string, number> = {};
        const start = categoryStartDate ? new Date(categoryStartDate) : new Date(oldestDate);
        const end = categoryEndDate ? new Date(categoryEndDate) : new Date(today);
        end.setHours(23, 59, 59, 999);

        for (const sale of sales) {
            const saleDate = new Date(sale.saleDate);
            if (saleDate < start || saleDate > end) continue;

            for (const item of sale.items) {
                const category = item.product.category || "Uncategorized";
                const tonnage = (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                map[category] = (map[category] || 0) + tonnage;
            }
        }

        return Object.entries(map).map(([category, tonnage]) => ({
            category,
            tonnage: Number(tonnage.toFixed(2)),
        }));
    }, [sales, categoryStartDate, categoryEndDate, oldestDate, today]);

    const totalTonnage = categoryData.reduce((s, d) => s + d.tonnage, 0);

    // -----------------------------
    // DATE RANGE SELECTOR
    // -----------------------------
    const SimpleDateRangeSelector = ({
        start,
        end,
        setStart,
        setEnd,
        oldestDate,
        today,
    }: {
        start: string;
        end: string;
        setStart: (s: string) => void;
        setEnd: (s: string) => void;
        oldestDate: string;
        today: string;
    }) => (
        <div className="flex items-center justify-end w-full gap-2 mb-5">
            <span className="text-xs">Date Range:</span>
            <input
                type="date"
                value={start}
                onChange={(e) => setStart(e.target.value || oldestDate)}
                className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
            />
            <span>-</span>
            <input
                type="date"
                value={end}
                onChange={(e) => setEnd(e.target.value || today)}
                className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
            />
        </div>
    );

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Header */}
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <Package className="h-5 w-5 text-green-600" /> Sales by Category
            </h3>

            {/* Date Selector */}
            <SimpleDateRangeSelector
                start={categoryStartDate}
                end={categoryEndDate}
                setStart={setCategoryStartDate}
                setEnd={setCategoryEndDate}
                oldestDate={oldestDate}
                today={today}
            />

            {/* Chart Container */}
            <div className="relative flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : (
                    <div className="h-[260px] flex flex-col">
                        {/* Chart area */}
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height={260}>
                                <PieChart>
                                    <Pie
                                        data={categoryData}
                                        dataKey="tonnage"
                                        nameKey="category"
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={4}
                                    >
                                        {categoryData.map((_, i) => (
                                            <Cell key={i} fill={COLORS[i % COLORS.length]} />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>



                        {/* Legend */}
                        <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs">
                            {categoryData.map((d, i) => (
                                <div key={d.category} className="flex items-center gap-1">
                                    <span
                                        className="w-2 h-2 rounded-full"
                                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                    />
                                    <span>
                                        {d.category} ({((d.tonnage / totalTonnage) * 100).toFixed(1)}%)
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
