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
} from "recharts";
import CustomTooltip from "../CustomTooltip";
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

export default function SalesByLocation({
    sales,
    loading,
    oldestDate,
}: {
    sales?: Sale[];
    loading?: boolean;
    oldestDate?: string | null;
}) {
    const today = new Date().toISOString().split("T")[0];

    /* ---------------- UI STATE ---------------- */
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState(today);

    /* ---------------- SYNC DEFAULT RANGE ---------------- */
    useEffect(() => {
        if (!oldestDate) return;
        setStartDate(oldestDate);
        setEndDate(today);
    }, [oldestDate, today]);

    /* ---------------- COMPUTE TONNAGE ---------------- */
    const locationData: LocationData[] = useMemo(() => {
        if (!sales || !sales.length || !startDate) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const map: Record<string, number> = {};

        for (const sale of sales) {
            const saleDate = new Date(sale.saleDate);
            if (saleDate < start || saleDate > end) continue;

            const location = sale.location?.name || "Unknown";

            for (const item of sale.items) {
                const tonnage =
                    (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                map[location] = (map[location] || 0) + tonnage;
            }
        }

        return Object.entries(map)
            .map(([location, tonnage]) => ({
                location,
                tonnage: Number(tonnage.toFixed(2)),
            }))
            .sort((a, b) => b.tonnage - a.tonnage);
    }, [sales, startDate, endDate]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                Sales by Location (Tonnage)
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

            <div className="flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : locationData.length === 0 ? (
                    <div className="flex justify-center items-center h-[250px] text-sm text-gray-500">
                        No sales data for selected range
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip />} />
                            <Bar dataKey="tonnage" fill="#16a34a" radius={[6, 6, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>
        </div>
    );
}
