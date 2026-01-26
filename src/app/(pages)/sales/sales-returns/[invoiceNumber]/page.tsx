"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "next/navigation";
import { useUser } from "@/app/context/UserContext";
import DashboardLayout from "@/components/DashboardLayout";
import { useRef } from "react";

interface SaleItem {
    id: string;
    productId: string;
    productName: string;
    quantityDelivered: number;
    quantityReturned: number;
}

interface Sale {
    id: string;
    invoiceNumber: string;
    locationId: string;
    location: {
        id: string;
        name: string;
    };
    items: SaleItem[];
}

export default function SaleReturnForm() {
    const { invoiceNumber } = useParams<{ invoiceNumber: string }>();
    const fetchedRef = useRef(false);
    const [sale, setSale] = useState<Sale | null>(null);

    const [loading, setLoading] = useState(false);
    const [returns, setReturns] = useState<Record<string, { quantity: number; reason: string }>>({});


    const fetchSale = async () => {
        if (!invoiceNumber) return;

        setLoading(true);
        try {
            const res = await axios.get(
                `/api/invoices/invoice-number/${invoiceNumber}`
            );

            setSale(res.data);

            const init: Record<string, { quantity: number; reason: string }> = {};
            res.data.items.forEach((item: SaleItem) => {
                init[item.productId] = { quantity: 0, reason: "" };
            });
            setReturns(init);
        } catch {
            alert("Sale not found");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!invoiceNumber) return;
        if (fetchedRef.current) return;

        fetchedRef.current = true;
        fetchSale();
    }, [invoiceNumber]);

    // Handle changes to return quantities or reason
    const handleReturnChange = (
        productId: string,
        field: "quantity" | "reason",
        value: string | number
    ) => {
        setReturns((prev) => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    // Submit return
    const handleSubmit = async () => {
        if (!sale) return;

        const returnItems = Object.entries(returns)
            .filter(([_, v]) => v.quantity > 0)
            .map(([productId, v]) => ({
                saleId: sale.id,
                productId,
                locationId: sale.locationId,
                quantity: v.quantity,
                reason: v.reason,
            }));

        if (returnItems.length === 0) {
            alert("Enter at least one return quantity");
            return;
        }

        try {
            await Promise.all(
                returnItems.map((item) => axios.post("/api/sales-returns", item))
            );
            alert("Return submitted successfully!");
            setSale(null);
            setReturns({});
        } catch (err: any) {
            alert(err.response?.data?.error || err.message);
        }
    };

    return (
        <div className="p-5 bg-white shadow rounded max-w-3xl mx-auto">
            <h2 className="text-xl font-bold mb-4">
                Process Sale Return: {invoiceNumber}
            </h2>

            {loading && <p>Loading sale details...</p>}

            {sale && (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="border p-2 text-center">Location</th>
                                <th className="border p-2 text-left">Product</th>
                                <th className="border p-2 text-center">Delivered</th>
                                <th className="border p-2 text-center">Already Returned</th>
                                <th className="border p-2 text-center">Return Quantity</th>
                                <th className="border p-2 text-left">Reason</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sale.items.map((item) => {
                                const remaining = item.quantityDelivered - item.quantityReturned;
                                return (
                                    <tr key={item.productId}>
                                        <td className="border p-2 whitespace-nowrap">{sale.location?.name}</td>
                                        <td className="border p-2 whitespace-nowrap">{item.productName}</td>
                                        <td className="border p-2 text-center">{item.quantityDelivered}</td>
                                        <td className="border p-2 text-center">{item.quantityReturned}</td>
                                        <td className="border p-2 text-center">
                                            <input
                                                type="number"
                                                min={0}
                                                max={remaining}
                                                value={returns[item.productId]?.quantity || 0}
                                                onChange={(e) =>
                                                    handleReturnChange(
                                                        item.productId,
                                                        "quantity",
                                                        parseInt(e.target.value) || 0
                                                    )
                                                }
                                                className="w-20 border rounded p-1 text-center"
                                            />
                                            <div className="text-xs text-gray-500">{remaining} remaining</div>
                                        </td>
                                        <td className="border p-2">
                                            <input
                                                type="text"
                                                value={returns[item.productId]?.reason || ""}
                                                onChange={(e) =>
                                                    handleReturnChange(item.productId, "reason", e.target.value)
                                                }
                                                placeholder="Reason"
                                                className="border rounded p-1 w-full"
                                            />
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <button
                        onClick={handleSubmit}
                        className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Submit Return
                    </button>
                </div>
            )}
        </div>
    );
}
