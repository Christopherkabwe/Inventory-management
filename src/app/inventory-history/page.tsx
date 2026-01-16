"use client";

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import DashboardLayout from "@/components/DashboardLayout";
import FiltersClient, { ClientFilters } from "@/components/FiltersClient";

interface InventoryHistoryRow {
    date: string;
    product: string;
    location: string;
    delta: number;
    balance: number;
    tonnage: number;
    reference: string;
    sku: string;
    category?: string;
    packSize?: number;
    weightValue?: number;
    weightUnit?: string;
}

export default function InventoryHistoryPage() {
    const [rows, setRows] = useState<InventoryHistoryRow[]>([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<ClientFilters>({
        products: [],
        categories: [],
        locations: [],
        users: [],
        search: "",
    });

    // Fetch data when filters change
    useEffect(() => {
        setLoading(true);
        const params = new URLSearchParams();
        filters.products.forEach((p) => params.append("products", p));
        filters.categories.forEach((c) => params.append("categories", c));
        filters.locations.forEach((l) => params.append("locations", l));
        if (filters.search) params.set("search", filters.search);

        fetch(`/api/rbac/inventory-history?${params.toString()}`)
            .then((res) => res.json())
            .then((data) => setRows(data))
            .finally(() => setLoading(false));
    }, [filters]);

    return (
        <DashboardLayout>
            <div className="p-6 space-y-4">
                <h1 className="text-2xl font-semibold">Inventory History</h1>

                <FiltersClient onChange={setFilters} />

                <Card className="rounded-2xl shadow-sm">
                    <CardContent className="p-4">
                        {loading ? (
                            <p>Loading inventory history…</p>
                        ) : rows.length === 0 ? (
                            <p className="text-gray-500">No inventory history found.</p>
                        ) : (
                            <table className="w-full border-collapse text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Date</th>
                                        <th className="text-left p-2">SKU</th>
                                        <th className="text-left p-2">Product</th>
                                        <th className="text-left p-2">Category</th>
                                        <th className="text-left p-2">Pack Size</th>
                                        <th className="text-left p-2">Weight</th>
                                        <th className="text-left p-2">Location</th>
                                        <th className="text-left p-2">Qty Change</th>
                                        <th className="text-left p-2">Balance</th>
                                        <th className="text-left p-2">Tonnage (t)</th>
                                        <th className="text-left p-2">Reference</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {rows.map((r, i) => (
                                        <tr key={`${r.date}-${r.product}-${r.location}`} className="border-b last:border-0">
                                            <td className="p-2">{new Date(r.date).toLocaleString()}</td>
                                            <td className="p-2">{r.sku}</td>
                                            <td className="p-2">{r.product}</td>
                                            <td className="p-2">{r.category}</td>
                                            <td className="p-2">{r.packSize}</td>
                                            <td className="p-2">{r.weightValue} {r.weightUnit}</td>
                                            <td className="p-2">{r.location}</td>
                                            <td
                                                className={`p-2 ${r.delta > 0
                                                    ? "text-green-600"
                                                    : r.delta < 0
                                                        ? "text-red-600"
                                                        : "text-gray-500"
                                                    }`}
                                            >
                                                {r.delta > 0 ? `+${r.delta}` : r.delta}
                                            </td>
                                            <td className="p-2">{r.balance}</td>
                                            <td className="p-2">{r.tonnage.toFixed(3)}</td>
                                            <td className="p-2">{r.reference}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
