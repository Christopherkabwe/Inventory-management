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
import CustomTooltip from "./CustomTooltip";
import { MapPin } from "lucide-react";

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

interface LocationValueData {
    location: string;
    value: number;
}

/* -----------------------------
   DATE RANGE SELECTOR
----------------------------- */
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

export default function SalesValueByLocation() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [oldestDate, setOldestDate] = useState("");

    const today = new Date().toISOString().split("T")[0];

    /* -----------------------------
       FETCH SALES
    ----------------------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/rbac/sales");
                const json = await res.json(); // ✅ read once

                if (!Array.isArray(json)) {
                    console.error("Unexpected API response:", json);
                    setSales([]);
                    return;
                }

                const data: Sale[] = json;
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

    /* -----------------------------
       COMPUTE SALES VALUE BY LOCATION
    ----------------------------- */
    const locationValueData: LocationValueData[] = useMemo(() => {
        if (!sales.length) return [];

        const start = new Date(startDate || oldestDate);
        const end = new Date(endDate || today);
        end.setHours(23, 59, 59, 999);

        const filtered = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const locations = Array.from(
            new Set(filtered.map(s => s.location?.name || "Unknown"))
        );

        return locations
            .map(location => {
                const value = filtered
                    .filter(s => (s.location?.name || "Unknown") === location)
                    .reduce((sum, sale) => {
                        return sum + sale.items.reduce(
                            (itemSum, item) => itemSum + item.quantity * item.price,
                            0
                        );
                    }, 0);

                return {
                    location,
                    value: Number(value.toFixed(2)),
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [sales, startDate, endDate, oldestDate, today]);

    /* -----------------------------
       RENDER
    ----------------------------- */
    return (
        <div className="bg-white py-6 px-2 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-blue-600" />
                Sales Value by Location
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
                ) : locationValueData.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                        No sales data for selected range
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationValueData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis
                                tick={{ fontSize: 11 }}
                                tickFormatter={(v) => `K${v}`}
                            />
                            <Tooltip
                                content={
                                    <CustomTooltip
                                        labels={{
                                            titleKey: "location",
                                            metrics: [
                                                {
                                                    key: "value",
                                                    label: "Sales Value",
                                                    format: (v) => `K${v.toFixed(2)}`,
                                                },
                                            ],
                                        }}
                                    />
                                }
                            />
                            <Bar dataKey="value" radius={[6, 6, 0, 0]} fill="#2563eb">
                                {locationValueData.map((_, i) => (
                                    <Cell key={i} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
