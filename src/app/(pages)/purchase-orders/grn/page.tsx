"use client";
import { Fragment, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { Plus, X } from "lucide-react";

interface GRNItemUI {
    id: string;
    poItemId: string;
    productName: string;
    sku: string;
    weightUnit: string;
    weightValue: number;
    poQuantity: number;
    quantityReceived: number;
    returnedQuantity: number;
    remaining: number;
    receiveInput: number;
}

interface GRNUI {
    id: string;
    grnNumber: string;
    poNumber: string;
    supplierName: string;
    status: "DRAFT" | "PARTIALLY_RECEIVED" | "RECEIVED" | "CLOSED";
    locked: boolean;
    createdAt: string;
    items: GRNItemUI[];
    totalItems: number;
    totalQuantity: number;
    location: { id: string; name: string };
}

export default function GRNDashboard() {
    const [grns, setGRNs] = useState<GRNUI[]>([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [receiveModalOpen, setReceiveModalOpen] = useState(false);
    const [currentGRNId, setCurrentGRNId] = useState<string | null>(null);
    const router = useRouter();
    const [isReceiving, setIsReceiving] = useState(false);


    useEffect(() => {
        fetchGRNs();
    }, []);

    const toggle = (id: string) =>
        setOpen(prev => ({ ...prev, [id]: !prev[id] }));

    const fetchGRNs = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/grn");
            const data = await res.json();

            const mapped: GRNUI[] = data.map((grn: any) => {
                const items = grn.items.map((item: any) => {
                    const returned = item.returnedQuantity ?? 0;
                    const received = item.quantityReceived ?? 0;
                    const poQty = item.poItem?.quantity ?? 0;

                    return {
                        id: item.id,
                        poItemId: item.poItemId,
                        productName: item.poItem?.product?.name ?? "N/A",
                        sku: item.poItem?.product?.sku ?? "N/A",
                        weightUnit: item.poItem?.product?.weightUnit ?? "-",
                        weightValue: item.poItem?.product?.weightValue ?? 0,
                        poQuantity: poQty,
                        quantityReceived: received,
                        returnedQuantity: returned,
                        remaining: poQty - received + returned,
                        receiveInput: 0
                    };
                });

                const totalRemaining = items.reduce((sum, i) => sum + i.remaining, 0);
                let status: GRNUI["status"] = grn.status;

                if (
                    status === "DRAFT" &&
                    totalRemaining <
                    items.reduce((sum, i) => sum + i.poQuantity, 0) &&
                    totalRemaining > 0
                ) {
                    status = "PARTIALLY_RECEIVED";
                }

                return {
                    id: grn.id,
                    grnNumber: grn.grnNumber,
                    poNumber: grn.po?.poNumber ?? "N/A",
                    supplierName: grn.po?.supplier?.name ?? "N/A",
                    status,
                    locked: grn.locked ?? false,
                    createdAt: new Date(grn.createdAt).toLocaleString(),
                    items,
                    totalItems: items.length,
                    totalQuantity: items.reduce((s, i) => s + i.quantityReceived, 0),
                    location: grn.location
                };
            });

            setGRNs(mapped);
        } catch {
            toast.error("Failed to fetch GRNs");
        } finally {
            setLoading(false);
        }
    };

    const openReceiveModal = (grnId: string) => {
        setGRNs(prev =>
            prev.map(grn =>
                grn.id === grnId
                    ? {
                        ...grn,
                        items: grn.items.map(i => ({
                            ...i,
                            receiveInput: 0
                        }))
                    }
                    : grn
            )
        );

        setCurrentGRNId(grnId);
        setReceiveModalOpen(true);
    };

    const handleReceiveChange = (itemId: string, value: number) => {
        setGRNs(prev =>
            prev.map(grn => {
                if (grn.id !== currentGRNId) return grn;

                return {
                    ...grn,
                    items: grn.items.map(item =>
                        item.id === itemId
                            ? { ...item, receiveInput: value }
                            : item
                    )
                };
            })
        );
    };

    const receiveAll = () => {
        setGRNs(prev =>
            prev.map(grn => {
                if (grn.id !== currentGRNId) return grn;

                return {
                    ...grn,
                    items: grn.items.map(item => ({
                        ...item,
                        receiveInput: item.remaining
                    }))
                };
            })
        );
    };

    const submitReceive = async () => {
        if (!currentGRNId) return toast.error("No GRN selected");
        const grn = grns.find(g => g.id === currentGRNId);
        if (!grn) return;

        const itemsToReceive = grn.items
            .filter(i => i.receiveInput > 0 && i.receiveInput <= i.remaining)
            .map(i => ({
                grnItemId: i.id,
                quantity: i.receiveInput
            }));

        if (itemsToReceive.length === 0)
            return toast.error("Enter quantities to receive");

        setIsReceiving(true);
        try {
            const res = await fetch(`/api/grn/${currentGRNId}/status`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ items: itemsToReceive })
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to receive");

            toast.success("Received successfully");
            setReceiveModalOpen(false);
            fetchGRNs();
        } catch {
            toast.error("Receive failed");
        } finally {
            setIsReceiving(false);
        }
    };

    const currentGRN = grns.find(g => g.id === currentGRNId);
    const totalReceiving =
        currentGRN?.items.reduce((sum, i) => sum + (i.receiveInput || 0), 0) || 0;

    const renderStatusBadge = (
        status: GRNUI["status"],
        locked?: boolean
    ) => {
        const colors = {
            DRAFT: "bg-gray-500 text-white",
            PARTIALLY_RECEIVED: "bg-yellow-500 text-white",
            RECEIVED: "bg-green-600 text-white",
            CLOSED: "bg-purple-600 text-white"
        };

        return (
            <div className="flex gap-2">
                <Badge className={colors[status]}>{status}</Badge>
                {locked && <Badge variant="destructive">LOCKED</Badge>}
            </div>
        );
    };

    return (
        <div className="bg-white p-5 rounded-md">
            <div className="flex justify-between mb-4">
                <h1 className="text-2xl font-bold">Goods Received Notes</h1>
                <Button
                    onClick={() =>
                        router.push("/purchase-orders/grn/create-grn")
                    }
                    className="bg-green-600 text-white"
                >
                    <Plus size={16} /> New GRN
                </Button>
            </div>

            {loading ? (
                <Loading />
            ) : (
                <div className="overflow-auto">
                    <table className="w-full text-sm border-collapse">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-left">GRN</th>
                                <th className="p-2 text-left">PO</th>
                                <th className="p-2 text-left">Supplier</th>
                                <th className="p-2">Items</th>
                                <th className="p-2">Total Qty</th>
                                <th className="p-2">Status</th>
                                <th className="p-2">Created</th>
                                <th className="p-2">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {grns.map(grn => {
                                const isOpen = open[grn.id];

                                return (
                                    <Fragment key={grn.id}>
                                        {/* Main GRN row */}
                                        <tr className="border-b">
                                            <td className="px-2 py-1 font-mono">
                                                <button onClick={() => toggle(grn.id)}>
                                                    {isOpen ? "▼" : "▶"} {grn.grnNumber}
                                                </button>
                                            </td>
                                            <td>{grn.poNumber}</td>
                                            <td>{grn.supplierName}</td>
                                            <td className="text-center">{grn.totalItems}</td>
                                            <td className="text-center">{grn.totalQuantity}</td>
                                            <td>{renderStatusBadge(grn.status, grn.locked)}</td>
                                            <td>{grn.createdAt}</td>
                                            <td className="flex gap-2 px-2 py-1">
                                                {(grn.status !== "RECEIVED") &&
                                                    !grn.locked && (
                                                        <Button size="sm" onClick={() => openReceiveModal(grn.id)}
                                                            className="px-2 py-1 bg-green-500 text-white hover:bg-green-600 cursor-pointer"
                                                        >
                                                            Receive
                                                        </Button>
                                                    )
                                                }
                                                <Button
                                                    size="sm"
                                                    onClick={() => router.push(`/purchase-orders/grn/${grn.id}`)}
                                                    className="px-2 py-1 bg-blue-500 text-white hover:bg-blue-600 cursor-pointer"
                                                >
                                                    View GRN
                                                </Button>
                                            </td>
                                        </tr>

                                        {/* Expanded items row */}
                                        {isOpen && (
                                            <tr className="bg-gray-50">
                                                <td colSpan={8} className="p-2">
                                                    <table className="w-full text-sm border">
                                                        <thead className="bg-gray-100">
                                                            <tr>
                                                                <th className="p-1 text-left">Product</th>
                                                                <th className="p-1 text-center">SKU</th>
                                                                <th className="p-1 text-center">Ordered</th>
                                                                <th className="p-1 text-center">Received</th>
                                                                <th className="p-1 text-center">Returned</th>
                                                                <th className="p-1 text-center">Remaining</th>
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {grn.items.map(item => (
                                                                <tr key={item.id} className="border-t">
                                                                    <td className="p-1">{item.productName}</td>
                                                                    <td className="text-center">{item.sku}</td>
                                                                    <td className="text-center">{item.poQuantity}</td>
                                                                    <td className="text-center">{item.quantityReceived}</td>
                                                                    <td className="text-center">{item.returnedQuantity}</td>
                                                                    <td className="text-center font-semibold">{item.remaining}</td>
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {receiveModalOpen && currentGRNId && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-md w-[650px] max-h-[80vh] overflow-auto">

                        <h2 className="text-lg font-bold mb-2">Receive Items</h2>

                        <p className="text-sm mb-3 text-gray-600">
                            Receiving Location: {currentGRN?.location.name}
                        </p>

                        <div className="flex justify-between mb-2">
                            <span className="font-medium">
                                Total Receiving: {totalReceiving}
                            </span>

                            <Button size="sm" variant="secondary" onClick={receiveAll}>
                                Receive All
                            </Button>
                        </div>

                        <table className="w-full text-sm border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 text-left">Product</th>
                                    <th>Ordered</th>
                                    <th>Received</th>
                                    <th>Remaining</th>
                                    <th>Receive Now</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentGRN?.items.map(item => (
                                    <tr key={item.id} className="border-t">
                                        <td className="p-2">{item.productName}</td>
                                        <td className="text-center">{item.poQuantity}</td>
                                        <td className="text-center">{item.quantityReceived}</td>
                                        <td className="text-center font-semibold">{item.remaining}</td>
                                        <td className="text-center">
                                            <input
                                                type="number"
                                                min={0}
                                                max={item.remaining}
                                                value={item.receiveInput}
                                                disabled={isReceiving}
                                                onChange={e =>
                                                    handleReceiveChange(item.id, Number(e.target.value))
                                                }
                                                className="border rounded p-1 w-20 text-center"
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        <div className="mt-4 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setReceiveModalOpen(false)} disabled={isReceiving}
                                className="bg-red-500 text-white hover:bg-red-600">
                                Cancel
                            </Button>

                            <Button onClick={submitReceive} disabled={totalReceiving === 0 || isReceiving}>
                                {isReceiving ? "Receiving..." : "Confirm Receive"}
                            </Button>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
}
