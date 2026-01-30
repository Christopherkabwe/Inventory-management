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
    status: string;
    paymentStatus: "PAID" | "PARTIALLY_PAID" | "UNPAID";
    saleDate: string;
    customerId: string;
    unallocated: number;
    credit: number;
    customer: {
        id: string;
        name: string;
    };
}

export default function AccountsReceivablePage() {
    const { data: invoices, error, mutate } = useSWR<Invoice[]>("/api/invoices", fetcher, {
        refreshInterval: 2000,
    });

    const [filterStatus, setFilterStatus] = useState<"ALL" | "PAID" | "PARTIALLY_PAID" | "UNPAID">("ALL");
    const [search, setSearch] = useState("");
    const [allocatingCustomer, setAllocatingCustomer] = useState<string | null>(null);

    // -----------------------------
    // Filter invoices based on search & status
    // -----------------------------
    const filteredInvoices = useMemo(() => {
        if (!invoices) return [];
        return invoices.filter(inv => {
            const matchesStatus = filterStatus === "ALL" || inv.paymentStatus === filterStatus;
            const matchesSearch =
                inv.invoiceNumber.includes(search) ||
                inv.customer.name.toLowerCase().includes(search.toLowerCase());
            return matchesStatus && matchesSearch;
        });
    }, [invoices, filterStatus, search]);

    // -----------------------------
    // Group invoices by customer
    // -----------------------------
    const invoicesByCustomer = useMemo(() => {
        if (!filteredInvoices) return {};
        const map: Record<string, Invoice[]> = {};
        filteredInvoices.forEach(inv => {
            if (!map[inv.customerId]) map[inv.customerId] = [];
            map[inv.customerId].push(inv);
        });
        return map;
    }, [filteredInvoices]);

    // -----------------------------
    // Auto-allocate credit per customer
    // -----------------------------
    const handleAllocateCreditForCustomer = async (customerId: string) => {
        try {
            setAllocatingCustomer(customerId);

            // Backend will handle FIFO allocation across all unpaid invoices for this customer
            await axios.post("/api/credit-notes/auto-allocate", { customerId });

            await mutate(); // refresh invoices
        } catch (err) {
            console.error(err);
            alert("Auto-allocation failed. See console.");
        } finally {
            setAllocatingCustomer(null);
        }
    };

    if (error) return <div>Error loading invoices</div>;
    if (!invoices) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <div className="mb-4">
                <h1 className="text-3xl font-bold">Accounts Receivable</h1>
                <p className="text-gray-500 mt-1">Track your sales receivables</p>
            </div>

            {/* Filters */}
            <div className="flex flex-row justify-between gap-4 mb-4">
                <div className="w-full">
                    <SearchInput
                        value={search}
                        onChange={setSearch}
                        placeholder="Search by invoice or customer"
                    />
                </div>
                <div className="w-full">
                    <Dropdown
                        label=""
                        value={filterStatus}
                        onChange={(val) =>
                            setFilterStatus(val as "ALL" | "PAID" | "PARTIALLY_PAID" | "UNPAID")
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
            <div className="bg-white shadow rounded p-4 overflow-x-auto">
                <table className="w-full table-auto border-collapse">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr>
                            <th className="border px-2 py-1 text-left">Sale Date</th>
                            <th className="border px-2 py-1 text-left">Invoice #</th>
                            <th className="border px-2 py-1 text-left">Customer</th>
                            <th className="border px-2 py-1 text-left">Status</th>
                            <th className="border px-2 py-1 text-right">Invoice Total</th>
                            <th className="border px-2 py-1 text-right">Paid</th>
                            <th className="border px-2 py-1 text-right">Credit Notes</th>
                            <th className="border px-2 py-1 text-right">Balance</th>
                            <th className="border px-2 py-1 text-right">Unallocated</th>
                            <th className="border px-2 py-1 text-center">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(invoicesByCustomer).map((customerInvoices) => {
                            const customer = customerInvoices[0].customer;

                            return customerInvoices.map((inv, idx) => (
                                <tr key={inv.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{new Date(inv.saleDate).toLocaleDateString()}</td>
                                    <td className="border px-2 py-1">{inv.invoiceNumber}</td>
                                    <td className="border px-2 py-1">{inv.customer?.name}</td>
                                    <td className="border px-2 py-1">{inv.paymentStatus}</td>
                                    <td className="border px-2 py-1 text-right">K{inv.total.toFixed(2)}</td>
                                    <td className="border px-2 py-1 text-right">K{inv.paid.toFixed(2)}</td>
                                    <td className="border px-2 py-1 text-right">K{inv.creditNotesTotal.toFixed(2)}</td>
                                    <td
                                        className={`border px-2 py-1 text-right ${inv.balance > 0
                                            ? "text-red-600"
                                            : inv.balance <= 0
                                                ? "text-green-600"
                                                : ""
                                            }`}
                                    >
                                        K{inv.balance.toFixed(2)}
                                    </td>
                                    <td
                                        className={`border px-2 py-1 text-right ${inv.unallocated > 0 ? "text-green-600" : "text-gray-400"
                                            }`}
                                    >
                                        K{inv.unallocated.toFixed(2)}
                                    </td>
                                    <td className="border px-2 py-1 text-center">
                                        {idx === 0 && customerInvoices[0].credit > 0 && inv.balance > 0 ? (
                                            <button
                                                className="bg-green-600 text-white px-2 py-1 rounded flex items-center justify-center gap-1 disabled:opacity-50"
                                                disabled={allocatingCustomer === customer.id}
                                                onClick={() => handleAllocateCreditForCustomer(customer.id)}
                                            >
                                                {allocatingCustomer === customer.id ? "Allocating…" : (
                                                    <>
                                                        <CheckCircleIcon size={14} />
                                                        Allocate Credit
                                                    </>
                                                )}
                                            </button>
                                        ) : (
                                            <span className="text-gray-400">—</span>
                                        )}
                                    </td>
                                </tr>
                            ));
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
