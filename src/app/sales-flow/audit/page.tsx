"use client";

import { useEffect, useState } from "react";

type SaleType = {
    id: string;
    invoiceNumber: string;
    status: string;
    saleDate: string;
    customer: { id: string; name: string };
    location: { id: string; name: string };
    totalItems: number;
    returnedItems: number;
    creditNotesCount: number;
};

export default function SalesAuditDashboard() {
    const [sales, setSales] = useState<SaleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "PARTIALLY_INVOICED" | "CONFIRMED">("ALL");

    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch(`/api/rbac/sales-flow/audit?status=${statusFilter}`);
            const data = await res.json();
            setSales(data.sales || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, [statusFilter]);

    // Aggregate metrics
    const totalSales = sales.length;
    const totalReturns = sales.reduce((acc, s) => acc + (s.returnedItems || 0), 0);
    const totalCreditNotes = sales.reduce((acc, s) => acc + (s.creditNotesCount || 0), 0);

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold">Sales Audit & Reporting</h1>

            {/* Filters */}
            <div className="flex gap-4 items-center">
                <label>Status:</label>
                <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as any)}
                    className="border rounded px-2 py-1"
                >
                    <option value="ALL">All</option>
                    <option value="PENDING">Pending</option>
                    <option value="PARTIALLY_INVOICED">Partially Invoiced</option>
                    <option value="CONFIRMED">Confirmed</option>
                </select>
                <button
                    onClick={fetchSales}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Refresh
                </button>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                <div className="bg-gray-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Sales</h2>
                    <p className="text-xl">{totalSales}</p>
                </div>
                <div className="bg-yellow-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Returns</h2>
                    <p className="text-xl">{totalReturns}</p>
                </div>
                <div className="bg-green-100 p-4 rounded shadow">
                    <h2 className="font-semibold">Total Credit Notes</h2>
                    <p className="text-xl">{totalCreditNotes}</p>
                </div>
            </div>

            {/* Sales Table */}
            <div className="overflow-x-auto">
                <table className="min-w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 border">Invoice</th>
                            <th className="px-4 py-2 border">Customer</th>
                            <th className="px-4 py-2 border">Location</th>
                            <th className="px-4 py-2 border">Status</th>
                            <th className="px-4 py-2 border">Total Items</th>
                            <th className="px-4 py-2 border">Returned</th>
                            <th className="px-4 py-2 border">Credit Notes</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    Loading...
                                </td>
                            </tr>
                        ) : sales.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4">
                                    No sales found
                                </td>
                            </tr>
                        ) : (
                            sales.map((s) => (
                                <tr key={s.id}>
                                    <td className="px-4 py-2 border">{s.invoiceNumber}</td>
                                    <td className="px-4 py-2 border">{s.customer.name}</td>
                                    <td className="px-4 py-2 border">{s.location.name}</td>
                                    <td className="px-4 py-2 border">{s.status}</td>
                                    <td className="px-4 py-2 border">{s.totalItems}</td>
                                    <td className="px-4 py-2 border">{s.returnedItems}</td>
                                    <td className="px-4 py-2 border">{s.creditNotesCount}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
