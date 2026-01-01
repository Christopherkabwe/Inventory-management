"use client";

import { useEffect, useMemo, useState } from "react";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
    Tooltip,
} from "recharts";
import { MapPin } from "lucide-react";
import CustomTooltip from "./CustomTooltip";

/* ---------------- TYPES ---------------- */
interface SaleItem {
    quantity: number;
    price: number;
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
    location: {
        name: string;
    } | null;
}

interface ContributionData {
    location: string;
    salesValue: number;
    contribution: number;
}

/* ---------------- DATE RANGE SELECTOR ---------------- */
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

/* ---------------- COMPONENT ---------------- */
export default function SalesContributionByLocation() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [oldestDate, setOldestDate] = useState("");

    const today = new Date().toISOString().split("T")[0];

    const COLORS = [
        "#6366f1",
        "#22c55e",
        "#f59e0b",
        "#ef4444",
        "#06b6d4",
        "#8b5cf6",
    ];

    /* ---------------- FETCH SALES ---------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales");
                const json = await res.json();
                const data: Sale[] = json.data || [];

                setSales(data);

                if (data.length) {
                    const oldest = new Date(
                        Math.min(...data.map(s => new Date(s.saleDate).getTime()))
                    );
                    setOldestDate(oldest.toISOString().split("T")[0]);
                    setStartDate(oldest.toISOString().split("T")[0]);
                    setEndDate(today);
                } else {
                    setOldestDate(today);
                    setStartDate(today);
                    setEndDate(today);
                }
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [today]);

    /* ---------------- COMPUTE CONTRIBUTION ---------------- */
    const contributionData: ContributionData[] = useMemo(() => {
        if (!sales.length) return [];

        const start = new Date(startDate || oldestDate);
        const end = new Date(endDate || today);
        end.setHours(23, 59, 59, 999);

        const totals = new Map<string, number>();
        let grandTotal = 0;

        sales.forEach(sale => {
            const d = new Date(sale.saleDate);
            if (d < start || d > end) return;

            const location = sale.location?.name || "Unknown";

            const saleValue =
                sale.items?.reduce((sum, item) => {
                    return sum + item.quantity * item.price;
                }, 0) || 0;

            totals.set(location, (totals.get(location) || 0) + saleValue);
            grandTotal += saleValue;
        });

        return Array.from(totals.entries()).map(([location, total]) => ({
            location,
            salesValue: Number(total.toFixed(2)),
            contribution: grandTotal
                ? Number(((total / grandTotal) * 100).toFixed(1))
                : 0,
        }));
    }, [sales, startDate, endDate, oldestDate, today]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-indigo-600" />
                Contribution to Total Sales (%)
            </h3>

            <SimpleDateRangeSelector
                start={startDate}
                end={endDate}
                setStart={setStartDate}
                setEnd={setEndDate}
                oldestDate={oldestDate}
                today={today}
            />

            <div className="relative flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : contributionData.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                        No sales data for selected range
                    </div>
                ) : (
                    <div className="h-[260px] flex flex-col">
                        {/* Chart area */}
                        <div className="flex-1">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={contributionData}
                                        dataKey="salesValue"
                                        nameKey="location"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        label={false}
                                    >
                                        {contributionData.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={COLORS[i % COLORS.length]}
                                            />
                                        ))}
                                    </Pie>

                                    <Tooltip
                                        content={
                                            <CustomTooltip
                                                labels={{
                                                    titleKey: "location",
                                                    metrics: [
                                                        {
                                                            key: "contribution",
                                                            label: "Contribution",
                                                            format: v => `${v?.toFixed(1)}%`,
                                                        },
                                                        {
                                                            key: "salesValue",
                                                            label: "Sales Value",
                                                            format: v => `K${v?.toFixed(2)}`,
                                                        },
                                                    ],
                                                }}
                                            />
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend (contained & scrollable) */}
                        <div className="flex flex-wrap justify-center gap-2 mt-2 text-xs max-h-{50}">
                            {contributionData.map((entry, i) => (
                                <div key={entry.location} className="flex items-center gap-2">
                                    <span
                                        className="w-3 h-3 rounded-full shrink-0"
                                        style={{ backgroundColor: COLORS[i % COLORS.length] }}
                                    />
                                    <span className="whitespace-nowrap">
                                        {entry.location} ({entry.contribution.toFixed(1)}%)
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
