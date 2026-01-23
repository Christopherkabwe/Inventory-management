"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";

type DeliveryNote = {
    id: string;
    deliveryNoteNo: string;
    dispatchedAt: string;
    sale?: {
        invoiceNumber?: string;
        customer?: { name: string };
    };
};

export default function DeliveryNotesPage() {
    const [notes, setNotes] = useState<DeliveryNote[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/rbac/sales-flow/delivery-notes")
            .then(res => res.json())
            .then(setNotes)
            .finally(() => setLoading(false));
    }, []);

    if (loading) return <p className="py-20 text-center">Loading delivery notes…</p>;

    return (
        <DashboardLayout>
            <div className="px-6">
                <h1 className="text-xl font-semibold mb-4">Delivery Notes</h1>

                <table className="w-full text-sm border">
                    <thead className="bg-zinc-100">
                        <tr>
                            <th className="p-2 text-left">Delivery Note</th>
                            <th className="p-2 text-left">Invoice</th>
                            <th className="p-2 text-left">Customer</th>
                            <th className="p-2 text-left">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {notes.map(n => (
                            <tr key={n.id} className="border-t hover:bg-zinc-50">
                                <td className="p-2 font-medium">
                                    <Link
                                        href={`/sales/delivery-notes/${n.id}`}
                                        className="text-blue-600 hover:underline"
                                    >
                                        {n.deliveryNoteNo}
                                    </Link>
                                </td>
                                <td className="p-2">{n.sale?.invoiceNumber ?? "-"}</td>
                                <td className="p-2">{n.sale?.customer?.name ?? "-"}</td>
                                <td className="p-2">
                                    {new Date(n.dispatchedAt).toLocaleDateString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
