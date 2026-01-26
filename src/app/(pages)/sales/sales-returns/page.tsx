"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface InvoiceItem {
    id: string;
    quantity: number;
    quantityDelivered: number;
    quantityInvoiced: number;
    quantityReturned: number;
}

interface Invoice {
    id: string;
    quantity: number;
    quantityDelivered: number;
    quantityInvoiced: number;
    quantityReturned: number;
    invoiceNumber: string;
    total: number;
    paid: number;
    saleDate: string;
    status: string;
    customer: { id: string; name: string }
    location: { id: string; name: string }
    items: InvoiceItem[];
}

export default function SalesReturnsList() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const fetchInvoices = async () => {
            setLoading(true);
            try {
                const res = await axios.get("/api/invoices"); // all invoices
                setInvoices(res.data);
                console.log(res.data)
            } catch (err) {
                alert("Failed to fetch invoices");
            } finally {
                setLoading(false);
            }
        };
        fetchInvoices();
    }, []);

    const getTotalQuantity = (items: any[]) =>
        items.reduce((sum, item) => sum + item.quantity, 0);

    const getTotalDelivered = (items: any[]) =>
        items.reduce((sum, item) => sum + item.quantityDelivered, 0);

    const getTotalInvoiced = (items: any[]) =>
        items.reduce((sum, item) => sum + item.quantityInvoiced, 0);

    const getTotalReturned = (items: any[]) =>
        items.reduce((sum, item) => sum + item.quantityReturned, 0);

    return (
        <div className="p-4 w-full mx-auto bg-white shadow rounded">
            <h2 className="text-xl font-bold mb-4">Select Invoice for Return</h2>
            <div className="w-full">
                {loading ? (
                    <p>Loading invoices...</p>
                ) : (
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Invoice #</th>
                                <th className="border p-2">Customer</th>
                                <th className="border p-2">Location</th>
                                <th className="border p-2">Quantity</th>
                                <th className="border p-2">Qty Delivered</th>
                                <th className="border p-2">Qty Returned</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Status</th>
                                <th className="border p-2">Total Amount</th>
                                <th className="border p-2">Paid</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv.id} className="whitespace-nowrap">
                                    <td className="border p-2">{inv.invoiceNumber}</td>
                                    <td className="border p-2">{inv.customer.name}</td>
                                    <td className="border p-2">{inv.location.name}</td>
                                    <td className="border p-2">
                                        {getTotalQuantity(inv.items)}
                                    </td>
                                    <td className="border p-2">
                                        {getTotalDelivered(inv.items)}
                                    </td>
                                    <td className="border p-2">
                                        {getTotalReturned(inv.items)}
                                    </td>
                                    <td className="border p-2">{new Date(inv.saleDate).toLocaleDateString()}</td>
                                    <td className="border p-2">{inv.status}</td>
                                    <td className="border p-2">{inv.total.toFixed(2)}</td>
                                    <td className="border p-2">{inv.paid.toFixed(2)}</td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-purple-600 text-white px-3 py-1 rounded"
                                            onClick={() =>
                                                router.push(`/sales/sales-returns/${inv.invoiceNumber}`)
                                            }
                                        >
                                            Return
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
