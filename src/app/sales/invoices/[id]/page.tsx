"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";
import { getBusinessInfo } from "@/lib/businessInfo";
import { useUser } from "@/app/context/UserContext";

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

type Payment = {
    id: string;
    method: string;
    amount: number;
    reference?: string;
};
type Transporter = {
    name: string;
    vehicleNumber?: string;
    driverName?: string;
    driverPhone?: string;
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
    createdBy: string;
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
    transporter: Transporter;
    items: InvoiceItem[];
    payments?: Payment[];
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
    PENDING: "bg-orange-400 text-black font-semibold",
};

/* =======================
   COMPONENT
======================= */
export default function InvoicePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const user = useUser();
    const [invoice, setInvoice] = useState<Invoice | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const business = getBusinessInfo();

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
    const totalPaid = (invoice.payments ?? []).reduce(
        (sum, p) => sum + p.amount,
        0
    );

    const balance = totals.subtotal - totalPaid;

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
                <div id="print-area" className="print:border print:border-black bg-white ">
                    <div className="space-y-1 py-4">
                        {/* HEADER */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 justify-between print-grid-cols-3">
                            <div className="space-y-1 px-5">
                                <p className="text-2xl font-bold text-blue-900">{business.name}</p>
                                <p className="text-sm">TPIN: {business.TPIN}</p>
                                <p className="text-sm">{business.address}</p>
                                <p className="text-sm">{business.email}</p>
                                <p className="text-sm">{business.contact}</p>
                            </div>

                            <div className="hidden xl:flex print:flex flex-col justify-center items-center overflow-x-auto w-full">
                                <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                                <RotateCw className="xl:h-20 xl:w-20 h-12 w-12 text-black-500" />
                            </div>

                            <div className="text-right px-5">
                                <h1 className="text-4xl font-bold text-blue-900 mb-4">INVOICE</h1>
                                <span className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[invoice.status]}`}>
                                    {invoice.status}
                                </span>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-2 mt-2" />

                        {/* META */}
                        <div className="grid grid-cols-2 px-5 xl:grid-cols-3 mb-5 print-grid-cols-3">
                            <div>
                                <h1 className="font-semibold">Order Details</h1>
                                <p className="text-sm font-normal">
                                    Invoice No: <span className="text-sm">{invoice.invoiceNumber}</span>
                                </p>

                                {/* Sales Order Number */}
                                {invoice.salesOrderNumber && (
                                    <p className="text-sm">
                                        Sales Order: <span className="font-normal">{invoice.salesOrderNumber}</span>
                                    </p>
                                )}

                                {/* Delivery Note Numbers */}
                                <p className="text-sm">
                                    Delivery Note(s): <span className="font-normal">{invoice.deliveryNoteNumbers?.join(", ")}</span>
                                </p>

                                <p className="text-sm">Date Issued: {new Date(invoice.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm">Prepared By: {user?.fullName}</p>
                                <p className="text-sm">
                                    Point of Sale : {invoice.location?.name ?? "-"}
                                </p>
                            </div>

                            <div>
                                <h1 className="font-semibold">Customer Details</h1>
                                <p className="text-sm">{invoice.customer.name}</p>
                                <p className="text-sm">{invoice.customer.address}</p>
                                <p className="text-sm">TPIN: {invoice.customer.tpinNumber}</p>
                                <p className="text-sm">{invoice.customer.email}</p>
                                <p className="text-sm">{invoice.customer.phone}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Payments</p>
                                <p className="text-sm">
                                    Amount Paid: K{totalPaid.toFixed(2)}
                                </p>
                                <p className="text-sm">
                                    Balance Due: K{balance.toFixed(2)}
                                </p>
                                {invoice.payments?.map((p, i) => (
                                    <p key={p.id} className="text-xs text-gray-600">
                                        {p.method}
                                        {p.reference ? ` (${p.reference})` : ""} – K{p.amount.toFixed(2)}
                                    </p>
                                ))}
                            </div>
                        </div>

                        <hr className="border-t border-black mb-5" />

                        {/* ITEMS TABLE */}
                        <div className="px-5 overflow-x-auto">
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
                        <div className="grid grid-cols-1 px-5 mt-8 mb-10">
                            <p>Received By: _____________________</p>
                            <p>Time: ____________________________</p>
                            <p>Signature: _______________________</p>
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
