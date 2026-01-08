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
import CustomTooltip from "./CustomTooltip";
import { MapPin } from "lucide-react";

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

interface LocationData {
    location: string;
    tonnage: number;
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

export default function SalesByLocation() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [startDate, setStartDate] = useState<string>("");
    const [endDate, setEndDate] = useState<string>("");

    const [oldestDate, setOldestDate] = useState<string>("");
    const today = new Date().toISOString().split("T")[0];

    // -----------------------------
    // FETCH SALES
    // -----------------------------
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);

                const res = await fetch("/api/rbac/sales");
                const json = await res.json(); // read once

                if (!Array.isArray(json)) {
                    console.error("Unexpected API response:", json);
                    return;
                }

                const data: Sale[] = json;
                setSales(data);

                if (data.length > 0) {
                    const oldest = new Date(
                        Math.min(...data.map((s) => new Date(s.saleDate).getTime()))
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

    useEffect(() => {
        //console.log('Sales:', sales);
    }, [sales]);

    // -----------------------------
    // COMPUTE TONNAGE BY LOCATION
    // -----------------------------
    const locationData: LocationData[] = useMemo(() => {
        if (!sales.length) return [];

        const start = startDate ? new Date(startDate) : new Date(oldestDate);
        const end = endDate ? new Date(endDate) : new Date(today);
        end.setHours(23, 59, 59, 999);

        const filtered = sales.filter((sale) => {
            const saleDate = new Date(sale.saleDate);
            return saleDate >= start && saleDate <= end;
        });

        const locations = Array.from(
            new Set(filtered.map((s) => s.location?.name || "Unknown"))
        );

        return locations
            .map((loc) => {
                const locSales = filtered.filter(
                    (s) => (s.location?.name || "Unknown") === loc
                );
                const tonnage = locSales.reduce((sum, sale) => {
                    const saleTonnage =
                        sale.items?.reduce((itemSum, item) => {
                            if (!item.product) return itemSum;
                            return (
                                itemSum +
                                (item.product.weightValue * item.quantity * item.product.packSize) /
                                1000
                            );
                        }, 0) || 0;
                    return sum + saleTonnage;
                }, 0);
                return { location: loc, tonnage: Number(tonnage.toFixed(2)) };
            })
            .sort((a, b) => b.tonnage - a.tonnage);
    }, [sales, startDate, endDate, oldestDate, today]);

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            {/* Header */}
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" /> Sales by Location (Tonnage)
            </h3>

            {/* Date Selector */}
            <SimpleDateRangeSelector
                start={startDate}
                end={endDate}
                setStart={setStartDate}
                setEnd={setEndDate}
                oldestDate={oldestDate}
                today={today}
            />

            {/* Chart */}
            <div className="relative flex-1 flex flex-col">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : locationData.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center text-sm text-gray-500">
                        No sales data for selected range
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="tonnage" radius={[6, 6, 0, 0]} fill="#16a34a">
                                {locationData.map((_, idx) => (
                                    <Cell key={`cell-${idx}`} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div >
    );
}
