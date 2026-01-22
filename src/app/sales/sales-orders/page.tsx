"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import Link from "next/link";
import { Plus } from "lucide-react";

type SalesOrderSummary = {
    id: string;
    orderNumber: string;
    customerName: string;
    status: string;
    createdAt: string;
};

const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    COMPLETED: "bg-green-50 text-green-700 border-green-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersListPage() {
    const [orders, setOrders] = useState<SalesOrderSummary[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function fetchOrders() {
            try {
                const res = await fetch("/api/order-flow/orders"); // Fetch all orders
                if (!res.ok) throw new Error("Failed to fetch orders");
                const data = await res.json();
                setOrders(data.orders || []);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchOrders();
    }, []);

    const viewOrder = (id: string) => {
        router.push(`/sales/sales-orders/${id}`);
    };

    return (
        <DashboardLayout>
            <div className="p-2">
                <div className="flex items-center mb-5">
                    <h1 className="text-3xl font-bold">Sales Orders</h1>
                    <button
                        onClick={() => router.push("/sales/sales-orders/create-sales-order")}
                        className="ml-auto inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-green-600 cursor-pointer"
                    >
                        <Plus size={16} />
                        New Sales Order
                    </button>
                </div>

                {loading ? (
                    <p>Loading orders...</p>
                ) : error ? (
                    <p className="text-red-600">{error}</p>
                ) : orders.length === 0 ? (
                    <p>No sales orders found.</p>
                ) : (
                    <div className="overflow-x-auto border rounded-lg shadow-sm">
                        <table className="min-w-full text-sm">
                            <thead className="bg-zinc-100">
                                <tr>
                                    <th className="px-4 py-2 text-left border-b">#</th>
                                    <th className="px-4 py-2 text-left border-b">Order Number</th>
                                    <th className="px-4 py-2 text-left border-b">Customer</th>
                                    <th className="px-4 py-2 text-left border-b">Status</th>
                                    <th className="px-4 py-2 text-left border-b">Date</th>
                                    <th className="px-4 py-2 text-left border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((o, idx) => (
                                    <tr key={o.id} className={`${idx % 2 === 0 ? "bg-white" : "bg-zinc-50"} border-b`}>
                                        <td className="px-4 py-2">{idx + 1}</td>
                                        <td className="px-4 py-2">{o.orderNumber}</td>
                                        <td className="px-4 py-2">{o.customerName}</td>
                                        <td className="px-4 py-2">
                                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${statusStyles[o.status] ?? "bg-zinc-100 text-zinc-700 border-zinc-300"}`}>
                                                {o.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">{new Date(o.createdAt).toLocaleDateString()}</td>
                                        <td className="px-4 py-2">
                                            <button
                                                onClick={() => viewOrder(o.id)}
                                                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
