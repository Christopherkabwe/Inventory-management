"use client";

import { useState } from "react";

type SaleItemType = {
    id: string;
    product: { id: string; name: string };
    quantityDelivered: number;
};

type Props = {
    saleId: string;
    saleNumber: string;
    items: SaleItemType[];
    onClose: () => void;
    onReturnCreated: () => void;
};

export default function ReturnsCreditModal({
    saleId,
    saleNumber,
    items,
    onClose,
    onReturnCreated,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [returnQuantities, setReturnQuantities] = useState<Record<string, number>>(
        () =>
            items.reduce((acc, item) => {
                acc[item.id] = 0;
                return acc;
            }, {} as Record<string, number>)
    );
    const [reasons, setReasons] = useState<Record<string, string>>(
        () =>
            items.reduce((acc, item) => {
                acc[item.id] = "";
                return acc;
            }, {} as Record<string, string>)
    );
    const [createCreditNote, setCreateCreditNote] = useState(false);

    const handleQuantityChange = (itemId: string, value: number) => {
        setReturnQuantities((prev) => ({ ...prev, [itemId]: value }));
    };

    const handleReasonChange = (itemId: string, value: string) => {
        setReasons((prev) => ({ ...prev, [itemId]: value }));
    };

    const submitReturn = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rbac/sales-flow/return-credit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    saleId,
                    items: returnQuantities,
                    reasons,
                    createCreditNote,
                }),
            });

            if (res.ok) {
                alert("Returns / Credit Notes processed successfully!");
                onReturnCreated();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to process returns/credit");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while processing returns");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">Process Returns / Credit Notes for Sale #{saleNumber}</h2>
                <div className="mb-4 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex flex-col py-1 border-b mb-2">
                            <span className="font-medium">{item.product.name}</span>
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="number"
                                    min={0}
                                    max={item.quantityDelivered}
                                    value={returnQuantities[item.id]}
                                    onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                    className="w-20 border rounded px-2 py-1"
                                    placeholder="Return Qty"
                                />
                                <input
                                    type="text"
                                    value={reasons[item.id]}
                                    onChange={(e) => handleReasonChange(item.id, e.target.value)}
                                    className="flex-1 border rounded px-2 py-1"
                                    placeholder="Reason"
                                />
                                <span>/ Delivered: {item.quantityDelivered}</span>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex items-center mb-4">
                    <input
                        type="checkbox"
                        id="createCredit"
                        checked={createCreditNote}
                        onChange={(e) => setCreateCreditNote(e.target.checked)}
                        className="mr-2"
                    />
                    <label htmlFor="createCredit">Generate Credit Note for returned items</label>
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={submitReturn}
                        disabled={loading}
                        className={`px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 ${loading ? "opacity-50" : ""
                            }`}
                    >
                        {loading ? "Processing..." : "Process Returns"}
                    </button>
                </div>
            </div>
        </div>
    );
}
