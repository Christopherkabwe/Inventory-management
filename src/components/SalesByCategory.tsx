"use client";

import { useEffect, useMemo, useState } from "react";
import { Calendar } from "lucide-react";

interface SaleItem {
    product: {
        id: string;
        name: string;
        category: string;
        price: number;
        weightValue?: number; // in kg
        packSize?: number; // units per pack
    };
    quantity: number;
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
}

interface CategoryData {
    qty: number;
    totalValue: number;
    tonnage: number; // in tons
    avgOrderValue: number;
}

export default function SalesByCategory() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch sales data
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales");
                if (!res.ok) throw new Error(`HTTP ${res.status}`);
                const json = await res.json();
                setSales(json.sales || []);
            } catch (err) {
                console.error("Failed to fetch sales:", err);
                setSales([]);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    // Calculate sales by category for last 30 days
    const salesByCategory: Record<string, CategoryData> = useMemo(() => {
        if (!sales.length) return {};

        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        return sales.reduce((acc, sale) => {
            const saleDate = new Date(sale.saleDate);
            if (saleDate < cutoff) return acc;

            sale.items.forEach(item => {
                const category = item.product.category || "Uncategorized";
                if (!acc[category]) acc[category] = { qty: 0, totalValue: 0, tonnage: 0, avgOrderValue: 0 };

                const weightPerUnit = item.product.weightValue || 0; // kg
                const packSize = item.product.packSize || 1;

                acc[category].qty += item.quantity;
                acc[category].totalValue += item.quantity * item.product.price;
                acc[category].tonnage += (weightPerUnit * item.quantity * packSize) / 1000; // convert to tons
            });

            return acc;
        }, {} as Record<string, CategoryData>);
    }, [sales]);

    // Compute average order value per category
    const salesByCategoryWithAvg = useMemo(() => {
        return Object.entries(salesByCategory).reduce((acc, [category, data]) => {
            acc[category] = {
                ...data,
                avgOrderValue: data.qty > 0 ? data.totalValue / data.qty : 0,
            };
            return acc;
        }, {} as Record<string, CategoryData>);
    }, [salesByCategory]);

    return (
        <div className="bg-white p-2 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Calendar className="h-5 w-5 text-blue-500" />
                Sales by Category (Last 30 Days)
            </h3>

            {loading ? (
                <p className="flex justify-center items-center h-24 text-gray-500">
                    Loading...
                </p>
            ) : Object.keys(salesByCategoryWithAvg).length === 0 ? (
                <p className="text-sm text-gray-500">No sales data.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="px-2 py-1 border-r text-left">Category</th>
                                <th className="px-2 py-1 border-r text-center">Quantity</th>
                                <th className="px-2 py-1 border-r text-center">Total Value</th>
                                <th className="px-2 py-1 border-r text-center">Tonnage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {Object.entries(salesByCategoryWithAvg).map(([category, data]) => (
                                <tr key={category} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-2 py-1 truncate">{category}</td>
                                    <td className="px-2 py-1 text-center">{data.qty} units</td>
                                    <td className="px-2 py-1 text-center">
                                        K{data.totalValue.toFixed(0)}
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        {data.tonnage.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
