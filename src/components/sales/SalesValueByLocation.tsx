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
import CustomTooltip from "../CustomTooltip";
import { MapPin } from "lucide-react";

interface SaleItem {
    quantity: number;
    price: number;
}

export interface Sale {
    saleDate: string;
    items: SaleItem[];
    location: {
        name: string;
    } | null;
}

interface Props {
    sales: Sale[];
    loading: boolean;
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
            min={oldestDate}
            max={today}
            onChange={(e) => setStart(e.target.value)}
            className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
        />

        <span>-</span>

        <input
            type="date"
            value={end}
            min={start || oldestDate}
            max={today}
            onChange={(e) => setEnd(e.target.value)}
            className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
        />
    </div>
);

export default function SalesValueByLocation({ sales, loading }: Props) {
    const today = useMemo(
        () => new Date().toISOString().split("T")[0],
        []
    );

    const [oldestDate, setOldestDate] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    /* -----------------------------
       INITIALIZE DATE RANGE
    ----------------------------- */
    useEffect(() => {
        if (!sales.length) return;

        const oldest = new Date(
            Math.min(...sales.map((s) => new Date(s.saleDate).getTime()))
        );

        const oldestStr = oldest.toISOString().split("T")[0];

        setOldestDate(oldestStr);
        setStartDate((prev) => prev || oldestStr);
        setEndDate((prev) => prev || today);
    }, [sales, today]);

    /* -----------------------------
       COMPUTE SALES VALUE
    ----------------------------- */
    const locationValueData: LocationValueData[] = useMemo(() => {
        if (!sales.length || !startDate || !endDate) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const filtered = sales.filter((s) => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const locations = Array.from(
            new Set(filtered.map((s) => s.location?.name || "Unknown"))
        );

        return locations
            .map((location) => {
                const value = filtered
                    .filter(
                        (s) => (s.location?.name || "Unknown") === location
                    )
                    .reduce((sum, sale) => {
                        return (
                            sum +
                            sale.items.reduce(
                                (itemSum, item) =>
                                    itemSum +
                                    item.quantity * item.price,
                                0
                            )
                        );
                    }, 0);

                return {
                    location,
                    value: Number(value.toFixed(2)),
                };
            })
            .sort((a, b) => b.value - a.value);
    }, [sales, startDate, endDate]);

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
                                                    format: (v) =>
                                                        `K${v.toFixed(2)}`,
                                                },
                                            ],
                                        }}
                                    />
                                }
                            />
                            <Bar
                                dataKey="value"
                                radius={[6, 6, 0, 0]}
                                fill="#2563eb"
                            >
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
