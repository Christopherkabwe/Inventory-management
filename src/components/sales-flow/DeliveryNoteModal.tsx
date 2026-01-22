"use client";

import { useState } from "react";

type SaleItemType = {
    id: string;
    product: { id: string; name: string };
    quantity: number;
    quantityDelivered: number;
};

type Props = {
    saleId: string;
    saleNumber: string;
    items: SaleItemType[];
    onClose: () => void;
    onDeliveryCreated: () => void;
};

export default function DeliveryNoteModal({
    saleId,
    saleNumber,
    items,
    onClose,
    onDeliveryCreated,
}: Props) {
    const [loading, setLoading] = useState(false);
    const [deliveryQuantities, setDeliveryQuantities] = useState<Record<string, number>>(
        () =>
            items.reduce((acc, item) => {
                acc[item.id] = item.quantity - item.quantityDelivered;
                return acc;
            }, {} as Record<string, number>)
    );

    const handleQuantityChange = (itemId: string, value: number) => {
        setDeliveryQuantities((prev) => ({ ...prev, [itemId]: value }));
    };

    const createDeliveryNote = async () => {
        setLoading(true);
        try {
            // Convert deliveryQuantities map → array of items
            const payloadItems = items.map((item) => ({
                productId: item.product.id,
                quantityDelivered: deliveryQuantities[item.id],
            }));

            const res = await fetch("/api/rbac/sales-flow/delivery-note", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ saleId, items: payloadItems }),
            });

            if (res.ok) {
                alert("Delivery Note created successfully!");
                onDeliveryCreated();
                onClose();
            } else {
                const data = await res.json();
                alert(data.error || "Failed to create delivery note");
            }
        } catch (err) {
            console.error(err);
            alert("Server error while creating delivery note");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-full max-w-xl">
                <h2 className="text-xl font-bold mb-4">Create Delivery Note for Sale #{saleNumber}</h2>
                <div className="mb-4 max-h-80 overflow-y-auto">
                    {items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center py-1 border-b">
                            <span>{item.product.name}</span>
                            <input
                                type="number"
                                min={0}
                                max={item.quantity - item.quantityDelivered}
                                value={deliveryQuantities[item.id]}
                                onChange={(e) => handleQuantityChange(item.id, Number(e.target.value))}
                                className="w-20 border rounded px-2 py-1"
                            />
                            <span>
                                / {item.quantity} total ({item.quantityDelivered} delivered)
                            </span>
                        </div>
                    ))}
                </div>
                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createDeliveryNote}
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 ${loading ? "opacity-50" : ""
                            }`}
                    >
                        {loading ? "Creating..." : "Create Delivery Note"}
                    </button>
                </div>
            </div>
        </div>
    );
}
