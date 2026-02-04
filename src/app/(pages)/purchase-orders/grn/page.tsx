"use client";

import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { Plus } from "lucide-react";

interface APIGRNItem {
    id: string;
    poItemId: string;
    quantityReceived: number;
    poItem?: {
        product: {
            name: string;
            sku: string;
            weightUnit: string;
            weightValue: number;
        };
        quantity: number;
    };
}

interface APIGRN {
    id: string;
    grnNumber: string;
    po?: { poNumber: string; status: string, supplier: { id: string; name: string; } };
    status: "DRAFT" | "RECEIVED" | "CLOSED";
    createdAt: string;
    items: APIGRNItem[];
}

interface GRN {
    id: string;
    grnNumber: string;
    poNumber: string;
    supplierName: string;
    status: APIGRN["status"];
    createdAt: string;
    items: {
        name: string;
        sku: string;
        weightUnit: string;
        weightValue: number;
        unit?: string;
        poItemId: string;
        notes?: string;
        quantity: number;
        poQuantity: number;
    }[];
    totalItems: number;
    totalQuantity: number;
}

export default function GRNDashboard() {
    const [grns, setGRNs] = useState<GRN[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const router = useRouter();

    useEffect(() => {
        fetchGRNs();
    }, []);

    const toggle = (id: string) => setOpen((prev) => ({ ...prev, [id]: !prev[id] }));

    /** Map API GRN to Dashboard GRN */
    const mapGRN = (apiGRN: APIGRN): GRN => {
        const totalQuantity = apiGRN.items.reduce((sum, i) => sum + i.quantityReceived, 0);
        return {
            id: apiGRN.id,
            grnNumber: apiGRN.grnNumber,
            poNumber: apiGRN.po?.poNumber ?? "N/A",
            status: apiGRN.status,
            supplierName: apiGRN.po?.supplier?.name ?? "",
            createdAt: new Date(apiGRN.createdAt).toLocaleString(),
            items: apiGRN.items.map((item) => ({
                name: item.poItem?.product?.name ?? "N/A",
                sku: item.poItem?.product?.sku ?? "N/A",
                weightUnit: item.poItem?.product?.weightUnit ?? "N/A",
                weightValue: item.poItem?.product?.weightValue ?? 0,
                unit: item.poItem?.product?.weightUnit ?? "-", // add unit if available
                poItemId: item.poItemId,
                notes: (item.poItem as any)?.notes ?? "", // optional notes
                quantity: item.quantityReceived,
                poQuantity: item.poItem?.quantity ?? 0,
            })),
            totalItems: apiGRN.items.length,
            totalQuantity,
        };
    };

    /** Fetch all GRNs */
    const fetchGRNs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/grn");
            if (!res.ok) throw new Error("Failed to fetch GRNs");
            const data: APIGRN[] = await res.json();
            console.log(data)
            setGRNs(data.map(mapGRN));
        } catch (err) {
            console.error(err);
            toast.error("Error fetching GRNs");
        } finally {
            setLoading(false);
        }
    };

    /** Render colored badge based on GRN status */
    const renderStatusBadge = (status: GRN["status"]) => {
        const colors: Record<GRN["status"], string> = {
            DRAFT: "bg-gray-500 text-white",
            RECEIVED: "bg-green-500 text-white",
            CLOSED: "bg-purple-500 text-white",
        };
        return <Badge className={colors[status]}>{status}</Badge>;
    };

    /** Update GRN status */
    const updateStatus = async (id: string, status: GRN["status"]) => {
        try {
            const res = await fetch(`/api/grn/${id}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status }),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Update failed');
            }
            window.location.reload();
        } catch (err) {
            console.error(err);
            toast.error(err.message);
        }
    };

    return (
        <div className="bg-white p-5 rounded-md">
            {/* Header */}
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Goods Received Notes (GRN)</h1>
                <Button
                    onClick={() => router.push("/purchase-orders/grn/create-grn")}
                    className="ml-auto inline-flex items-center gap-2 bg-green-500 text-white hover:bg-green-600"
                >
                    <Plus size={16} /> New GRN
                </Button>
            </div>

            {/* Loading */}

            {loading ? (
                <Loading />
            ) : (
                <div className="flex overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100 sticky top-0 z-20">
                            <tr>
                                <th className="p-2 text-left">GRN #</th>
                                <th className="p-2 text-left">PO #</th>
                                <th className="p-2 text-left">Supplier</th>
                                <th className="p-2 text-left">Items</th>
                                <th className="p-2 text-left">Total Qty</th>
                                <th className="p-2 text-left">Status</th>
                                <th className="p-2 text-left">Created At</th>
                                <th className="p-2 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {grns.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-4 text-center text-gray-500">
                                        No GRNs found.
                                    </td>
                                </tr>
                            ) : (
                                grns.map((grn) => {
                                    const isOpen = open[grn.id];
                                    return (
                                        <Fragment key={grn.id}>
                                            {/* SUMMARY ROW */}
                                            <tr
                                                className={`border-b cursor-pointer ${isOpen ? "bg-white shadow-sm" : "bg-white"
                                                    }`}
                                            >
                                                <td className="p-2 font-mono">
                                                    <button
                                                        onClick={() => toggle(grn.id)}
                                                        className="inline-flex items-center gap-2 hover:underline"
                                                    >
                                                        {isOpen ? "▼" : "▶"} {grn.grnNumber}
                                                    </button>
                                                </td>
                                                <td className="p-2 font-mono">{grn.poNumber}</td>
                                                <td className="p-2 font-mono">{grn.supplierName}</td>
                                                <td className="p-2">{grn.totalItems}</td>
                                                <td className="p-2">{grn.totalQuantity}</td>
                                                <td className="p-2">{renderStatusBadge(grn.status)}</td>
                                                <td className="p-2">{grn.createdAt}</td>
                                                <td className="flex px-2 py-1 gap-2 text-left">
                                                    {grn.status === "DRAFT" && (
                                                        <Button
                                                            variant="outline"
                                                            onClick={() => updateStatus(grn.id, "RECEIVED")}
                                                            className="px-2 py-1 bg-blue-600 text-white hover:bg-blue-700 hover:text-white hover:text-white"
                                                        >
                                                            Receive
                                                        </Button>
                                                    )}
                                                    {grn.status === "RECEIVED" && (
                                                        <Button
                                                            variant="destructive"
                                                            onClick={() => updateStatus(grn.id, "CLOSED")}
                                                            className="px-2 py-1 bg-red-600 text-white hover:bg-red-700 hover:text-white"
                                                        >
                                                            Close
                                                        </Button>
                                                    )}
                                                    <Button
                                                        variant="secondary"
                                                        onClick={() => router.push(`/purchase-orders/grn/${grn.id}`)}
                                                        className="px-2 py-1 bg-orange-600 text-white hover:bg-orange-700 hover:text-white"
                                                    >
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>

                                            {/* ITEM ROWS */}
                                            {/* ITEM ROWS */}
                                            {isOpen && (
                                                <>
                                                    {/* Item Header */}
                                                    <tr className="bg-zinc-100 text-xs text-zinc-700 whitespace-nowrap">
                                                        <th className="px-4 py-2 text-left">SKU</th>
                                                        <th className="px-4 py-2 text-left">Product Name</th>
                                                        <th className="px-4 py-2 text-left">Weight</th>
                                                        <th className="px-4 py-2 text-left">PO Quantity</th>
                                                        <th className="px-4 py-2 text-left">Quantity Received</th>
                                                        <th className="px-4 py-2 text-left">PO Item ID</th>
                                                        <th className="px-4 py-2 text-left">Notes</th>
                                                        <th className="px-4 py-2"></th>
                                                    </tr>

                                                    {/* Item Rows */}
                                                    {grn.items.map((item) => (
                                                        <tr key={item.sku} className="border-t bg-zinc-50 whitespace-nowrap">
                                                            <td className="px-4 py-2">{item.sku}</td>
                                                            <td className="px-4 py-2">{item.name}</td>
                                                            <td className="px-4 py-2">{item.weightValue ?? "-"} {item.weightUnit ?? "-"}</td>
                                                            <td className="px-4 py-2 text-center">{item.poQuantity}</td>
                                                            <td className="px-4 py-2 text-center">{item.quantity}</td>
                                                            <td className="px-4 py-2">{item.poItemId}</td>
                                                            <td className="px-4 py-2">{item.notes ?? "-"}</td>
                                                            <td className="px-4 py-2"></td>
                                                        </tr>
                                                    ))}
                                                </>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
