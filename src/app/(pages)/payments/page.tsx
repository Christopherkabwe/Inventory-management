"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

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

    useEffect(() => {
        fetch("/api/payments")
            .then(res => res.json())
            .then(data => setPayments(data))
            .finally(() => setLoading(false));

    }, []);

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
                            <td className="border p-2">
                                <Link
                                    href={`/payments/${p.id}/allocate`}
                                    className="bg-blue-600 text-white px-3 py-1 rounded"
                                >
                                    Allocate
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
