"use client";

import React, { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintableContent from "@/components/print/PrintableContent";
import { useReactToPrint } from "react-to-print";
import printJS from 'print-js';
import PrintButton from "@/components/print/PrintButton";

type Transfer = {
    id: string;
    ibtNumber: string;
    status: string;
    createdAt: string;
    fromLocation: { name: string };
    toLocation: { name: string };
    transporter?: { name: string; vehicleNumber?: string; driverName?: string };
    items: {
        id: string;
        quantity: number;
        product: {
            name: string;
            sku?: string;
            category?: string;
            packSize?: string;
            weightValue?: number;
            weightUnit?: string;
        };
    }[];
};

const statusStyles: Record<string, string> = {
    DRAFT: "bg-zinc-100 text-zinc-700 border-zinc-300",
    IN_TRANSIT: "bg-blue-50 text-blue-700 border-blue-200",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200",
    CANCELLED: "bg-red-50 text-red-700 border-red-200",
};

export default function TransferPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [transfer, setTransfer] = useState<Transfer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);


    useEffect(() => {
        async function load() {
            try {
                const res = await fetch(`/api/transfers/${id}`);
                if (!res.ok) throw new Error("Failed to load transfer");
                setTransfer(await res.json());
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [id]);

    if (loading)
        return (
            <div className="py-24 text-center text-sm text-zinc-500">
                Loading transfer…
            </div>
        );

    if (error)
        return (
            <div className="py-24 text-center text-sm text-red-600">
                {error}
            </div>
        );

    if (!transfer) return null;

    const totals = transfer.items.reduce(
        (acc, item) => {
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantity;
            acc.tonnage += (weight * item.quantity) / 1000;
            return acc;
        },
        { quantity: 0, tonnage: 0 }
    );

    return (
        <div>
            {/* Back */}
            <div className="mb-2">
                <a
                    href="/transfers"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 cursor-pointer"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to transfers
                </a>
            </div>

            {/* Header */}
            <div id="print-area">
                <div className="print-root">
                    <div className="space-y-5 rounded-lg bg-white p-6 shadow-sm">
                        <div className="flex flex-col gap-4 rounded-xl border bg-white p-5 shadow-sm sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
                                    Inter-Branch Transfer
                                </h1>
                                <p className="mt-1 text-sm text-zinc-500">
                                    IBT Number:{" "}
                                    <span className="font-medium text-zinc-700">
                                        {transfer.ibtNumber}
                                    </span>
                                    {" · "}
                                    Created{" "}
                                    {new Date(transfer.createdAt).toLocaleString()}
                                </p>
                            </div>

                            <span
                                className={`inline-flex items-center rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wide ${statusStyles[transfer.status] ??
                                    "bg-zinc-100 text-zinc-700 border-zinc-300"
                                    }`}
                            >
                                {transfer.status.replace("_", " ")}
                            </span>
                        </div>

                        {/* Summary */}
                        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 rounded-xl border bg-white p-6 shadow-sm print-grid-cols mb-5">
                            {[
                                {
                                    label: "From",
                                    value: transfer.fromLocation.name,
                                },
                                {
                                    label: "To",
                                    value: transfer.toLocation.name,
                                },
                                {
                                    label: "Transporter",
                                    value: transfer.transporter?.name || "—",
                                },
                                {
                                    label: "Vehicle No.",
                                    value: transfer.transporter?.vehicleNumber || "—",
                                },
                                ,
                                {
                                    label: "Driver",
                                    value: transfer.transporter?.driverName || "—",
                                },
                            ].map((item) => (
                                <div key={item.label}>
                                    <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
                                        {item.label}
                                    </p>
                                    <p className="mt-2 text-sm font-semibold text-zinc-900">
                                        {item.value}
                                    </p>
                                </div>
                            ))}
                        </div>
                        {/* Items */}
                        <div className="border bg-white shadow-sm">
                            <div className="border-b bg-zinc-50 px-6 py-4">
                                <h2 className="text-sm font-semibold text-zinc-900">
                                    Transfer Items
                                </h2>
                                <p className="mt-1 text-xs text-zinc-500">
                                    Products included in this transfer
                                </p>
                            </div>

                            {transfer.items.length === 0 ? (
                                <div className="p-8 text-center text-sm text-zinc-500">
                                    No items added to this transfer.
                                </div>
                            ) : (
                                <div className="overflow-x-auto print:overflow-visible print:w-full">
                                    <table className="w-full text-sm">
                                        <thead className="bg-zinc-100">
                                            <tr className="border-b border-zinc-300">
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Product
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    SKU
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Category
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Pack Size
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    UoM
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Weight
                                                </th>
                                                <th className="border-r border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Quantity
                                                </th>
                                                <th className="border-b border-zinc-300 px-6 py-3 text-left text-sm font-semibold uppercase tracking-wider text-zinc-700">
                                                    Tonnage
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {transfer.items.map((item, index) => (
                                                <tr
                                                    key={item.id}
                                                    className={`
                                            ${index % 2 === 0 ? "bg-white border-b border-zinc-200" : "bg-zinc-50 border-b border-zinc-200"}
                                            hover:bg-blue-50 transition-colors
                                        `}
                                                >
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-900">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-600">
                                                        {item.product.sku || "—"}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-600">
                                                        {item.product.category || "—"}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-600">
                                                        {item.product.packSize || "—"}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-600">
                                                        {item.product.weightUnit || "—"}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 text-zinc-600">
                                                        {(item.product.weightValue?.toFixed(2) || "—")}
                                                    </td>
                                                    <td className="border-r border-zinc-200 px-6 py-4 tabular-nums text-zinc-900">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="border-b border-zinc-200 px-6 py-4 tabular-nums text-zinc-900">
                                                        {(item.product.weightValue * item.quantity / 1000).toFixed(2) || "—"} MT
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot>
                                            <tr className="border-b border-zinc-400 bg-zinc-100 font-semibold">
                                                {/* Span first 6 columns */}
                                                <td
                                                    colSpan={6}
                                                    className="border-r border-zinc-300 px-6 py-4 text-center uppercase tracking-wider text-zinc-700"
                                                >
                                                    Total
                                                </td>

                                                {/* Quantity total */}
                                                <td className="border-r border-zinc-300 px-6 py-4 tabular-nums text-zinc-900">
                                                    {totals.quantity}
                                                </td>

                                                {/* Tonnage total */}
                                                <td className="px-6 py-4 tabular-nums text-zinc-900">
                                                    {totals.tonnage.toFixed(2)} MT
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <PrintButton mode="landscape" />
        </div >
    );
}