"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Printer } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintButton from "@/components/print/PrintButton";
import Loading from "@/components/Loading";
import EmptyRows from "@/components/EmptyRows";

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
    status: "PAID" | "UNPAID" | "PARTIAL" | "CANCELLED";
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
};

// Status styles
const statusStyles: Record<string, string> = {
    PAID: "bg-green-400 text-black font-semibold",
    UNPAID: "bg-red-400 text-black font-semibold",
    PARTIAL: "bg-yellow-400 text-black font-semibold",
    CANCELLED: "bg-zinc-400 text-black font-semibold",
};

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
                const data = await res.json();
                setInvoice(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchInvoice();
    }, [id]);

    if (loading) return <Loading message="Loading invoice..." />;
    if (error)
        return (
            <div className="py-24 text-center text-sm text-red-600">{error}</div>
        );
    if (!invoice) return null;

    // Calculate totals
    const totals = invoice.items.reduce(
        (acc, item) => {
            const price = item.product.price ?? 0;
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantity;
            acc.tonnage += (weight * item.quantity) / 1000; // MT
            acc.subtotal += price * item.quantity;
            return acc;
        },
        { quantity: 0, tonnage: 0, subtotal: 0 }
    );

    const amountPaid = invoice.amountPaid ?? 0;
    const balance = totals.subtotal - amountPaid;

    return (
        <DashboardLayout>
            <div className="px-4 py-2">
                {/* Back */}
                <button
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 mb-4"
                    onClick={() => router.back()}
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back
                </button>

                {/* Invoice container */}
                <div
                    id="print-area"
                    className="bg-white border print:border print:border-black p-5 rounded-md shadow-sm"
                >
                    {/* HEADER */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 mb-3">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-blue-900">
                                Biz360° Business Management
                            </p>
                            <p className="font-semibold">Lusaka, Zambia</p>
                            <p>support@biz360.com</p>
                            <p>+260 978 370 871</p>
                        </div>

                        <div className="hidden sm:flex justify-center items-center p-10 gap-5">
                            <Printer className="xl:h-20 xl:w-20 h-12 w-12 text-blue-900" />
                            <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                        </div>

                        <div className="text-right">
                            <h1 className="text-4xl font-bold text-blue-900 mb-2">INVOICE</h1>
                            <span
                                className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[invoice.status]
                                    }`}
                            >
                                {invoice.status}
                            </span>
                        </div>
                    </div>

                    <hr className="border-t border-black mb-4" />

                    {/* META */}
                    <div className="grid grid-cols-1 xl:grid-cols-3 mb-5">
                        <div>
                            <p className="text-sm font-semibold">
                                Invoice No:{" "}
                                <span className="font-normal">{invoice.invoiceNumber}</span>
                            </p>
                            <p className="text-sm">
                                Date: {new Date(invoice.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                Due Date:{" "}
                                {invoice.dueDate
                                    ? new Date(invoice.dueDate).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <div>
                            <p className="font-semibold">{invoice.customer.name}</p>
                            <p>{invoice.customer.address ?? "-"}</p>
                            <p>TPIN: {invoice.customer.tpinNumber ?? "-"}</p>
                            <p>{invoice.customer.email ?? "-"}</p>
                            <p>{invoice.customer.phone ?? "-"}</p>
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
                        <table className="w-full text-sm border-collapse border border-black">
                            <thead className="bg-zinc-100 border border-black">
                                <tr>
                                    <th className="px-4 py-2 border-r border-black text-left">
                                        Product
                                    </th>
                                    <th className="px-4 py-2 border-r border-black text-center">
                                        SKU
                                    </th>
                                    <th className="px-4 py-2 border-r border-black text-center">
                                        Pack
                                    </th>
                                    <th className="px-4 py-2 border-r border-black text-center">
                                        Price
                                    </th>
                                    <th className="px-4 py-2 border-r border-black text-center">
                                        Qty
                                    </th>
                                    <th className="px-4 py-2 border-r border-black text-center">
                                        Tonnage
                                    </th>
                                    <th className="px-4 py-2 text-center">Total</th>
                                </tr>
                            </thead>
                            <tbody className="border border-black">
                                {invoice.items.map((item) => (
                                    <tr key={item.id}>
                                        <td className="px-4 py-2 border-r border-black">
                                            {item.product.name}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            {item.product.sku ?? "-"}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            {item.product.packSize ?? "-"}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            K{(item.product.price ?? 0).toFixed(2)}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            {(((item.product.weightValue ?? 0) * item.quantity) / 1000).toFixed(
                                                2
                                            )}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            K{((item.product.price ?? 0) * item.quantity).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <EmptyRows columns={7} count={Math.max(0, 10 - invoice.items.length)} />
                            </tbody>
                            <tfoot className="border border-black">
                                <tr className="bg-zinc-100 font-semibold">
                                    <td colSpan={4} className="px-4 py-2 text-center border-r border-black">
                                        TOTAL
                                    </td>
                                    <td className="px-4 py-2 text-center border-r border-black">
                                        {totals.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-center border-r border-black">
                                        {totals.tonnage.toFixed(2)}
                                    </td>
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

                {/* PRINT BUTTON */}
                <div className="flex justify-end mt-4">
                    <PrintButton mode="landscape" />
                </div>
            </div>
        </DashboardLayout>
    );
}
