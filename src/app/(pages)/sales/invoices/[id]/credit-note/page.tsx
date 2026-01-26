"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function CreateCreditNotePage() {
    const router = useRouter();
    const { saleId } = useParams();

    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch("/api/credit-notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    saleId,
                    reason,
                    amount: Number(amount),
                }),
            });

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || "Failed to create credit note");
            }

            // go back to sale page after success
            router.push(`/sales/${saleId}`);
            router.refresh();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-xl mx-auto p-6">
            <h1 className="text-xl font-bold mb-4">Create Credit Note</h1>

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 shadow rounded">
                {error && (
                    <div className="text-red-600 text-sm bg-red-50 p-2 rounded">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium mb-1">Reason</label>
                    <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Returned goods, pricing error, damaged items…"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Amount</label>
                    <input
                        type="number"
                        step="0.01"
                        min="0"
                        className="w-full border rounded p-2"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="px-4 py-2 border rounded"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
                    >
                        {loading ? "Saving…" : "Create Credit Note"}
                    </button>
                </div>
            </form>
        </div>
    );
}
