"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/SingleSelectComboBox/GenericDropdown";
import { CustomerCombobox } from "@/components/SingleSelectComboBox/CustomerComboBox";
import { NumberInput } from "@/components/SingleSelectComboBox/NumberInput";

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
                `/payments`
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
                    <CustomerCombobox
                        label="Customer"
                        customers={customers}
                        value={customerId}
                        onChange={setCustomerId}
                        disabled={false}
                    />
                </div>

                <div>
                    <NumberInput
                        label="Amount"
                        value={Number(amount) || 0}
                        onChange={(num) => setAmount(num.toString())}
                        min={0}
                        placeholder="Enter amount"
                        className="w-full"
                    />
                </div>

                <div>
                    <Dropdown
                        label="Payment Method"
                        value={method}
                        onChange={(val) =>
                            setMethod(val as "CASH" | "BANK" | "MOBILE" | "CHEQUE")
                        }
                        items={[
                            { id: "CASH", label: "Cash" },
                            { id: "BANK", label: "Bank" },
                            { id: "MOBILE", label: "Mobile" },
                            { id: "CHEQUE", label: "Cheque" },
                        ]}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium">
                        Reference (optional)
                    </label>
                    <input
                        type="text"
                        className="w-full border rounded-md p-2"
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
