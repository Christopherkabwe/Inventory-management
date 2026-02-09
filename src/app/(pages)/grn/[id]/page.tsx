"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import Link from "next/link";
import { getBusinessInfo } from "@/lib/businessInfo";
import { useUser } from "@/app/context/UserContext";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";

export type GRNItem = {
    id: string;
    quantityReceived: number;
    returnedQuantity: number;
    poItemId: string;
    poItem: {
        id: string;
        quantity: number; // the originally ordered quantity
        uom: string;      // unit of measurement from the PO
        unitPrice: number; // price per unit
        product: {
            id: string;
            name: string;
            sku?: string | null;
            weightUnit: string;
            weightValue: number;
        };
    };
    supplierReturnItems?: any[]; // raw Prisma data
};


type GRN = {
    id: string;
    grnNumber: string;
    status: string;
    createdAt: string;
    poNumber?: string;
    supplier?: {
        name?: string;
        address?: string;
        phone?: string;
        email?: string;
        tpin?: string;
    };
    po?: {
        poNumber: string;
        supplier?: {
            id: string;
            name: string;
            address: string;
            email: string;
            phone: string;
            tpinNumber: string;
        }
    }
    location?: {
        name?: string;
        address?: string;
    };
    items: GRNItem[];
};

const statusStyles: Record<string, string> = {
    DRAFT: "bg-gray-500 text-white font-semibold",
    PARTIALY_RECEIVED: "bg-yellow-500 text-black font-semibold",
    RECEIVED: "bg-green-600 text-white font-semibold",
    CLOSED: "bg-purple-600 text-white font-semibold",
};

export default function GRNViewPage() {
    const { id } = useParams<{ id: string }>();
    const user = useUser();
    const business = getBusinessInfo();

    const [grn, setGRN] = useState<GRN | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchGRN() {
            try {
                const res = await fetch(`/api/grn/${id}`);
                const data = await res.json();
                setGRN(data);
                console.log(data)
            } finally {
                setLoading(false);
            }
        }

        fetchGRN();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading GRN…</div>;
    if (!grn) return null;

    const totalQty = grn.items.reduce((sum, i) => sum + i.poItem.quantity, 0);
    const totalReceived = grn.items.reduce((sum, i) => sum + i.quantityReceived, 0);
    const totalReturned = grn.items.reduce((sum, i) => sum + i.returnedQuantity, 0);
    const remaining = totalQty - totalReceived + totalReturned
    return (
        <div className="px-2">

            {/* Back */}
            <div className="mb-4">
                <Link
                    href="/grn"
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
                            <h1 className="text-4xl font-bold text-blue-900 mb-4">GRN</h1>
                            <span className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[grn?.status]}`}>
                                {grn?.status}
                            </span>
                        </div>
                    </div>

                    <hr className="border-t border-black my-2" />

                    {/* META */}
                    <div className="grid grid-cols-2 xl:grid-cols-3 px-5 mb-5 print-grid-cols-3">
                        {/* GRN Details */}
                        <div>
                            <h1 className="font-semibold">GRN Details</h1>
                            <p className="text-sm">GRN No: {grn.grnNumber}</p>
                            <p className="text-sm">PO No: {grn.po?.poNumber ?? "-"}</p>
                            <p className="text-sm">Date Received: {new Date(grn.createdAt).toLocaleDateString()}</p>
                            <p className="text-sm">Received By: {user?.fullName ?? "-"}</p>
                            <p className="text-sm">Location: {grn.location?.name ?? "-"}</p>
                        </div>

                        {/* Supplier Details */}
                        <div>
                            <h1 className="font-semibold">Supplier Details</h1>
                            <p className="text-sm">{grn.po?.supplier?.name}</p>
                            <p className="text-sm">{grn.po?.supplier?.address}</p>
                            <p className="text-sm">TPIN: {grn.po?.supplier?.tpinNumber ?? "-"}</p>
                            <p className="text-sm">{grn.po?.supplier?.email}</p>
                            <p className="text-sm">{grn.po?.supplier?.phone}</p>
                        </div>

                        {/* Totals */}
                        <div>
                            <h1 className="font-semibold">Summary</h1>
                            <p className="text-sm">Total Items: {grn.items.length}</p>
                            <p className="text-sm">Total Qty Received: {totalReceived}</p>
                            <p className="text-sm">Total Qty Pending: {remaining}</p>
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
                                    <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                    <th className="px-4 py-2 border-r border-black text-center">Ordered</th>
                                    <th className="px-4 py-2 border-r border-black text-center">Received</th>
                                    <th className="px-4 py-2 border-r border-black text-center">Returned</th>
                                    <th className="px-4 py-2 text-center">Pending</th>
                                </tr>
                            </thead>

                            <tbody className="border border-black">
                                {grn?.items?.map(item => {
                                    const remaining = (item.poItem.quantity ?? 0)
                                        - (item.quantityReceived ?? 0)
                                        + (item.returnedQuantity ?? 0);
                                    return (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.poItem.product?.sku ?? "-"}</td>
                                            <td className="px-4 py-2 border-r border-black">{item.poItem.product?.name}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{(item.poItem.product?.weightValue).toFixed(2)} {item.poItem.product?.weightUnit}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.poItem.quantity}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.quantityReceived}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.returnedQuantity ?? 0}</td>
                                            <td className="px-4 py-2 text-center font-semibold">{remaining}</td>
                                        </tr>
                                    );
                                })}

                                <EmptyRows columns={7} count={Math.max(0, 10 - grn.items.length)} />
                            </tbody>
                            {/* TOTALS */}
                            <tfoot className="border border-black">
                                <tr className="bg-zinc-100 font-semibold">
                                    <td colSpan={3} className="px-4 py-2 text-center border-r border-black">
                                        TOTAL
                                    </td>
                                    <td className="px-4 py-2 text-center  border-r border-black">
                                        {totalQty}
                                    </td>

                                    <td className="px-4 py-2 text-center  border-r border-black">
                                        {totalReceived}
                                    </td>
                                    <td className="px-4 py-2 text-center  border-r border-black">
                                        {totalReturned}
                                    </td>
                                    <td className="px-4 py-2 text-center  border-r border-black">
                                        {remaining}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
            </div>

            {/* PRINT */}
            <div className="mr-6 mt-4 flex justify-end">
                <PrintButton mode="portrait" />
            </div>
        </div>
    );
}
