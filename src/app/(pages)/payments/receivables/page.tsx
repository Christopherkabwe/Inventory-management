"use client";

import useSWR from "swr";
import { useState, useMemo } from "react";
import axios from "axios";
import { CheckCircleIcon } from "lucide-react";
import { Dropdown } from "@/components/SingleSelectComboBox/GenericDropdown";
import SearchInput from "@/components/search/SearchInput";

const fetcher = (url: string) => fetch(url).then(res => res.json());

interface Invoice {
    id: string;
    invoiceNumber: string;
    total: number;
    paid: number;
    creditNotesTotal: number;
    balance: number; // total - paid - credit
    status: "PAID" | "PARTIALLY_PAID" | "UNPAID";
    saleDate: string;
    customerId: string;
    unallocated: number;
    customer: {
        id: string;
        name: string;
    }
}

interface CustomerUnallocated {
    customerId: string;
    unallocated: number;
}

export default function AccountsReceivablePage() {
    // -----------------------------
    // Data Fetching
    // -----------------------------
    const { data: invoices, error, mutate } = useSWR<Invoice[]>("/api/invoices", fetcher, {
        refreshInterval: 2000,
    });


    const [filterStatus, setFilterStatus] = useState("ALL");
    const [search, setSearch] = useState("");
    const [autoAllocating, setAutoAllocating] = useState<string | null>(null);

    // -----------------------------
    // Filter invoices
    // -----------------------------
    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];
        return invoices.filter(inv => {
            const matchesStatus = filterStatus === "ALL" || inv.status === filterStatus;
            const matchesSearch =
                inv.invoiceNumber.includes(search) ||
                (inv as any).customerName?.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [invoices, filterStatus, search]);

    // -----------------------------
    // Handle Auto-Allocate per customer
    // -----------------------------
    const handleAutoAllocate = async (customerId: string) => {
        try {
            setAutoAllocating(customerId);
            await axios.post("/api/payments/auto-allocate", { customerId });
            await mutate(); // refresh invoices after allocation
        } catch (err) {
            console.error(err);
            alert("Auto-allocation failed. See console.");
        } finally {
            setAutoAllocating(null);
        }
    };

    if (error) return <div>Error loading invoices</div>;
    if (!invoices) return <div>Loading...</div>;

    // -----------------------------
    // Render
    // -----------------------------
    return (
        <div className="">
            <div>
                <h1 className="text-3xl font-bold">Accounts Receivables</h1>
                <p className="text-gray-500 mt-1 mb-2">Track your sales Receivables</p>
            </div>
            <div className="p-6 bg-white shadow rounded space-y-6">
                {/* Filters */}
                <div className="flex flex-row justify-between gap-4 mb-4">
                    <div className="w-full">
                        <SearchInput
                            value={search}
                            onChange={setSearch}
                            placeholder="Search by invoice or customer"
                            className=""
                        />
                    </div>
                    <div className="w-full">
                        <Dropdown
                            label=""
                            value={filterStatus}
                            onChange={(val) =>
                                setFilterStatus(val as "ALL" | "UNPAID" | "PARTIALLY_PAID" | "UNPAID")
                            }
                            items={[
                                { id: "ALL", label: "All" },
                                { id: "PAID", label: "Paid" },
                                { id: "PARTIALLY_PAID", label: "Partially Paid" },
                                { id: "UNPAID", label: "Unpaid" },
                            ]}
                        />
                    </div>
                </div>


                {/* Table */}
                <div>
                    <table className="w-full table-auto border-collapse">
                        <thead className="bg-gray-100 sticky top-0">
                            <tr>
                                <th className="border px-2 py-1 text-left">Invoice #</th>
                                <th className="border px-2 py-1 text-left">Customer</th>
                                <th className="border px-2 py-1 text-left">Status</th>
                                <th className="border px-2 py-1 text-right">Invoice Total</th>
                                <th className="border px-2 py-1 text-right">Paid</th>
                                <th className="border px-2 py-1 text-right">Credit Notes</th>
                                <th className="border px-2 py-1 text-right">Balance</th>
                                <th className="border px-2 py-1 text-right">Unallocated</th>
                                {/*<th className="border px-2 py-1">Action</th>*/}
                            </tr>
                        </thead>
                        <tbody>
                            {filteredInvoices.map(inv => {
                                const unallocated = inv.unallocated;
                                const canAutoAllocate = inv.balance > 0 && unallocated > 0;
                                return (
                                    <tr key={inv.id} className="hover:bg-gray-50">
                                        <td className="border px-2 py-1">{inv.invoiceNumber}</td>
                                        <td className="border px-2 py-1">{inv.customer?.name}</td>
                                        <td className="border px-2 py-1">{inv.status}</td>
                                        <td className="border px-2 py-1 text-right">K{inv.total.toFixed(2)}</td>
                                        <td className="border px-2 py-1 text-right">K{inv.paid.toFixed(2)}</td>
                                        <td className="border px-2 py-1 text-right">K{inv.creditNotesTotal.toFixed(2)}</td>
                                        <td
                                            className={`border px-2 py-1 text-right ${inv.balance > 0 ? "text-red-600" : inv.balance < 0 ? "text-green-600" : ""
                                                }`}
                                        >
                                            K{inv.balance.toFixed(2)}
                                        </td>
                                        <td
                                            className={`border px-2 py-1 text-right ${unallocated > 0 ? "text-green-600" : "text-gray-400"
                                                }`}
                                        >
                                            K{unallocated.toFixed(2)}
                                        </td>
                                        {/*<td className="border px-2 py-1">
                                            <button
                                                className="bg-green-600 text-white px-2 py-1 rounded disabled:opacity-50"
                                                disabled={!canAutoAllocate || autoAllocating === inv.customerId}
                                                onClick={() => handleAutoAllocate(inv.customerId)}
                                            >
                                                {autoAllocating === inv.customerId ? "Allocating…" : "Auto-Allocate"}
                                            </button>
                                        </td>*/}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
