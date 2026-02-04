"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface PO {
    id: string;
    poNumber: string;
    supplierName: string;
    status: "DRAFT" | "SUBMITTED" | "APPROVED" | "SENT" | "RECEIVED";
    totalAmount: number;
    itemsCount: number;
    createdAt: string;
}

export default function PODashboard() {
    const [pos, setPos] = useState<PO[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchPOs();
    }, []);

    async function fetchPOs() {
        setLoading(true);
        try {
            const res = await fetch("/api/purchase-orders");
            const data = await res.json();
            setPos(data);
        } catch (err) {
            console.error(err);
            toast({ title: "Error fetching POs", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: PO["status"]) {
        try {
            const res = await fetch(`/api/purchase-orders/${id}/status`, {
                method: "POST",
                body: JSON.stringify({ status }),
            });
            if (!res.ok) throw new Error("Failed to update status");

            setPos(p => p.map(x => (x.id === id ? { ...x, status } : x)));
            toast({ title: `PO status updated to ${status}` });
        } catch (err) {
            console.error(err);
            toast({ title: "Error updating status", variant: "destructive" });
        }
    }

    function renderStatusBadge(status: PO["status"]) {
        const colors: Record<PO["status"], string> = {
            DRAFT: "bg-gray-200 text-gray-800",
            SUBMITTED: "bg-blue-200 text-blue-800",
            APPROVED: "bg-green-200 text-green-800",
            SENT: "bg-indigo-200 text-indigo-800",
            RECEIVED: "bg-purple-200 text-purple-800",
        };
        return <Badge className={colors[status]}>{status}</Badge>;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Purchase Orders</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <table className="w-full text-sm border-collapse">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="p-2 text-left">PO #</th>
                            <th className="p-2 text-left">Supplier</th>
                            <th className="p-2 text-left">Items</th>
                            <th className="p-2 text-left">Total</th>
                            <th className="p-2 text-left">Status</th>
                            <th className="p-2 text-left">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pos.map(po => (
                            <tr key={po.id} className="border-b hover:bg-gray-50">
                                <td className="p-2">{po.poNumber}</td>
                                <td className="p-2">{po.supplierName}</td>
                                <td className="p-2">{po.itemsCount}</td>
                                <td className="p-2">${po.totalAmount.toFixed(2)}</td>
                                <td className="p-2">{renderStatusBadge(po.status)}</td>
                                <td className="p-2 space-x-2">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={po.status !== "DRAFT"}
                                        onClick={() => updateStatus(po.id, "SUBMITTED")}
                                    >
                                        Submit
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={po.status !== "SUBMITTED"}
                                        onClick={() => updateStatus(po.id, "APPROVED")}
                                    >
                                        Approve
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        disabled={po.status !== "APPROVED"}
                                        onClick={() => updateStatus(po.id, "SENT")}
                                    >
                                        Send
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="destructive"
                                        disabled={po.status === "RECEIVED"}
                                        onClick={() => updateStatus(po.id, "DRAFT")}
                                    >
                                        Cancel
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
