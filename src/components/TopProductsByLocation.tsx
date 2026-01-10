"use client";

import { useEffect, useMemo, useState } from "react";
import { BarChart3 } from "lucide-react";

interface SaleItem {
    quantity: number;
    product: {
        name: string;
        weightValue: number;
        packSize: number;
        price?: number;
    };
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

export default function TopProductsByLocation({ sales, loading }: Props) {
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
       COMPUTE TOP PRODUCTS
    ----------------------------- */
    const topProductsByLocation: LocationProducts[] = useMemo(() => {
        if (!sales.length || !startDate || !endDate) return [];

        const start = new Date(startDate);
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);

        const filteredSales = sales.filter((s) => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const locations = Array.from(
            new Set(filteredSales.map((s) => s.location?.name || "Unknown"))
        );

        return locations.map((location) => {
            const productMap = new Map<string, ProductData>();

            filteredSales
                .filter((s) => (s.location?.name || "Unknown") === location)
                .forEach((sale) => {
                    sale.items.forEach((item) => {
                        const product = item.product;
                        if (!product) return;

                        const name = product.name;
                        const tonnage =
                            (product.weightValue *
                                product.packSize *
                                item.quantity) /
                            1000;

                        const value =
                            item.quantity * (product.price ?? 0);

                        const existing = productMap.get(name);

                        if (existing) {
                            existing.tonnage += tonnage;
                            existing.value += value;
                        } else {
                            productMap.set(name, {
                                name,
                                tonnage,
                                value,
                            });
                        }
                    });
                });

            const products = Array.from(productMap.values())
                .sort((a, b) => b.tonnage - a.tonnage)
                .slice(0, 5);

            return {
                location,
                products,
                totalValue: products.reduce(
                    (sum, p) => sum + p.value,
                    0
                ),
            };
        });
    }, [sales, startDate, endDate]);

    /* -----------------------------
       RENDER
    ----------------------------- */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600" />
                Top Products by Location
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
                            <div
                                key={loc.location}
                                className="border rounded-lg p-3"
                            >
                                <h4 className="font-semibold text-sm mb-1">
                                    {loc.location}
                                </h4>

                                <table className="w-full text-xs">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-1 font-normal">
                                                Product
                                            </th>
                                            <th className="text-right py-1 font-normal">
                                                Tonnage
                                            </th>
                                            <th className="text-right py-1 font-normal">
                                                Value
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {loc.products.map((p) => (
                                            <tr key={p.name}>
                                                <td className="py-1">
                                                    {p.name}
                                                </td>
                                                <td className="text-right py-1">
                                                    {p.tonnage.toFixed(2)}
                                                </td>
                                                <td className="text-right py-1">
                                                    {p.value.toFixed(2)}
                                                </td>
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
