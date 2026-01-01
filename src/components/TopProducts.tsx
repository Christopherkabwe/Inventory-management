"use client";

import { useEffect, useMemo, useState } from "react";
import { Star } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface SaleItem {
    product: {
        id: string;
        name: string;
        weightValue?: number; // in kg
        packSize?: number;    // units per pack
    };
    quantity: number;
    price: number;
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
}

interface ProductRow {
    id: string;
    name: string;
    qty: number;
    totalValue: number;
    tonnage: number; // in tons
}

interface Props {
    title?: string;
    iconColor?: string;
    limit?: number;
}

/* ---------------- COMPONENT ---------------- */
export default function TopProducts({
    title = "Top Products (Last 30 Days)",
    iconColor = "text-yellow-400",
    limit = 5,
}: Props) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    /* ---------------- FETCH SALES ---------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales");
                const json = await res.json();
                const data: Sale[] = json.data || [];
                setSales(data);
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, []);

    /* ---------------- COMPUTE TOP PRODUCTS (LAST 30 DAYS) ---------------- */
    const topProducts: ProductRow[] = useMemo(() => {
        const map = new Map<string, ProductRow>();
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - 30);

        sales.forEach(sale => {
            const saleDate = new Date(sale.saleDate);
            if (saleDate < cutoffDate) return; // Only last 30 days

            sale.items?.forEach(item => {
                const id = item.product.id;
                const name = item.product.name;
                const weight = item.product.weightValue || 0;
                const packSize = item.product.packSize || 1;

                if (!map.has(id)) {
                    map.set(id, { id, name, qty: 0, totalValue: 0, tonnage: 0 });
                }

                const entry = map.get(id)!;
                entry.qty += item.quantity;
                entry.totalValue += item.quantity * item.price;
                entry.tonnage += (weight * item.quantity * packSize) / 1000; // convert kg to tons
            });
        });

        return Array.from(map.values())
            .sort((a, b) => b.qty - a.qty)
            .slice(0, limit);
    }, [sales, limit]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            {loading ? (
                <p className="flex justify-center items-center h-24 text-gray-500">
                    Loading...
                </p>
            ) : topProducts.length === 0 ? (
                <p className="text-sm text-gray-500">No products sold in the last 30 days.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="px-2 py-1 border-r text-left">Product</th>
                                <th className="px-2 py-1 border-r text-center">Quantity</th>
                                <th className="px-2 py-1 border-r text-center">Tonnage</th>
                                <th className="px-2 py-1 border-r text-center">Total Value</th>

                            </tr>
                        </thead>
                        <tbody>
                            {topProducts.map((product, index) => (
                                <tr
                                    key={product.id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-2 py-1 truncate">
                                        {index + 1}. {product.name}
                                    </td>
                                    <td className="px-2 py-1 text-center">{product.qty} units</td>
                                    <td className="px-2 py-1 text-center font-bold text-purple-500">
                                        {product.tonnage.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 text-center font-bold text-purple-500">
                                        K{product.totalValue.toFixed(2)}
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
