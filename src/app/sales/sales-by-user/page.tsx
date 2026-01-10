// app/sales-by-user/page.tsx
"use client";

import { useEffect, useState } from "react";

type SaleItem = {
    product: string;
    sku: string;
    quantity: number;
    price: number;
    total: number;
};

type CreditNote = {
    number: string;
    amount: number;
    reason: string;
    createdBy: string;
};

type SaleReturn = {
    returnNumber: string;
    product: string;
    quantity: number;
    reason: string;
    createdBy: string;
};

type DeliveryNoteItem = {
    product: string;
    quantityDelivered: number;
};

type DeliveryNote = {
    deliveryNoteNo: string;
    transporter: string;
    dispatchedAt: string;
    createdBy: string;
    items: DeliveryNoteItem[];
};

type SaleReport = {
    saleId: string;
    invoiceNumber: string;
    saleDate: string;
    status: string;
    location: string;
    customer: string;
    customerEmail: string;
    assignedUser: string;
    createdBy: string;
    transporter: string;
    items: SaleItem[];
    creditNotes: CreditNote[];
    returns: SaleReturn[];
    deliveryNotes: DeliveryNote[];
};

export default function SalesByUserPage() {
    const [sales, setSales] = useState<SaleReport[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSales() {
            try {
                const res = await fetch("/api/sales/sales-by-user");
                if (!res.ok) throw new Error("Failed to fetch sales report");
                const data = await res.json();
                setSales(data.report || []);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSales();
    }, []);

    if (loading) return <p className="p-4 text-gray-500">Loading sales report...</p>;
    if (error) return <p className="p-4 text-red-500">Error: {error}</p>;

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Sales by User Report</h1>

            {sales.length === 0 && (
                <p className="text-gray-600">No sales data available for your access level.</p>
            )}

            {sales.map((sale) => (
                <div
                    key={sale.saleId}
                    className="mb-8 p-4 border rounded-lg bg-white shadow-sm"
                >
                    <div className="flex justify-between mb-2">
                        <div>
                            <p>
                                <span className="font-semibold">Invoice:</span> {sale.invoiceNumber}
                            </p>
                            <p>
                                <span className="font-semibold">Date:</span> {new Date(sale.saleDate).toLocaleDateString()}
                            </p>
                            <p>
                                <span className="font-semibold">Status:</span> {sale.status}
                            </p>
                        </div>
                        <div className="text-right">
                            <p>
                                <span className="font-semibold">Customer:</span> {sale.customer}
                            </p>
                            <p>
                                <span className="font-semibold">Assigned User:</span> {sale.assignedUser || "-"}
                            </p>
                            <p>
                                <span className="font-semibold">Location:</span> {sale.location}
                            </p>
                        </div>
                    </div>

                    <h3 className="font-semibold mt-4 mb-2">Items</h3>
                    <table className="w-full text-left border-collapse mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-2 py-1 border">SKU</th>
                                <th className="px-2 py-1 border">Product</th>
                                <th className="px-2 py-1 border">Quantity</th>
                                <th className="px-2 py-1 border">Price</th>
                                <th className="px-2 py-1 border">Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item, idx) => (
                                <tr key={idx} className="border-t">
                                    <td className="px-2 py-1 border">{item.sku}</td>
                                    <td className="px-2 py-1 border">{item.product}</td>
                                    <td className="px-2 py-1 border">{item.quantity}</td>
                                    <td className="px-2 py-1 border">{item.price.toFixed(2)}</td>
                                    <td className="px-2 py-1 border">{item.total.toFixed(2)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {sale.creditNotes.length > 0 && (
                        <>
                            <h3 className="font-semibold mt-2 mb-1">Credit Notes</h3>
                            <ul className="list-disc ml-5 text-sm text-gray-700">
                                {sale.creditNotes.map((cn, idx) => (
                                    <li key={idx}>
                                        {cn.number} - {cn.amount.toFixed(2)} ({cn.reason}) by {cn.createdBy}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {sale.returns.length > 0 && (
                        <>
                            <h3 className="font-semibold mt-2 mb-1">Sale Returns</h3>
                            <ul className="list-disc ml-5 text-sm text-gray-700">
                                {sale.returns.map((ret, idx) => (
                                    <li key={idx}>
                                        {ret.returnNumber} - {ret.product} x {ret.quantity} ({ret.reason}) by {ret.createdBy}
                                    </li>
                                ))}
                            </ul>
                        </>
                    )}

                    {sale.deliveryNotes.length > 0 && (
                        <>
                            <h3 className="font-semibold mt-2 mb-1">Delivery Notes</h3>
                            {sale.deliveryNotes.map((dn, idx) => (
                                <div key={idx} className="mb-2 border p-2 rounded bg-gray-50">
                                    <p>
                                        <span className="font-semibold">Note:</span> {dn.deliveryNoteNo} |
                                        <span className="font-semibold"> Transporter:</span> {dn.transporter} |
                                        <span className="font-semibold"> Dispatched:</span> {new Date(dn.dispatchedAt).toLocaleDateString()} |
                                        <span className="font-semibold"> Created By:</span> {dn.createdBy}
                                    </p>
                                    <ul className="list-disc ml-5 text-sm text-gray-700 mt-1">
                                        {dn.items.map((di, idx) => (
                                            <li key={idx}>
                                                {di.product} - Delivered: {di.quantityDelivered}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </>
                    )}
                </div>
            ))}
        </div>
    );
}
