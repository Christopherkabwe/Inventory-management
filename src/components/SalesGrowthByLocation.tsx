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
    Cell
} from "recharts";
import { TrendingUp } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

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

export default function SalesGrowthByLocation() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [locationStartDate, setLocationStartDate] = useState<string>("");
    const [locationEndDate, setLocationEndDate] = useState<string>("");
    const [oldestDate, setOldestDate] = useState<string>("");

    const today = new Date().toISOString().split("T")[0];

    // -----------------------------
    // FETCH SALES
    // -----------------------------
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales");
                const json = await res.json();
                const data: Sale[] = json.data || [];
                setSales(data);

                if (data.length > 0) {
                    const oldest = new Date(
                        Math.min(...data.map((s) => new Date(s.saleDate).getTime()))
                    );
                    const oldestStr = oldest.toISOString().split("T")[0];
                    setOldestDate(oldestStr);
                    setLocationStartDate(oldestStr);
                    setLocationEndDate(today);
                } else {
                    setOldestDate(today);
                    setLocationStartDate(today);
                    setLocationEndDate(today);
                }
            } catch (err) {
                console.error("Failed to fetch sales:", err);
                setOldestDate(today);
                setLocationStartDate(today);
                setLocationEndDate(today);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, [today]);

    // -----------------------------
    // COMPUTE GROWTH BY LOCATION
    // -----------------------------
    const growthByLocation: GrowthData[] = useMemo(() => {
        if (!sales.length) return [];

        const start = new Date(locationStartDate);
        const end = new Date(locationEndDate);
        const diff = end.getTime() - start.getTime();

        // Ensure previous period is at least 1 day
        //const diff = Math.max(end.getTime() - start.getTime(), 24 * 60 * 60 * 1000);

        const prevStart = new Date(start.getTime() - diff);
        const prevEnd = new Date(start.getTime());

        const current = sales.filter((s) => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const previous = sales.filter((s) => {
            const d = new Date(s.saleDate);
            return d >= prevStart && d <= prevEnd;
        });

        const locations = Array.from(
            new Set([...current, ...previous].map((s) => s.location?.name || "Unknown"))
        );


        return locations
            .map((location) => {
                const locName = location || "Unknown";

                const currValue = current
                    .filter((s) => (s.location?.name || "Unknown") === locName)
                    .reduce((sum, sale) => {
                        return sum + sale.items?.reduce((itemSum, item) => {
                            if (!item.product) return itemSum;
                            return itemSum + (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                        }, 0) || 0;
                    }, 0);

                const prevValue = previous
                    .filter((s) => (s.location?.name || "Unknown") === locName)
                    .reduce((sum, sale) => {
                        return sum + sale.items?.reduce((itemSum, item) => {
                            if (!item.product) return itemSum;
                            return itemSum + (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                        }, 0) || 0;
                    }, 0);

                const growthPercent =
                    prevValue === 0 ? (currValue === 0 ? 0 : 100) : ((currValue - prevValue) / prevValue) * 100;

                return {
                    location: locName,
                    growthPercent: Number(growthPercent.toFixed(1)),
                };
            })
            .sort((a, b) => b.growthPercent - a.growthPercent);
    }, [sales, locationStartDate, locationEndDate]);

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Header */}
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-600" /> Sales Growth by Location (%)
            </h3>

            {/* Date Selector */}
            <SimpleDateRangeSelector
                start={locationStartDate}
                end={locationEndDate}
                setStart={setLocationStartDate}
                setEnd={setLocationEndDate}
                oldestDate={oldestDate}
                today={today}
            />

            {/* Chart */}
            <div className="">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : growthByLocation.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
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
                                                        `${v && v >= 0 ? "+" : ""}${v?.toFixed(1)}%`,
                                                    color: (v) => (v !== undefined && v < 0 ? "#ef4444" : "#16a34a"),
                                                },
                                            ],
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="growthPercent" radius={[6, 6, 0, 0]}>
                                {growthByLocation.map((entry, idx) => (
                                    <Cell
                                        key={`cell-${idx}`}
                                        fill={entry.growthPercent < 0 ? "#ef4444" : "#16a34a"}
                                    />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
