"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { FileText } from "lucide-react";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface CustomerSummary {
    id: string;
    name: string;
    totalInvoices: number;
    totalInvoiceValue: number;
    totalPaid: number;
    totalCredits: number;       // NEW
    outstandingBalance: number; // recalculated in backend
    unallocated: number;
}

export default function AccountsReceivableLandingPage() {
    const router = useRouter();

    const { data: customerSummaries, error } = useSWR<CustomerSummary[]>("/api/customers/ar-summary", fetcher);

    if (error) return <div className="p-6">Failed to load data</div>;
    if (!customerSummaries) return <div className="p-6">Loading…</div>;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold">Accounts Receivable</h1>
                <p className="text-gray-500 mt-1">
                    Customer balances and outstanding exposure
                </p>
            </div>

            {/* Table */}
            <div className="bg-white shadow rounded overflow-hidden">
                <table className="w-full border-collapse text-sm">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="border px-3 py-2 text-left">Customer</th>
                            <th className="border px-3 py-2 text-right">Total Invoices</th>
                            <th className="border px-3 py-2 text-right">Invoice Value</th>
                            <th className="border px-3 py-2 text-right">Total Paid</th>
                            <th className="border px-3 py-2 text-right">Credits</th>
                            <th className="border px-3 py-2 text-right">Outstanding</th>
                            <th className="border px-3 py-2 text-right">Unallocated</th>
                            <th className="border px-3 py-2 text-center">Action</th>
                        </tr>
                    </thead>

                    <tbody>
                        {customerSummaries.map(c => {
                            const hasOutstanding = c.outstandingBalance > 0;

                            return (
                                <tr key={c.id} className="hover:bg-gray-50">
                                    <td className="border px-3 py-2 font-medium">{c.name}</td>
                                    <td className="border px-3 py-2 text-right">{c.totalInvoices}</td>
                                    <td className="border px-3 py-2 text-right">K{c.totalInvoiceValue.toFixed(2)}</td>
                                    <td className="border px-3 py-2 text-right text-green-600 font-semibold">
                                        K{c.totalPaid.toFixed(2)}
                                    </td>
                                    <td className="border px-3 py-2 text-right text-yellow-600 font-semibold">
                                        K{c.totalCredits.toFixed(2)}
                                    </td>
                                    <td
                                        className={`border px-3 py-2 text-right font-semibold ${hasOutstanding ? "text-red-600" : "text-green-600"}`}
                                    >
                                        K{c.outstandingBalance.toFixed(2)}
                                    </td>
                                    <td
                                        className={`border px-3 py-2 text-right ${c.unallocated > 0 ? "text-green-600" : "text-gray-400"}`}
                                    >
                                        K{c.unallocated.toFixed(2)}
                                    </td>
                                    <td className="border px-3 py-2 text-center">
                                        <button
                                            onClick={() => router.push(`/payments/statements/${c.id}`)}
                                            className="inline-flex items-center gap-1 text-blue-600 hover:underline"
                                        >
                                            <FileText size={16} />
                                            Statement
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* Footer note */}
            <p className="text-xs text-gray-500">
                Balances include payments, credits, and returns, calculated in real time.
            </p>
        </div>
    );
}
