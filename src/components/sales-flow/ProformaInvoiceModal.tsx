"use client";

import { useState } from "react";

type Props = {
    salesOrderId: string;
    orderNumber: string;
    onClose: () => void;
    onCreated: () => void;
};

export default function ProformaInvoiceModal({
    salesOrderId,
    orderNumber,
    onClose,
    onCreated,
}: Props) {
    const [loading, setLoading] = useState(false);

    const createProforma = async () => {
        setLoading(true);
        try {
            const res = await fetch(
                "/api/rbac/sales-flow/proforma-invoice",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ salesOrderId }),
                }
            );

            const data = await res.json();

            if (!res.ok) {
                alert(data.error || "Failed to create pro-forma");
                return;
            }

            alert("Pro-forma invoice created successfully");
            onCreated();
            onClose();
        } catch (err) {
            console.error(err);
            alert("Server error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow w-full max-w-md">
                <h2 className="text-xl font-bold mb-4">
                    Create Pro-forma for Order #{orderNumber}
                </h2>

                <p className="text-sm text-gray-600 mb-4">
                    This will generate a non-accounting pro-forma invoice.
                </p>

                <div className="flex justify-end gap-2">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 bg-gray-300 rounded"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={createProforma}
                        disabled={loading}
                        className={`px-4 py-2 bg-indigo-600 text-white rounded ${loading ? "opacity-50" : ""
                            }`}
                    >
                        {loading ? "Creating..." : "Create Pro-forma"}
                    </button>
                </div>
            </div>
        </div>
    );
}
