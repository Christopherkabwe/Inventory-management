"use client";

import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { formatNumber } from "@/lib/utils";
import { CheckCircleIcon } from "lucide-react";

type Customer = { id: string; name: string };

type Payment = {
    id: string;
    customer: Customer;
    amount: number;
    allocatedAmount: number;
    unallocatedBalance: number;
    createdAt: string;
};

type Invoice = {
    id: string;
    invoiceNumber: string;
    total: number;
    balance: number;
    allocatedNow: number;
    paymentStatus: string;
    allocatedAt?: string;
};

type AllocationRecord = {
    payment: Payment;
    invoices: Invoice[];
};

export default function AllocationTrackerPage() {
    const [allocations, setAllocations] = useState<AllocationRecord[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get("/api/payments/allocations").then((res) => {
            setAllocations(res.data.allocations);
            setLoading(false);
        });
    }, []);

    /**
     * ----------------------------------------
     * CUSTOMER UNALLOCATED FUNDS
     * ----------------------------------------
     */
    const customerUnallocated = useMemo(() => {
        const map = new Map<string, number>();

        allocations.forEach((rec) => {
            const customerId = rec.payment.customer.id;

            if (!map.has(customerId)) map.set(customerId, 0);

            map.set(
                customerId,
                map.get(customerId)! + rec.payment.unallocatedBalance
            );
        });

        return map;
    }, [allocations]);

    /**
     * ----------------------------------------
     * INVOICE-CENTRIC VIEW (DEDUPED)
     * ----------------------------------------
     */
    const rows = useMemo(() => {
        const map = new Map<string, any>();

        allocations.forEach((rec) => {
            rec.invoices.forEach((inv) => {
                const existing = map.get(inv.id);

                if (!existing) {
                    map.set(inv.id, {
                        ...inv,
                        customerName: rec.payment.customer.name,
                        customerId: rec.payment.customer.id,
                        allocatedNow: inv.allocatedNow,
                    });
                } else {
                    // sum allocations across payments
                    existing.allocatedNow += inv.allocatedNow;
                }
            });
        });

        return Array.from(map.values());
    }, [allocations]);

    if (loading) return <p className="p-6">Loading…</p>;

    return (
        <div className="bg-white p-6 max-w-7xl mx-auto">
            <h1 className="text-2xl font-bold mb-6">Allocation Tracker</h1>

            <table className="w-full border-collapse text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1 text-left">Customer</th>
                        <th className="border px-2 py-1 text-left">Invoice #</th>
                        <th className="border px-2 py-1 text-right">Invoice Total</th>
                        <th className="border px-2 py-1 text-right">Allocated</th>
                        <th className="border px-2 py-1 text-right">Unallocated Funds</th>
                        <th className="border px-2 py-1 text-right">Invoice Balance</th>
                        <th className="border px-2 py-1 text-left">Status</th>
                    </tr>
                </thead>

                <tbody>
                    {rows.map((row) => {
                        const invoiceBalance = row.total - row.allocatedNow;
                        const unallocated =
                            customerUnallocated.get(row.customerId) ?? 0;

                        return (
                            <tr key={row.id} className="hover:bg-gray-50">
                                <td className="border px-2 py-1">{row.customerName}</td>



                                <td className="border px-2 py-1">{row.invoiceNumber}</td>

                                <td className="border px-2 py-1 text-right">
                                    K{formatNumber(row.total)}
                                </td>

                                <td className="border px-2 py-1 text-right text-blue-600">
                                    K{formatNumber(row.allocatedNow)}
                                </td>
                                <td
                                    className={`border px-2 py-1 text-right ${unallocated > 0 ? "text-green-600" : "text-gray-400"
                                        }`}
                                >
                                    K{formatNumber(unallocated)}
                                </td>
                                <td
                                    className={`border px-2 py-1 text-right ${invoiceBalance > 0
                                        ? "text-red-600"
                                        : invoiceBalance < 0
                                            ? "text-green-600"
                                            : ""
                                        }`}
                                >
                                    K{formatNumber(invoiceBalance)}
                                </td>

                                <td className="border px-2 py-1 whitespace-nowrap">
                                    {invoiceBalance === 0 && (
                                        <CheckCircleIcon className="inline w-4 h-4 text-green-600 mr-1" />
                                    )}
                                    {row.paymentStatus}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
