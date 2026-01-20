"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Eye, Trash2 } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import withRole from "@/components/withRole";

type Transfer = {
    id: string;
    ibtNumber: string;
    status: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    transporter?: { name: string };
};

function statusStyles(status: string) {
    switch (status.toLowerCase()) {
        case "draft":
            return "bg-gray-100 text-gray-700 border-gray-300";
        case "pending":
            return "bg-amber-100 text-amber-800 border-amber-300";
        case "in_transit":
        case "shipped":
            return "bg-blue-100 text-blue-800 border-blue-300";
        case "received":
        case "completed":
            return "bg-emerald-100 text-emerald-800 border-emerald-300";
        case "cancelled":
            return "bg-red-100 text-red-800 border-red-300";
        default:
            return "bg-slate-100 text-slate-700 border-slate-300";
    }
}

const TransfersPage: React.FC = () => {
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        async function load() {
            try {
                const res = await fetch("/api/transfers");
                if (!res.ok) throw new Error("Unable to load transfers");
                setTransfers(await res.json());
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Permanently delete this transfer?")) return;
        await fetch(`/api/transfers/${id}`, { method: "DELETE" });
        setTransfers(prev => prev.filter(t => t.id !== id));
    };

    return (
        <DashboardLayout >
            <div className="mx-auto max-w-7xl space-y-5 p-5">
                {/* Header */}
                <header className="flex items-end justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
                            Stock Transfers
                        </h1>
                        <p className="mt-1 text-sm text-zinc-500">
                            Inter-location inventory movements
                        </p>
                    </div>

                    <button
                        onClick={() => router.push("/transfers/create-transfer")}
                        className="inline-flex items-center gap-2 rounded-md bg-zinc-900 px-5 py-2.5 
                        text-sm font-medium text-white hover:bg-zinc-800 cursor-pointer"
                    >
                        <Plus size={16} />
                        New Transfer
                    </button>
                </header>

                {/* Table Card */}
                <div className="rounded-sm border border-zinc-200 bg-white shadow-sm">
                    {loading && (
                        <div className="py-24 text-center text-sm text-zinc-500">
                            Loading transfers…
                        </div>
                    )}

                    {error && (
                        <div className="py-24 text-center text-sm text-red-600">
                            {error}
                        </div>
                    )}

                    {!loading && !error && transfers.length === 0 && (
                        <div className="py-24 text-center text-sm text-zinc-500">
                            No transfer records available.
                        </div>
                    )}

                    {!loading && !error && transfers.length > 0 && (
                        <table className="w-full border-collapse cursor-pointer">
                            <thead className="bg-gray-200 border border-black">
                                <tr>
                                    {[
                                        "#",
                                        "IBT NUMBER",
                                        "FROM LOCATION",
                                        "TO LOCATION",
                                        "TRANSPORTER",
                                        "STATUS",
                                        "ACTIONS",
                                    ].map(h => (
                                        <th
                                            key={h}
                                            className="border-r border-black px-4 py-2 text-left text-md font-semibold uppercase tracking-wider text-zinc-600"
                                        >
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {transfers.map((t, index) => (
                                    <tr key={t.id} className="border border-b border-black hover:bg-zinc-100 cursor-pointer">
                                        <td className="px-4 py-2 text-zinc-700 border-r border-black text-center">
                                            {index + 1}
                                        </td>
                                        <td className="px-4 py-2 text-zinc-700 border-r border-black">
                                            {t.ibtNumber}
                                        </td>
                                        <td className="px-4 py-2 text-zinc-700 border-r border-black">
                                            {t.fromLocation.name}
                                        </td>
                                        <td className="px-4 py-2 text-zinc-700 border-r border-black">
                                            {t.toLocation.name}
                                        </td>
                                        <td className="px-4 py-2 text-zinc-700 border-r border-black">
                                            {t.transporter?.name ?? "—"}
                                        </td>
                                        <td className="px-4 py-2 border border-black">
                                            <span className={`inline-flex items-center rounded-md border px-2.5 py-1 text-xs font-medium ${statusStyles(t.status)}`}>
                                                {t.status.replaceAll("_", " ")}
                                            </span>
                                        </td>
                                        <td className="px-4 py-2">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => router.push(`/transfers/${t.id}`)}
                                                    className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md border border-gray-500 font-medium text-zinc-700 hover:text-zinc-900 cursor-pointer"
                                                >
                                                    <Eye size={15} />
                                                    View
                                                </button>
                                                {t.status === 'PENDING' && (
                                                    <button
                                                        onClick={() => router.push(`/transfers/${t.id}/dispatch-transfer`)}
                                                        className="inline-flex items-center gap-1 text-sm font-medium text-blue-600 px-2 py-1 rounded-md border border-gray-500 hover:text-blue-700 cursor-pointer"
                                                    >
                                                        Dispatch
                                                    </button>
                                                )}
                                                {t.status === 'DISPATCHED' && (
                                                    <button
                                                        onClick={() => router.push(`/transfers/${t.id}/receive-transfer`)}
                                                        className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md border border-gray-500 font-medium text-green-600 hover:text-green-700 cursor-pointer"
                                                    >
                                                        Receive
                                                    </button>
                                                )}
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="inline-flex items-center gap-1 text-sm px-2 py-1 rounded-md border border-gray-500 font-medium text-red-600 hover:text-red-700"
                                                >
                                                    <Trash2 size={15} />
                                                    Delete
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}

export default withRole(TransfersPage, ['ADMIN']);