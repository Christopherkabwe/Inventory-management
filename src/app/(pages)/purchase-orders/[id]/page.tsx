"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";
import { getBusinessInfo } from "@/lib/businessInfo";
import { useUser } from "@/app/context/UserContext";
import Link from "next/link";

/* ================= TYPES ================= */

type Product = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    weightUnit: string;
    weightValue: number;
    price?: number;
};

type POItem = {
    id: string;
    quantity: number;
    unitPrice: number;
    product: Product;
};

type PurchaseOrder = {
    id: string;
    poNumber: string;
    status: string;
    createdAt: string;
    expectedDeliveryDate?: string;
    terms?: string;

    supplier?: {
        name?: string;
        address?: string;
        phone?: string;
        email?: string;
        tpin?: string;
    };

    location?: {
        name?: string;
        address?: string;
    };

    items: POItem[];
};

/* ================= STATUS STYLES ================= */

const statusStyles: Record<string, string> = {
    APPROVED: "bg-green-400 text-black font-semibold",
    PENDING: "bg-yellow-400 text-black font-semibold",
    CANCELLED: "bg-zinc-400 text-black font-semibold",
    RECEIVED: "bg-blue-400 text-black font-semibold",
};

/* ================= COMPONENT ================= */

export default function PurchaseOrderPage() {
    const { id } = useParams<{ id: string }>();
    const user = useUser();
    const business = getBusinessInfo();

    const [po, setPO] = useState<PurchaseOrder | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchPO() {
            try {
                const res = await fetch(`/api/purchase-orders/${id}`);
                const data = await res.json();
                setPO(data);
            } finally {
                setLoading(false);
            }
        }

        fetchPO();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading Purchase Order…</div>;
    if (!po) return null;

    /* ================= TOTALS ================= */

    const subtotalValue = po.items.reduce(
        (sum, item) => sum + item.quantity * item.unitPrice,
        0
    );
    const totalQty = po.items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    /* ================= RENDER ================= */

    return (
        <div>
            <div className="px-2">

                {/* Back */}
                <div className="mb-4">
                    <Link
                        href="/purchase-orders"
                        className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                    >
                        <ArrowLeft className="h-4 w-4" /> Back
                    </Link>
                </div>

                {/* PRINT AREA */}
                <div id="print-area" className="print:border print:border-black bg-white">

                    <div className="space-y-1 py-4">

                        {/* HEADER */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 print-grid-cols-3">

                            <div className="space-y-1 px-5">
                                <p className="text-2xl font-bold text-blue-900">{business.name}</p>
                                <p className="text-sm">TPIN: {business.TPIN}</p>
                                <p className="text-sm">{business.address}</p>
                                <p className="text-sm">{business.email}</p>
                                <p className="text-sm">{business.contact}</p>
                            </div>

                            <div className="hidden xl:flex print:flex flex-col justify-center items-center">
                                <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                                <RotateCw className="h-20 w-20" />
                            </div>

                            <div className="text-right px-5">
                                <h1 className="text-4xl font-bold text-blue-900 mb-4">PURCHASE ORDER</h1>
                                <span className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[po.status]}`}>
                                    {po.status}
                                </span>
                            </div>
                        </div>

                        <hr className="border-t border-black my-2" />

                        {/* META */}
                        <div className="grid grid-cols-2 xl:grid-cols-3 px-5 mb-5 print-grid-cols-3">

                            {/* ORDER DETAILS */}
                            <div>
                                <h1 className="font-semibold">Order Details</h1>

                                <p className="text-sm">
                                    PO No: {po.poNumber}
                                </p>

                                <p className="text-sm">
                                    Date Issued: {new Date(po.createdAt).toLocaleDateString()}
                                </p>

                                <p className="text-sm">
                                    Expected Delivery:{" "}
                                    {po.expectedDeliveryDate
                                        ? new Date(po.expectedDeliveryDate).toLocaleDateString()
                                        : "-"}
                                </p>

                                <p className="text-sm">
                                    Prepared By: {user?.fullName ?? "-"}
                                </p>

                                <p className="text-sm">
                                    Delivery Location: {po.location?.name ?? "-"}
                                </p>
                            </div>

                            {/* SUPPLIER DETAILS */}
                            <div>
                                <h1 className="font-semibold">Supplier Details</h1>

                                <p className="text-sm">{po.supplier?.name}</p>
                                <p className="text-sm">{po.supplier?.address}</p>
                                <p className="text-sm">TPIN: {po.supplier?.tpin ?? "-"}</p>
                                <p className="text-sm">{po.supplier?.email}</p>
                                <p className="text-sm">{po.supplier?.phone}</p>
                            </div>

                            {/* TOTAL SUMMARY */}
                            <div>
                                <h1 className="font-semibold">Summary</h1>

                                <p className="text-sm">
                                    Total Items: {po.items.length}
                                </p>

                                <p className="text-sm font-semibold">
                                    Order Total: K{subtotalValue.toFixed(2)}
                                </p>
                            </div>

                        </div>

                        <hr className="border-t border-black mb-5" />

                        {/* ITEMS TABLE */}
                        <div className="px-5 overflow-x-auto">
                            <table className="w-full text-sm">

                                <thead className="bg-zinc-100 border border-black">
                                    <tr>
                                        <th className="px-4 py-2 border-r border-black text-center">SKU</th>
                                        <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Pack Size</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Unit Price</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Qty</th>
                                        <th className="px-4 py-2 text-center">Total</th>
                                    </tr>
                                </thead>

                                <tbody className="border border-black">
                                    {po.items.map(item => {

                                        const total = item.quantity * item.unitPrice;

                                        return (
                                            <tr key={item.id}>

                                                <td className="px-4 py-2 border-r border-black text-center">
                                                    {item.product.sku ?? "-"}
                                                </td>
                                                <td className="px-4 py-2 border-r border-black">
                                                    {item.product.name}
                                                </td>

                                                <td className="px-4 py-2 border-r border-black text-center">
                                                    {item.product.packSize ?? "-"}
                                                </td>
                                                <td className="px-4 py-2 border-r border-black text-center">
                                                    {item.product.weightValue ?? "-"}  {item.product.weightUnit ?? "-"}
                                                </td>

                                                <td className="px-4 py-2 border-r border-black text-center">
                                                    K{item.unitPrice.toFixed(2)}
                                                </td>

                                                <td className="px-4 py-2 border-r border-black text-center">
                                                    {item.quantity}
                                                </td>

                                                <td className="px-4 py-2 text-center">
                                                    K{total.toFixed(2)}
                                                </td>
                                            </tr>
                                        );
                                    })}

                                    <EmptyRows columns={7} count={Math.max(0, 10 - po.items.length)} />
                                </tbody>

                                <tfoot className="border border-black">
                                    <tr className="bg-zinc-100 font-semibold">
                                        <td colSpan={5} className="px-4 py-2 text-center border-r border-black">
                                            TOTAL
                                        </td>
                                        <td className="px-4 py-2 text-center  border-r border-black">
                                            {totalQty}
                                        </td>

                                        <td className="px-4 py-2 text-center">
                                            K{subtotalValue.toFixed(2)}
                                        </td>
                                    </tr>
                                </tfoot>

                            </table>
                        </div>

                        {/* TERMS & CONDITIONS */}
                        <div className="px-5 mt-6">
                            <h1 className="font-semibold mb-1">Terms & Conditions</h1>

                            <p className="text-xs text-zinc-700 whitespace-pre-line">
                                {po.terms ?? "Standard company purchasing terms apply."}
                            </p>
                        </div>

                        {/* SIGNATURE */}
                        <div className="grid grid-cols-1 px-5 mt-8 mb-10">
                            <p>Authorized By: _____________________</p>
                            <p>Date: ____________________________</p>
                            <p>Signature: _______________________</p>
                        </div>

                    </div>
                </div>

                {/* PRINT */}
                <div className="mr-6 mt-4 flex justify-end">
                    <PrintButton mode="landscape" />
                </div>

            </div>
        </div>
    );
}
