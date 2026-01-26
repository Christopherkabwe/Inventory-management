"use client";

import { useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, FileText } from "lucide-react";

/* =======================
   TYPES
======================= */
type Invoice = {
    id: string;
    invoiceNumber: string;
    status:
    | "PENDING"
    | "CONFIRMED"
    | "PARTIALLY_INVOICED"
    | "PARTIALLY_PAID"
    | "PAID"
    | "CANCELLED";
    createdAt: string;
    totalAmount: number;
};

/* =======================
   STATUS STYLES
======================= */
const statusStyles: Record<string, string> = {
    PAID: "bg-green-100 text-green-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    PARTIALLY_PAID: "bg-yellow-100 text-yellow-800",
    PARTIALLY_INVOICED: "bg-orange-100 text-orange-800",
    PENDING: "bg-red-100 text-red-800",
    CANCELLED: "bg-zinc-200 text-zinc-700",
};

/* =======================
   COMPONENT
======================= */
export default function InvoicesPage() {
    const fetchedRef = useRef(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const salesOrderId = searchParams.get("salesOrderId");

    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!salesOrderId || fetchedRef.current) return;

        fetchedRef.current = true;

        const fetchInvoices = async () => {
            try {
                const res = await fetch(
                    `/api/invoices/invoice-list?salesOrderId=${salesOrderId}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch invoices");
                }

                const data = await res.json();
                setInvoices(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchInvoices();
    }, [salesOrderId]);

    return (
        <div>
            <div className="max-w-5xl mx-auto px-4">

                {/* BACK */}
                <button
                    onClick={() => router.back()}
                    className="mb-4 inline-flex items-center gap-2 text-sm text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* HEADER */}
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-zinc-800">
                        Sales Order Invoices
                    </h1>
                    <p className="text-sm text-zinc-500">
                        Invoices created from this sales order
                    </p>
                </div>

                {/* STATES */}
                {loading && (
                    <p className="text-sm text-zinc-500">Loading invoices…</p>
                )}

                {error && (
                    <p className="text-sm text-red-600">{error}</p>
                )}

                {!loading && invoices.length === 0 && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-6 text-center">
                        <p className="text-yellow-800 font-medium">
                            No invoices found for this sales order.
                        </p>
                    </div>
                )}

                {/* TABLE */}
                {invoices.length > 0 && (
                    <div className="bg-white rounded-xl shadow overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead className="bg-zinc-100 border-b">
                                <tr>
                                    <th className="px-4 py-3 text-left">Invoice No</th>
                                    <th className="px-4 py-3 text-left">Date</th>
                                    <th className="px-4 py-3 text-center">Status</th>
                                    <th className="px-4 py-3 text-right">Total</th>
                                    <th className="px-4 py-3 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map(invoice => (
                                    <tr key={invoice.id} className="border-t">
                                        <td className="px-4 py-3 font-medium">
                                            {invoice.invoiceNumber}
                                        </td>
                                        <td className="px-4 py-3">
                                            {new Date(invoice.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${statusStyles[invoice.status]}`}
                                            >
                                                {invoice.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            K{invoice.totalAmount.toFixed(2)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() =>
                                                    router.push(`/sales/invoices/${invoice.id}`)
                                                }
                                                className="inline-flex items-center gap-1 text-blue-600 hover:underline cursor-pointer"
                                            >
                                                <FileText className="h-4 w-4" />
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
        </div>
    );
}
