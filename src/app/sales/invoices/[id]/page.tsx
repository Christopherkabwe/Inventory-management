"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";

/* =======================
   TYPES
======================= */
type ProductType = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    price?: number;
    weightValue?: number;
    weightUnit?: string;
};

type InvoiceItem = {
    id: string;
    quantity: number;
    price: number;
    product: ProductType;
};

type Invoice = {
    id: string;
    invoiceNumber: string;
    status: "PAID" | "UNPAID" | "PARTIAL" | "CANCELLED" | "CONFIRMED";
    createdAt: string;
    dueDate?: string;
    customer: {
        name: string;
        email?: string;
        phone?: string;
        tpinNumber?: string;
        address?: string;
    };
    location?: {
        name?: string;
        address?: string;
    };
    items: InvoiceItem[];
    amountPaid?: number;
    salesOrderNumber?: string | null;
    deliveryNoteNumbers?: string[];
};

/* =======================
   STYLES
======================= */
const statusStyles: Record<string, string> = {
    CONFIRMED: "bg-green-400 text-black font-semibold",
    PAID: "bg-green-400 text-black font-semibold",
    UNPAID: "bg-red-400 text-black font-semibold",
    PARTIAL: "bg-yellow-400 text-black font-semibold",
    CANCELLED: "bg-zinc-400 text-black font-semibold",
};

/* =======================
   COMPONENT
======================= */
export default function InvoicePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchInvoice() {
            try {
                const res = await fetch(`/api/rbac/sales-flow/invoices/${id}`);
                if (!res.ok) throw new Error("Failed to fetch invoice");
                const data: Invoice = await res.json();
                setInvoice(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoice();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading invoice…</div>;
    if (error) return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
    if (!invoice) return null;

    /* =======================
       TOTALS
    ======================= */
    const totals = invoice.items.filter(item => item.quantity > 0).reduce(
        (acc, item) => {
            const price = item.product.price ?? 0;
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantity;
            acc.tonnage += (weight * item.quantity) / 1000;
            acc.subtotal += price * item.quantity;
            return acc;
        },
        { quantity: 0, tonnage: 0, subtotal: 0 }
    );

    const amountPaid = invoice.amountPaid ?? 0;
    const balance = totals.subtotal - amountPaid;

    /* =======================
       RENDER
    ======================= */
    return (
        <DashboardLayout>
            <div className="px-2">
                {/* Back */}
                <div className="mb-4">
                    <button
                        className="inline-flex items-center gap-2 text-sm cursor-pointer font-medium text-zinc-600 hover:text-zinc-900"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                </div>

                {/* PRINT AREA */}
                <div id="print-area" className="print:border print:border-black bg-white">
                    <div className="space-y-2 px-5 py-4">
                        {/* HEADER */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 mb-3 justify-between print-grid-cols-3">
                            <div className="space-y-1">
                                <p className="text-2xl font-bold text-blue-900">Biz360° Business Management</p>
                                <p className="font-semibold">Lusaka, Zambia</p>
                                <p>support@biz360.com</p>
                                <p>+260 978 370 871</p>
                            </div>

                            <div className="hidden sm:flex justify-center items-center overflow-x-auto p-10 gap-5 w-full">
                                <RotateCw className="xl:h-20 xl:w-20 h-12 w-12 text-blue-900" />
                                <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                            </div>

                            <div className="text-right">
                                <h1 className="text-4xl font-bold text-blue-900 mb-4">INVOICE</h1>
                                <span className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[invoice.status]}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-3" />

                        {/* META */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 mb-5 print-grid-cols-3">
                            <div>
                                <p className="text-sm font-semibold">
                                    Invoice No: <span className="font-normal">{invoice.invoiceNumber}</span>
                                </p>

                                {/* Sales Order Number */}
                                {invoice.salesOrderNumber && (
                                    <p className="text-sm">
                                        Sales Order: <span className="font-normal">{invoice.salesOrderNumber}</span>
                                    </p>
                                )}

                                {/* Delivery Note Numbers */}
                                {invoice.deliveryNoteNumbers && invoice.deliveryNoteNumbers.length > 0 && (
                                    <p className="text-sm">
                                        Delivery Note(s): <span className="font-normal">{invoice.deliveryNoteNumbers.join(", ")}</span>
                                    </p>
                                )}

                                <p className="text-sm">Date: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm">
                                    Due Date: {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
                                </p>
                            </div>

                            <div>
                                <p className="font-semibold">{invoice.customer.name}</p>
                                <p>{invoice.customer.address}</p>
                                <p>TPIN: {invoice.customer.tpinNumber}</p>
                                <p>{invoice.customer.email}</p>
                                <p>{invoice.customer.phone}</p>
                            </div>

                            <div>
                                <p className="text-sm">
                                    Amount Paid: <strong>K{amountPaid.toFixed(2)}</strong>
                                </p>
                                <p className="text-sm">
                                    Balance Due: <strong>K{balance.toFixed(2)}</strong>
                                </p>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-5" />

                        {/* ITEMS TABLE */}
                        <div className="overflow-x-auto border shadow-sm">
                            <table className="w-full text-sm">
                                <thead className="bg-zinc-100 border border-black">
                                    <tr>
                                        <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                        <th className="px-4 py-2 border-r border-black text-center">SKU</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Pack</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Qty</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Tonnage</th>
                                        <th className="px-4 py-2 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="border border-black">
                                    {invoice.items.filter(item => item.quantity > 0).map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 border-r border-black">{item.product.name}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.product.sku ?? "-"}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.product.packSize ?? "-"}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">K{(item.product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.quantity}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">
                                                {(((item.product.weightValue ?? 0) * item.quantity) / 1000).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-center">K{((item.product.price ?? 0) * item.quantity).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <EmptyRows columns={7} count={Math.max(0, 10 - invoice.items.length)} />
                                </tbody>
                                <tfoot className="border border-black">
                                    <tr className="bg-zinc-100 font-semibold">
                                        <td colSpan={4} className="px-4 py-2 text-center border-r border-black">
                                            TOTAL
                                        </td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.quantity}</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.tonnage.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center">K{totals.subtotal.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* FOOTER */}
                        <div className="flex justify-between mt-8 mb-10">
                            <div>Received By: _____________________</div>
                            <div>Authorised By: _____________________</div>
                        </div>
                    </div>
                </div>

                {/* PRINT */}
                <div className="mr-6 mt-4 flex justify-end">
                    <PrintButton mode="landscape" />
                </div>
            </div>
        </DashboardLayout>
    );
}
