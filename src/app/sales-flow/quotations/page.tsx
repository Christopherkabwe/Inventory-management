"use client";

import { useState, useEffect } from "react";

type QuotationItem = {
    productId: string;
    product: { name: string };
    quantity: number;
    price: number;
    total: number;
};

type Quotation = {
    id: string;
    quoteNumber: string;
    status: string;
    items: QuotationItem[];
    customer: { name: string };
};

export default function QuotationsPage() {
    const [quotations, setQuotations] = useState<Quotation[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchQuotations = async () => {
        setLoading(true);
        const res = await fetch("/api/rbac/sales-flow/quotation");
        const data = await res.json();
        setQuotations(data.quotations || []);
        setLoading(false);
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    const approveQuotation = async (id: string) => {
        const res = await fetch("/api/rbac/sales-flow/order", {
            method: "POST",
            body: JSON.stringify({ quotationId: id }),
            headers: { "Content-Type": "application/json" },
        });
        if (res.ok) {
            alert("Sales Order created from quotation!");
            fetchQuotations();
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Quotations</h1>
            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="p-2">Quote #</th>
                        <th className="p-2">Customer</th>
                        <th className="p-2">Status</th>
                        <th className="p-2">Items</th>
                        <th className="p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {quotations.map((q) => (
                        <tr key={q.id} className="border-t border-gray-200">
                            <td className="p-2">{q.quoteNumber}</td>
                            <td className="p-2">{q.customer.name}</td>
                            <td className="p-2">{q.status}</td>
                            <td className="p-2">
                                {q.items.map((i) => (
                                    <div key={i.productId}>
                                        {i.product.name} x {i.quantity}
                                    </div>
                                ))}
                            </td>
                            <td className="p-2">
                                {q.status === "APPROVED" && (
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded"
                                        onClick={() => approveQuotation(q.id)}
                                    >
                                        Create Order
                                    </button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
