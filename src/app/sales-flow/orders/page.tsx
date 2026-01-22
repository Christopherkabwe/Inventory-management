"use client";

import { Fragment, useEffect, useState } from "react";
import InvoiceModal from "@/components/sales-flow/InvoiceModal";

type OrderItem = {
    id: string;
    product: { id: string; name: string };
    quantity: number;
};

type SalesOrder = {
    id: string;
    orderNumber: string;
    status: string;
    customer: { name: string };
    items: OrderItem[];
};

export default function SalesOrdersPage() {
    const [orders, setOrders] = useState<SalesOrder[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<SalesOrder | null>(null);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const toggle = (id: string) =>
        setOpen(prev => ({ ...prev, [id]: !prev[id] }));

    const fetchOrders = async () => {
        const res = await fetch("/api/rbac/sales-flow/orders");
        const data = await res.json();
        setOrders(data || []);
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <div className="p-6 space-y-4">
            <h1 className="text-2xl font-bold">Sales Orders</h1>

            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 border">Order #</th>
                            <th className="p-2 border">Customer</th>
                            <th className="p-2 border">Status</th>
                            <th className="p-2 border">Items</th>
                            <th className="p-2 border">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(o => {
                            const isOpen = open[o.id];

                            return (
                                <Fragment key={o.id}>
                                    {/* SUMMARY ROW */}
                                    <tr className="border-t bg-white">
                                        <td className="px-4 py-2 font-mono">
                                            <button
                                                onClick={() => toggle(o.id)}
                                                className="inline-flex items-center gap-2 hover:underline"
                                            >
                                                {isOpen ? "▼" : "▶"} {o.orderNumber}
                                            </button>
                                        </td>
                                        <td className="px-4 py-2">{o.customer.name}</td>
                                        <td className="px-4 py-2">{o.status}</td>
                                        <td className="px-4 py-2 tabular-nums">
                                            {o.items.length}
                                        </td>
                                        <td className="px-4 py-2">
                                            {o.status !== "CANCELLED" && (
                                                <button
                                                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                    onClick={() => setSelectedOrder(o)}
                                                >
                                                    Create Invoice
                                                </button>
                                            )}
                                        </td>
                                    </tr>

                                    {/* ITEM ROWS */}
                                    {isOpen && (
                                        <>
                                            <tr className="bg-zinc-200 text-xs text-zinc-700">
                                                <th className="px-4 py-2 text-left">Product</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th colSpan={3}></th>
                                            </tr>

                                            {o.items.map(item => (
                                                <tr
                                                    key={item.id}
                                                    className="border-t bg-zinc-50"
                                                >
                                                    <td className="px-4 py-2">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="px-4 py-2 tabular-nums">
                                                        {item.quantity}
                                                    </td>
                                                    <td colSpan={3}></td>
                                                </tr>
                                            ))}
                                        </>
                                    )}
                                </Fragment>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* INVOICE MODAL */}
            {selectedOrder && (
                <InvoiceModal
                    orderId={selectedOrder.id}
                    orderNumber={selectedOrder.orderNumber}
                    items={selectedOrder.items}
                    onClose={() => setSelectedOrder(null)}
                    onInvoiceCreated={fetchOrders}
                />
            )}
        </div>
    );
}
