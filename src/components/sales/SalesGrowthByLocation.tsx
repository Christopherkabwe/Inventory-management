"use client";

import { useEffect, useMemo, useState } from "react";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts";
import { TrendingUp } from "lucide-react";
import CustomTooltip from "../CustomTooltip";

interface SaleItem {
    quantity: number;
    product: {
        weightValue: number;
        packSize: number;
    };
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
    location: {
        name: string;
    } | null;
}

interface GrowthData {
    location: string;
    growthPercent: number;
}

export default function SalesGrowthByLocation({
    sales = [],
    loading,
    oldestDate,
}: {
    sales?: Sale[];
    loading?: boolean;
    oldestDate?: string | null;
}) {
    const today = new Date().toISOString().split("T")[0];

    /* ---------------- UI DATE RANGE ---------------- */
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(today);

    /* ---------------- DEFAULT RANGE (last vs current period) ---------------- */
    useEffect(() => {
        if (!oldestDate || sales.length === 0) return; // safe now, sales is always an array


        const now = new Date();

        const thisMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);
        const thisMonthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        setStartDate(thisMonthStart.toISOString().split("T")[0]);
        setEndDate(thisMonthEnd.toISOString().split("T")[0]);
    }, [oldestDate, sales]);

    /* ---------------- COMPUTE GROWTH ---------------- */
    const growthByLocation: GrowthData[] = useMemo(() => {
        if (!sales.length || !startDate || !endDate) return [];

        const now = new Date();
        const start = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const periodMs = Math.max(end.getTime() - start.getTime(), 86400000);

        const prevStart = new Date(start.getTime() - periodMs);
        const prevEnd = new Date(start.getTime() - 1);

        const sumByLocation = (from: Date, to: Date) => {
            const map: Record<string, number> = {};

            for (const sale of sales) {
                const d = new Date(sale.saleDate);
                if (d < from || d > to) continue;

                const loc = sale.location?.name || "Unknown";

                for (const item of sale.items) {
                    const tonnage =
                        (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                    map[loc] = (map[loc] || 0) + tonnage;
                }
            }

            return map;
        };

        const current = sumByLocation(start, end);
        const previous = sumByLocation(prevStart, prevEnd);

        const locations = new Set([
            ...Object.keys(current),
            ...Object.keys(previous),
        ]);

        return Array.from(locations)
            .map((location) => {
                const curr = current[location] || 0;
                const prev = previous[location] || 0;

                const growth =
                    prev === 0
                        ? curr === 0
                            ? 0
                            : 100
                        : ((curr - prev) / prev) * 100;

                return {
                    location,
                    growthPercent: Number(growth.toFixed(1)),
                };
            })
            .sort((a, b) => b.growthPercent - a.growthPercent);
    }, [sales, startDate, endDate]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" />
                Sales Growth by Location (%)
            </h3>

            <div className="flex items-center justify-end gap-2 mb-5 text-xs">
                <span>Date Range:</span>
                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value || oldestDate || today)}
                    className="border rounded px-2 py-1"
                />
                <span>-</span>
                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value || today)}
                    className="border rounded px-2 py-1"
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-[250px]">
                    Loading...
                </div>
            ) : growthByLocation.length === 0 ? (
                <div className="flex justify-center items-center h-[250px] text-sm text-gray-500">
                    No sales data for selected range
                </div>
            ) : (
                <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={growthByLocation} barCategoryGap={18}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                        <YAxis tickFormatter={(v) => `${v}%`} />
                        <Tooltip
                            content={
                                <CustomTooltip
                                    labels={{
                                        titleKey: "location",
                                        metrics: [
                                            {
                                                key: "growthPercent",
                                                label: "Growth",
                                                format: (v) =>
                                                    `${v >= 0 ? "+" : ""}${v?.toFixed(1)}%`,
                                                color: (v) => (v < 0 ? "#ef4444" : "#16a34a"),
                                            },
                                        ],
                                    }}
                                />
                            }
                        />
                        <Bar dataKey="growthPercent" radius={[6, 6, 0, 0]}>
                            {growthByLocation.map((e, i) => (
                                <Cell
                                    key={i}
                                    fill={e.growthPercent < 0 ? "#ef4444" : "#16a34a"}
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
}
