"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

type Customer = {
    id: string;
    name: string;
};

export default function NewPaymentPage() {
    const router = useRouter();

    const [customers, setCustomers] = useState<Customer[]>([]);
    const [customerId, setCustomerId] = useState("");
    const [amount, setAmount] = useState("");
    const [method, setMethod] = useState("CASH");
    const [reference, setReference] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        axios.get("/api/options/customers").then(res => {
            setCustomers(res.data);
        });
    }, []);

    const submit = async () => {
        if (!customerId || !amount) {
            alert("Customer and amount are required");
            return;
        }

        setLoading(true);

        try {
            const res = await axios.post("/api/payments/customer-payments", {
                customerId,
                amount: Number(amount),
                method,
                reference,
            });

            router.push(
                `/payments/${res.data.payment.id}/allocate`
            );
        } catch (err: any) {
            alert(err.response?.data?.error || "Failed to save payment");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-6 rounded shadow">
            <h1 className="text-2xl font-bold mb-4">
                New Customer Payment
            </h1>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium">
                        Customer
                    </label>
                    <select
                        className="w-full border rounded p-2"
                        value={customerId}
                        onChange={e => setCustomerId(e.target.value)}
                    >
                        <option value="">Select customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Amount
                    </label>
                    <input
                        type="number"
                        min={0}
                        className="w-full border rounded p-2"
                        value={amount}
                        onChange={e => setAmount(e.target.value)}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Payment Method
                    </label>
                    <select
                        className="w-full border rounded p-2"
                        value={method}
                        onChange={e => setMethod(e.target.value)}
                    >
                        <option value="CASH">Cash</option>
                        <option value="BANK">Bank</option>
                        <option value="MOBILE">Mobile Money</option>
                        <option value="CHEQUE">Cheque</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Reference (optional)
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded p-2"
                        value={reference}
                        onChange={e => setReference(e.target.value)}
                    />
                </div>

                <button
                    onClick={submit}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-2 rounded disabled:opacity-50"
                >
                    {loading ? "Saving..." : "Save Payment"}
                </button>
            </div>
        </div>
    );
}
