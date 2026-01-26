"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";
import { getBusinessInfo } from "@/lib/businessInfo";

type ProductType = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    price?: number;
    weightValue?: number;
    weightUnit?: string;
};

type DeliveryNoteItem = {
    id: string;
    quantityDelivered: number;
    product: ProductType;
};

type DeliveryNote = {
    id: string;
    deliveryNoteNo: string;
    sale?: {
        invoiceNumber: string;
        customer: {
            name: string;
            email?: string;
            phone?: string;
            tpinNumber?: string;
            address?: string;
        };
    };
    transporter?: { name?: string; vehicleNumber?: string; driverName?: string; driverPhoneNumber?: string };
    items: DeliveryNoteItem[];
    dispatchedAt: Date;
    location?: { name?: string; address?: string };
    createdBy: { fullName?: string }
};

export default function DeliveryNotePage() {
    const { id: saleId } = useParams<{ id: string }>();
    const router = useRouter();
    const [note, setNote] = useState<DeliveryNote | null>(null);
    const [loading, setLoading] = useState(true);
    const business = getBusinessInfo();


    useEffect(() => {
        if (!saleId) return;

        async function fetchDeliveryNote() {
            try {
                const res = await fetch(
                    `/api/view-docs-api/delivery-note?saleId=${saleId}`
                );
                if (!res.ok) throw new Error("Failed to fetch delivery note");
                const data = await res.json();
                setNote(data);
            } finally {
                setLoading(false);
            }
        }

        fetchDeliveryNote();
    }, [saleId]);

    if (loading) return <p className="py-20 text-center">Loading…</p>;
    if (!note) return null;

    // Totals
    const totals = note.items?.reduce(
        (acc, item) => {
            const price = item.product.price ?? 0;
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantityDelivered;
            acc.tonnage += (weight * item.quantityDelivered) / 1000;
            acc.subtotal += price * item.quantityDelivered;
            return acc;
        },
        { quantity: 0, tonnage: 0, subtotal: 0 }
    );

    return (
        <div>
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
                                <h1 className="text-4xl font-bold text-blue-900 mb-4">DELIVERY NOTE</h1>
                                <span className="inline-flex px-3 py-1 text-xs rounded-sm bg-blue-200 text-black font-semibold">
                                    {note.deliveryNoteNo}
                                </span>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-2 mt-2" />

                        {/* META */}
                        <div className="grid grid-cols-2 px-5 xl:grid-cols-3 mb-2 print-grid-cols-3">
                            <div>
                                <h1 className="font-semibold">Order Details</h1>
                                <p className="text-sm font-normal">
                                    Delivery Note No: <span className="text-sm">{note.deliveryNoteNo}</span>
                                </p>
                                <p className="text-sm">
                                    Invoice No: <span className="font-normal">{note.sale?.invoiceNumber}</span>
                                </p>
                                <p className="text-sm">Date Issued: {new Date(note.dispatchedAt).toLocaleDateString()}</p>
                                <p className="text-sm">Prepared By: {note.createdBy?.fullName}</p>
                                <p className="text-sm">
                                    Point of Sale: {note.location?.name}
                                </p>
                            </div>

                            <div>
                                <h1 className="font-semibold">Customer Details</h1>
                                <p className="text-sm">{note.sale?.customer.name}</p>
                                <p className="text-sm">{note.sale?.customer.address}</p>
                                <p className="text-sm">TPIN: {note.sale?.customer.tpinNumber}</p>
                                <p className="text-sm">{note.sale?.customer.email}</p>
                                <p className="text-sm">{note.sale?.customer.phone}</p>
                            </div>

                            <div>
                                <h1 className="font-semibold">Transporter Details</h1>
                                <p className="text-sm">
                                    {note.transporter?.name}
                                </p>
                                <p className="text-sm">
                                    {note.transporter?.vehicleNumber}
                                </p>
                                <p className="text-sm">
                                    Driver: {note.transporter?.driverName}
                                </p>
                                <p className="text-sm">
                                    Contact: {note.transporter?.driverPhoneNumber}
                                </p>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-5" />

                        {/* ITEMS TABLE */}
                        <div className="px-5 overflow-x-auto mb-5">
                            <table className="w-full text-sm border border-black">
                                <thead className="bg-zinc-100 border border-black">
                                    <tr>
                                        <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                        <th className="px-4 py-2 border-r border-black text-center">SKU</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Pack</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Tonnage (MT)</th>
                                        <th className="px-4 py-2 text-center">Total</th>
                                    </tr>
                                </thead>
                                <tbody className="border border-black">
                                    {note.items?.map((item) => (
                                        <tr key={item.id}>
                                            <td className="px-4 py-2 border-r border-black">{item.product.name}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.product.sku ?? "-"}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.product.packSize ?? "-"}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">
                                                {(item.product.weightValue ?? 0).toFixed(2)} {(item.product.weightUnit ?? "-")}
                                            </td>
                                            <td className="px-4 py-2 border-r border-black text-center">K{(item.product.price ?? 0).toFixed(2)}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">{item.quantityDelivered}</td>
                                            <td className="px-4 py-2 border-r border-black text-center">
                                                {(((item.product.weightValue ?? 0) * item.quantityDelivered) / 1000).toFixed(2)}
                                            </td>
                                            <td className="px-4 py-2 text-center">K{((item.product.price ?? 0) * item.quantityDelivered).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    <EmptyRows columns={8} count={Math.max(0, 10 - note.items?.length)} />
                                </tbody>
                                <tfoot className="border border-black">
                                    <tr className="bg-zinc-100 font-semibold">
                                        <td colSpan={5} className="px-4 py-2 text-center border-r border-black">TOTAL</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.quantity}</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.tonnage.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center">K{totals.subtotal.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                        <div className="items-center text-left mt-2 px-5">
                            <div className="items-center text-left mt-2 px-5 py-2 border border-black mb-0">
                                <h1 className="font-semibold px-1 py-1">Disclaimer</h1>
                                <ul className="list-disc pl-5 text-sm text-left">
                                    <li>Goods delivered are the responsibility of the recipient upon receipt.</li>
                                    <li>Please check the quantity, condition, and specifications of the items before signing.</li>
                                    <li>Any discrepancies, damages, or shortages must be reported immediately.</li>
                                    <li>This delivery note is not an invoice; payment terms and obligations are detailed in the associated invoice or sales agreement.</li>
                                </ul>
                            </div>
                        </div>
                        {/* FOOTER */}
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 items-stretch px-5 print-grid-cols-3">
                            <div className="border border-black px-5 py-1">
                                <h1 className="font-semibold mb-2">Dispatch</h1>
                                <p className="text-sm py-1">Dispatched By:_______________</p>
                                <p className="text-sm py-1">Time:_________________________</p>
                                <p className="text-sm py-1">Signature:____________________</p>
                            </div>
                            <div className="border border-black px-5 py-1">
                                <h1 className="font-semibold mb-2">Authorization</h1>
                                <p className="text-sm py-1">Authorized By:______________</p>
                                <p className="text-sm py-1">Time:________________________</p>
                                <p className="text-sm py-1">Signature:___________________</p>
                            </div>
                            <div className="border border-black px-5 py-2">
                                <h1 className="font-semibold">Transporter</h1>
                                <p className="text-sm py-1">Driver:_______________________</p>
                                <p className="text-sm py-1">Time:________________________</p>
                                <p className="text-sm py-1">Signature:___________________</p>
                            </div>
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
