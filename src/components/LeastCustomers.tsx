"use client";

import { useEffect, useState } from "react";
import { AlertTriangle } from "lucide-react";

interface Product {
    id: string;
    name: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    price: number;
}

interface SaleItem {
    product: Product;
    quantity: number;
}

interface CustomerSale {
    id: string;
    customer: { id: string; name: string };
    items: SaleItem[];
    saleDate: string;
}

export default function LeastCustomers({
    title = "Least Active Customers (Last 3 Months",
    iconColor = "text-red-500",
    limit = 5,
}: { title?: string; iconColor?: string; limit?: number } = {}) {
    const [sales, setSales] = useState<CustomerSale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/sales"); // adjust endpoint if needed
                const data = await res.json();
                setSales(data.sales || []);
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    const L3Months = new Date();
    L3Months.setDate(L3Months.getDate() - 90);

    // Aggregate sales by customer
    const customersWithStats = Object.values(
        sales
            .filter((s) => new Date(s.saleDate) >= L3Months)
            .reduce((acc: Record<string, any>, sale) => {
                const custId = sale.customer.id;
                if (!acc[custId]) {
                    acc[custId] = {
                        id: custId,
                        name: sale.customer.name,
                        totalTonnage: 0,
                        totalValue: 0,
                        purchaseCount: 0,
                    };
                }

                const saleTonnage = sale.items.reduce((sum, item) => {
                    const weightInKg =
                        item.product.weightUnit === "kg"
                            ? item.product.weightValue
                            : item.product.weightValue / 1000;
                    return sum + (weightInKg * item.quantity * (item.product.packSize || 1)) / 1000; // tons
                }, 0);

                const saleValue = sale.items.reduce(
                    (sum, item) => sum + item.product.price * item.quantity,
                    0
                );

                acc[custId].totalTonnage += saleTonnage;
                acc[custId].totalValue += saleValue;
                acc[custId].purchaseCount += 1;

                return acc;
            }, {})
    );

    // Sort by least tonnage
    const sortedCustomers = customersWithStats.sort((a, b) => a.totalTonnage - b.totalTonnage);
    const displayedCustomers = sortedCustomers.slice(0, limit);

    return (
        <div className="bg-white p-2 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            {loading ? (
                <p className="text-sm text-gray-500">Loading...</p>
            ) : displayedCustomers.length === 0 ? (
                <p className="text-sm text-gray-500">No customers found.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="px-2 py-1 border-r text-left">#</th>
                                <th className="px-2 py-1 border-r text-left">Customer</th>
                                <th className="px-2 py-1 border-r text-center">Purchases</th>
                                <th className="px-2 py-1 border-r text-center">Tonnage</th>
                                <th className="px-2 py-1 border-r text-center">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedCustomers.map((customer, index) => (
                                <tr
                                    key={customer.id}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-2 py-1 text-left">{index + 1}</td>
                                    <td className="px-2 py-1 truncate">{customer.name}</td>
                                    <td className="px-2 py-1 text-center font-bold text-purple-600">
                                        {customer.purchaseCount}
                                    </td>
                                    <td className="px-2 py-1 text-center font-bold text-green-600">
                                        {customer.totalTonnage.toFixed(2)} tons
                                    </td>
                                    <td className="px-2 py-1 text-center font-bold text-blue-600">
                                        K{customer.totalValue.toFixed(0)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {sortedCustomers.length > limit && (
                <p className="text-sm text-gray-500 mt-2">
                    Showing bottom {limit} customers.
                </p>
            )}
        </div>
    );
}
