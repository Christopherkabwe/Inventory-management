"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

interface CreditNote {
    id: string;
    creditNoteNumber: string;
    saleId: string;
    saleInvoiceNumber: string;
    customerName: string;
    amount: number;
    reason: string;
    createdAt: string;
    saleReturnId?: string; // link to sale return
    saleReturnNumber?: string;
}

export default function CreditNotesPage() {
    const [creditNotes, setCreditNotes] = useState<CreditNote[]>([]);
    const [loading, setLoading] = useState(false);
    const [filters, setFilters] = useState({
        customer: "",
        invoiceNumber: "",
        startDate: "",
        endDate: "",
    });

    const router = useRouter();

    const fetchCreditNotes = async () => {
        setLoading(true);
        try {
            const params: any = {};

            if (filters.customer) params.customer = filters.customer;
            if (filters.invoiceNumber) params.invoiceNumber = filters.invoiceNumber;
            if (filters.startDate) params.startDate = filters.startDate;
            if (filters.endDate) params.endDate = filters.endDate;

            const res = await axios.get("/api/credit-notes", { params });
            setCreditNotes(res.data);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch credit notes");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditNotes();
    }, []);

    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
    };

    const handleApplyFilters = () => {
        fetchCreditNotes();
    };

    const handleResetFilters = () => {
        setFilters({ customer: "", invoiceNumber: "", startDate: "", endDate: "" });
        fetchCreditNotes();
    };

    return (
        <div className="p-5 bg-white shadow rounded max-w-7xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Credit Notes</h2>

            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-4">
                <input
                    type="text"
                    placeholder="Customer"
                    value={filters.customer}
                    onChange={(e) => handleFilterChange("customer", e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="text"
                    placeholder="Invoice #"
                    value={filters.invoiceNumber}
                    onChange={(e) => handleFilterChange("invoiceNumber", e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="date"
                    placeholder="Start Date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange("startDate", e.target.value)}
                    className="border rounded p-2"
                />
                <input
                    type="date"
                    placeholder="End Date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange("endDate", e.target.value)}
                    className="border rounded p-2"
                />
                <button
                    onClick={handleApplyFilters}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Apply
                </button>
                <button
                    onClick={handleResetFilters}
                    className="bg-gray-300 px-4 py-2 rounded"
                >
                    Reset
                </button>
            </div>

            {/* Table */}
            {loading ? (
                <p>Loading credit notes...</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100 text-left">
                                <th className="border p-2">Credit Note #</th>
                                <th className="border p-2">Invoice #</th>
                                <th className="border p-2">Customer</th>
                                <th className="border p-2">Amount</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Sale Return #</th>
                                <th className="border p-2">Date</th>
                                <th className="border p-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {creditNotes.map((cn) => (
                                <tr key={cn.id} className="whitespace-nowrap">
                                    <td className="border p-2">{cn.creditNoteNumber}</td>
                                    <td className="border p-2">{cn.saleInvoiceNumber}</td>
                                    <td className="border p-2">{cn.customerName}</td>
                                    <td className="border p-2">{cn.amount.toFixed(2)}</td>
                                    <td className="border p-2">{cn.reason}</td>
                                    <td className="border p-2">
                                        {cn.saleReturnNumber ? (
                                            <button
                                                className="text-blue-600 underline"
                                                onClick={() =>
                                                    router.push(`/sales/sales-returns/${cn.saleInvoiceNumber}`)
                                                }
                                            >
                                                {cn.saleReturnNumber}
                                            </button>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td className="border p-2">{new Date(cn.createdAt).toLocaleDateString()}</td>
                                    <td className="border p-2">
                                        <button
                                            className="bg-purple-600 text-white px-3 py-1 rounded"
                                            onClick={() => router.push(`/sales/credit-notes/${cn.id}`)}
                                        >
                                            View
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {creditNotes.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="text-center p-4">
                                        No credit notes found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
