"use client";

import { useState } from "react";

type SalesOrderItem = {
    id: string;
    product: { id: string; name: string };
    quantity: number;
    quantityInvoiced: number;
};

type Props = {
    orderId: string;
    orderNumber: string;
    items: SalesOrderItem[];
    onClose: () => void;
    onInvoiceCreated: () => void;
};

export default function InvoiceModal({ orderId, orderNumber, items, onClose, onInvoiceCreated }: Props) {
    const [loading, setLoading] = useState(false);

    const createInvoice = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rbac/sales-flow/invoice", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ salesOrderId: orderId }),
            });

            if (res.ok) {
                alert("Invoice created successfully!");
                onInvoiceCreated();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create invoice");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while creating invoice");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">Create Invoice for Order #{orderNumber}</h2>
                <div className="mb-4">
                    <h3 className="font-semibold">Items:</h3>
                    {items.map((i) => (
                        <div key={i.id} className="flex justify-between py-1 border-b">
                            <span>{i.product.name}</span>
                            <span>
                                {i.quantityInvoiced}/{i.quantity} invoiced
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createInvoice}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "opacity-50" : ""}`}
                        disabled={loading}
                    >
                        {loading ? "Creating..." : "Create Invoice"}
                    </button>
                </div>
            </div>
        </div>
    );
}
