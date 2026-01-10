"use client";

import { useMemo } from "react";
import { AlertTriangle } from "lucide-react";

/* ---------------- TYPES ---------------- */
interface SaleItem {
    product: {
        id: string;
        name: string;
        weightValue?: number;
        packSize?: number;
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
    tonnage: number;
}

interface Props {
    sales: Sale[];
    loading: boolean;
    limit?: number;
}

export default function LeastProducts({
    sales,
    loading,
    limit = 5,
}: Props) {
    /* ---------------- COMPUTE LEAST-SELLING PRODUCTS ---------------- */
    const leastProducts: ProductRow[] = useMemo(() => {
        if (!sales.length) return [];

        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 30);

        const map = new Map<string, ProductRow>();

        sales.forEach((sale) => {
            if (new Date(sale.saleDate) < cutoff) return;

            sale.items.forEach((item) => {
                const id = item.product.id;
                const name = item.product.name;
                const weight = item.product.weightValue || 0;
                const packSize = item.product.packSize || 1;

                if (!map.has(id)) {
                    map.set(id, {
                        id,
                        name,
                        qty: 0,
                        totalValue: 0,
                        tonnage: 0,
                    });
                }

                const entry = map.get(id)!;
                entry.qty += item.quantity;
                entry.totalValue += item.quantity * item.price;
                entry.tonnage +=
                    (weight * item.quantity * packSize) / 1000;
            });
        });

        return Array.from(map.values())
            .sort((a, b) => a.qty - b.qty)
            .slice(0, limit);
    }, [sales, limit]);

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Least Selling Products (Last 30 Days)
            </h3>

            {loading ? (
                <p className="flex justify-center items-center h-24 text-gray-500">
                    Loading...
                </p>
            ) : leastProducts.length === 0 ? (
                <p className="text-sm text-gray-500">
                    No products sold in the last 30 days.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="px-2 py-1 text-left">Product</th>
                                <th className="px-2 py-1 text-center">Quantity</th>
                                <th className="px-2 py-1 text-center">Tonnage</th>
                                <th className="px-2 py-1 text-center">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {leastProducts.map((p, i) => (
                                <tr key={p.id} className="border-b hover:bg-gray-50">
                                    <td className="px-2 py-1 truncate">
                                        {i + 1}. {p.name}
                                    </td>
                                    <td className="px-2 py-1 text-center">
                                        {p.qty}
                                    </td>
                                    <td className="px-2 py-1 text-center text-red-500 font-semibold">
                                        {p.tonnage.toFixed(2)}
                                    </td>
                                    <td className="px-2 py-1 text-center text-red-500 font-semibold">
                                        K{p.totalValue.toFixed(2)}
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
