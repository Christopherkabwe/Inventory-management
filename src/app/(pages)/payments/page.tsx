"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import axios from "axios";
import toast, { ErrorIcon } from "react-hot-toast";
import { CheckCircle, CheckCircleIcon } from "lucide-react";

interface Allocation {
    amount: number;
}

interface Customer {
    name: string;
}

interface Payment {
    id: string;
    paymentDate: string;
    amount: number;
    method: string;
    customer: Customer;
    allocated: number;
    balance: number;
    allocations: Allocation[];
}

export default function PaymentsPage() {
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(true);
    const [autoAllocating, setAutoAllocating] = useState<string | null>(null);

    const fetchPayments = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/payments");
            const data = await res.json();
            setPayments(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, []);

    const handleAutoAllocate = async (paymentId: string) => {
        try {
            setAutoAllocating(paymentId);
            await axios.post("/api/payments/auto-allocate", { paymentId });
            toast(<> <CheckCircle size={16} className="mr-1 text-green-600" /> Auto-allocated successfully</>);
            await fetchPayments(); // refresh data after allocation
        } catch (err) {
            toast(<> <ErrorIcon className="mr-1 text-green-600" />  Auto-allocation failed. See console for details.</>);
            console.error(err);
        } finally {
            setAutoAllocating(null);
        }
    };

    if (loading) return <p>Loading payments...</p>;

    return (
        <div className="bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">Customer Payments</h1>

            <table className="w-full border-collapse">
                <thead className="bg-gray-100">
                    <tr className="text-left">
                        <th className="border p-2">Date</th>
                        <th className="border p-2">Customer</th>
                        <th className="border p-2">Method</th>
                        <th className="border p-2">Amount</th>
                        <th className="border p-2">Allocated</th>
                        <th className="border p-2">Balance</th>
                        <th className="border p-2">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map(p => (
                        <tr key={p.id}>
                            <td className="border p-2">{new Date(p.paymentDate).toLocaleDateString()}</td>
                            <td className="border p-2">{p.customer.name}</td>
                            <td className="border p-2">{p.method}</td>
                            <td className="border p-2">{Number(p.amount).toFixed(2)}</td>
                            <td className="border p-2 text-green-600">{p.allocated?.toFixed(2)}</td>
                            <td className="border p-2 text-red-600">{p.balance?.toFixed(2)}</td>
                            <td className="border p-2 flex gap-2">
                                <Link
                                    href={`/payments/${p.id}/allocate`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Allocate
                                </Link>

                                <button
                                    className="bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                                    disabled={p.balance <= 0 || autoAllocating === p.id}
                                    onClick={() => handleAutoAllocate(p.id)}
                                >
                                    {autoAllocating === p.id ? "Allocating…" : "Auto-Allocate"}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
