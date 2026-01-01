"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

interface SaleItem {
    quantity: number;
    product: {
        name: string;
        weightValue: number;
        packSize: number;
        price?: number; // optional price per unit
    };
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
    location: {
        name: string;
    } | null;
}

interface ProductData {
    name: string;
    tonnage: number;
    value: number;
}

interface LocationProducts {
    location: string;
    products: ProductData[];
    totalValue: number;
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

export default function TopProductsByLocation() {
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
                    setStartDate(oldestStr);
                    setEndDate(today);
                } else {
                    setOldestDate(today);
                    setStartDate(today);
                    setEndDate(today);
                }
            } catch (err) {
                console.error("Failed to fetch sales:", err);
                setOldestDate(today);
                setStartDate(today);
                setEndDate(today);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, [today]);

    // -----------------------------
    // COMPUTE TOP PRODUCTS BY LOCATION
    // -----------------------------
    const topProductsByLocation: LocationProducts[] = useMemo(() => {
        if (!sales.length) return [];

        const start = new Date(startDate || oldestDate);
        const end = new Date(endDate || today);
        end.setHours(23, 59, 59, 999);

        // Filter sales by date range
        const filtered = sales.filter((s) => {
            const saleDate = new Date(s.saleDate);
            return saleDate >= start && saleDate <= end;
        });

        // Get all locations
        const locations = Array.from(new Set(filtered.map((s) => s.location?.name || "Unknown")));

        return locations.map((loc) => {
            const locSales = filtered.filter((s) => (s.location?.name || "Unknown") === loc);

            const productMap = new Map<string, ProductData>();
            locSales.forEach((sale) => {
                sale.items?.forEach((item) => {
                    if (!item.product) return;
                    const name = item.product.name || "Unknown";
                    const tonnage = (item.product.weightValue * item.quantity * item.product.packSize) / 1000;
                    const value = item.quantity * (item.product.price || 1);

                    if (!productMap.has(name)) {
                        productMap.set(name, { name, tonnage, value });
                    } else {
                        const existing = productMap.get(name)!;
                        existing.tonnage += tonnage;
                        existing.value += value;
                    }
                });
            });

            const products = Array.from(productMap.values())
                .sort((a, b) => b.tonnage - a.tonnage)
                .slice(0, 5);

            const totalValue = products.reduce((sum, p) => sum + p.value, 0);

            return { location: loc, products, totalValue };
        });
    }, [sales, startDate, endDate, oldestDate, today]);

    // -----------------------------
    // RENDER
    // -----------------------------
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" /> Top Products by Location
            </h3>

            <SimpleDateRangeSelector
                start={startDate}
                end={endDate}
                setStart={setStartDate}
                setEnd={setEndDate}
                oldestDate={oldestDate}
                today={today}
            />

            <div className="flex-1 overflow-y-auto max-h-[250px]">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : topProductsByLocation.length === 0 ? (
                    <div className="flex items-center justify-center text-sm text-gray-500">
                        No sales data for selected range
                    </div>
                ) : (
                    <div className="space-y-4">
                        {topProductsByLocation.map((loc) => (
                            <div key={loc.location} className="border rounded-lg p-3">
                                <h4 className="font-semibold text-sm mb-1">{loc.location}</h4>
                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-1 text-sm font-normal">Product</th>
                                            <th className="text-right py-1 text-sm font-normal">Tonnage</th>
                                            <th className="text-right py-1 text-sm font-normal">Value</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loc.products.map((p) => (
                                            <tr key={p.name}>
                                                <td className="py-1">{p.name}</td>
                                                <td className="text-right py-1">{p.tonnage.toFixed(2)}</td>
                                                <td className="text-right py-1">{p.value.toFixed(2)}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
