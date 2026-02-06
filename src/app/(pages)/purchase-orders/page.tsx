"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import Link from "next/link";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

/* ---------- Raw API Types ---------- */
interface APIItem {
    id: string;
    quantity: number;
    unitPrice: number;
    product?: {
        name: string;
    };
}

interface APIPO {
    id: string;
    poNumber: string;
    status: "DRAFT" | "SUBMITTED" | "APPROVED" | "SENT" | "RECEIVED" | "CANCELLED";
    createdAt: string;

    supplier?: {
        name: string;
    };

    items: APIItem[];
}

/* ---------- Dashboard View Type ---------- */
interface PO {
    id: string;
    poNumber: string;
    supplierName: string;
    status: APIPO["status"];
    totalAmount: number;
    itemsCount: number;
    createdAt: string;
}

export default function PODashboard() {
    const [pos, setPos] = useState<PO[]>([]);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        fetchPOs();
    }, []);

    /* ---------- Transform API Data ---------- */
    function mapPO(apiPO: APIPO): PO {
        const totalAmount = apiPO.items.reduce(
            (sum, item) => sum + item.quantity * item.unitPrice,
            0
        );

        return {
            id: apiPO.id,
            poNumber: apiPO.poNumber,
            supplierName: apiPO.supplier?.name ?? "N/A",
            status: apiPO.status,
            itemsCount: apiPO.items.length,
            totalAmount,
            createdAt: apiPO.createdAt,
        };
    }

    async function fetchPOs() {
        setLoading(true);
        try {
            const res = await fetch("/api/purchase-orders");
            const data: APIPO[] = await res.json();

            setPos(data.map(mapPO));
        } catch (err) {
            console.error(err);
            toast.error("Error fetching POs");
        } finally {
            setLoading(false);
        }
    }

    async function updateStatus(id: string, status: PO["status"]) {
        try {
            const res = await fetch(`/api/purchase-orders/${id}/status`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ status }),
            });

            if (!res.ok) throw new Error("Failed to update status");

            setPos(p => p.map(x => (x.id === id ? { ...x, status } : x)));
            toast.success(`PO status updated to ${status}`);
        } catch (err) {
            console.error(err);
            toast.error("Error updating status");
        }
    }

    function renderStatusBadge(status: PO["status"]) {
        const colors: Record<PO["status"], string> = {
            DRAFT: "bg-gray-500 text-white",
            SUBMITTED: "bg-blue-500 text-white",
            APPROVED: "bg-green-500 text-white",
            SENT: "bg-orange-500 text-white",
            RECEIVED: "bg-purple-500 text-white",
            CANCELLED: "bg-red-500 text-white",
        };

        return <Badge className={colors[status]}>{status}</Badge>;
    }

    return (
        <div className="bg-white p-5 rounded-md">
            <div className="flex justify-between mb-3">
                <h1 className="text-2xl font-bold">Purchase Orders</h1>
                <div className="flex justify-end">
                    <button
                        onClick={() => router.push("/purchase-orders/create-po")}
                        className="ml-auto inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-green-600 cursor-pointer"
                    >
                        <Plus size={16} />
                        New Purchase Order
                    </button>
                </div>
            </div>

            {loading ? (
                <Loading
                />
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
                                <td className="p-2">
                                    ${po.totalAmount.toFixed(2)}
                                </td>
                                <td className="p-2">
                                    {renderStatusBadge(po.status)}
                                </td>

                                <td className="p-2 space-x-2">
                                    <Link href={`/purchase-orders/${po.id}`}>
                                        <Button
                                            size="sm"
                                            variant="secondary"
                                            onClick={(e) => e.stopPropagation()}
                                            className="bg-gray-300"
                                        >
                                            View PO
                                        </Button>
                                    </Link>
                                    {po.status === "RECEIVED" && (
                                        <>
                                            <Link href={`/purchase-orders/${po.id}`}>
                                                <Button
                                                    size="sm"
                                                    variant="secondary"
                                                    onClick={(e) => e.stopPropagation()}
                                                    className="bg-green-300"
                                                >
                                                    View GRN
                                                </Button>
                                            </Link>
                                        </>
                                    )}
                                    {po.status === "DRAFT" && (
                                        <>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                disabled={po.status !== "DRAFT"}
                                                onClick={() =>
                                                    updateStatus(po.id, "SUBMITTED")
                                                }
                                                className="bg-blue-300"
                                            >
                                                Submit
                                            </Button>
                                        </>
                                    )}
                                    {po.status === "SUBMITTED" && (

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() =>
                                                updateStatus(po.id, "APPROVED")
                                            }
                                            className="bg-purple-500"
                                        >
                                            Approve
                                        </Button>
                                    )}

                                    {po.status === "APPROVED" && (
                                        <Button
                                            size="sm"
                                            onClick={() =>
                                                updateStatus(po.id, "SENT")
                                            }
                                            className="bg-orange-500 text-white"
                                        >
                                            Send
                                        </Button>
                                    )}
                                    {(po.status !== "RECEIVED") && (
                                        <Button
                                            size="sm"
                                            onClick={() => updateStatus(po.id, "CANCELLED")}
                                            className="bg-red-500 text-white"
                                        >
                                            Cancel
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
            }
        </div >
    );
}
