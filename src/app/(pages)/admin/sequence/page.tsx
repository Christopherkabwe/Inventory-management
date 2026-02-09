"use client";

import { useEffect, useState } from "react";
import { useToaster } from "@/app/context/Toaster";
import Loading from "@/components/Loading";

type Sequence = {
    id: string;
    year: number;
    value: number;
    locked: boolean;
    updatedAt: string;
};

export default function SequencePage() {
    const [data, setData] = useState<Sequence[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const { addToast } = useToaster();
    const [actionSequence, setActionSequence] = useState<Sequence | null>(null);
    const [actionType, setActionType] = useState<"LOCK" | "RESET" | null>(null);
    const [processing, setProcessing] = useState(false);
    const [autoLocking, setAutoLocking] = useState(false);

    useEffect(() => {
        loadSequences();
    }, []);

    const loadSequences = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/sequences");
            if (!res.ok) throw new Error("Unauthorized or failed");

            const json = await res.json();
            setData(json);
        } catch (err) {
            setError("You are not authorized to view sequences.");
        } finally {
            setLoading(false);
        }
    };

    const handleAction = async () => {
        if (!actionSequence || !actionType) return;
        setProcessing(true);
        const currentYear = new Date().getFullYear();
        if (actionType === "LOCK" && actionSequence.year === currentYear) {
            addToast("Cannot lock current year", "error");
            setProcessing(false);
            return;
        }

        try {
            let url = "";
            let body: any = undefined;

            if (actionType === "RESET") {
                url = `/api/sequences/${actionSequence.id}`;
                body = { year: actionSequence.year };
            } else if (actionType === "LOCK") {
                url = `/api/sequences/${actionSequence.id}/lock`;
                body = { year: actionSequence.year }; // Pass year to lock
            }

            const res = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: body ? JSON.stringify(body) : undefined,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err?.error || "Action failed");
            }

            await loadSequences();

            setActionSequence(null);
            setActionType(null);
        } catch (err) {
            alert("Failed: " + (err as Error).message);
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <div className="bg-white"><Loading /></div>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white p-5 rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-semibold">System Sequences</h1>
            </div>

            <table className="w-full border border-gray-300">
                <thead>
                    <tr className="bg-gray-100 text-left">
                        <th className="p-2 border">Sequence</th>
                        <th className="p-2 border">Year</th>
                        <th className="p-2 border">Current Value</th>
                        <th className="p-2 border">Locked</th>
                        <th className="p-2 border">Updated</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {data?.map((seq) => (
                        <tr key={`${seq.id}-${seq.year}`}>
                            <td className="p-2 border">{seq.id}</td>
                            <td className="p-2 border">{seq.year}</td>
                            <td className="p-2 border">{seq.value}</td>
                            <td className="p-2 border">{seq.locked ? "✅" : "❌"}</td>
                            <td className="p-2 border">{new Date(seq.updatedAt).toLocaleString()}</td>
                            <td className="p-2 border space-x-2">
                                {!seq.locked && (
                                    <button
                                        className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                        onClick={() => {
                                            setActionSequence(seq);
                                            setActionType("LOCK");
                                        }}
                                    >
                                        Lock
                                    </button>
                                )}
                                <button
                                    className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600"
                                    onClick={() => {
                                        setActionSequence(seq);
                                        setActionType("RESET");
                                    }}
                                >
                                    Reset
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Confirmation Modal */}
            {actionSequence && actionType && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-96">
                        <h2 className="text-xl font-bold mb-4 text-red-600">
                            {actionType === "LOCK" ? "LOCK SEQUENCE" : "RESET SEQUENCE"}
                        </h2>
                        <p className="mb-4">
                            You are about to <strong>{actionType.toLowerCase()}</strong> the sequence <strong>{actionSequence.id}</strong> for year <strong>{actionSequence.year}</strong>.
                        </p>
                        <p className="mb-4 text-red-500 font-semibold">
                            This action {actionType === "LOCK" ? "cannot be undone" : "should only be done at the start of a new financial year"}.
                        </p>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400"
                                onClick={() => { setActionSequence(null); setActionType(null); }}
                                disabled={processing}
                            >
                                Cancel
                            </button>
                            <button
                                className={`px-3 py-1 rounded text-white ${actionType === "LOCK" ? "bg-red-500 hover:bg-red-600" : "bg-yellow-500 hover:bg-yellow-600"}`}
                                onClick={handleAction}
                                disabled={processing}
                            >
                                {processing ? "Processing..." : "Confirm"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
