"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCw } from "lucide-react";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";
import { getBusinessInfo } from "@/lib/businessInfo";
import { useUser } from "@/app/context/UserContext";

type ProductType = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    price?: number;
    weightValue?: number;
    weightUnit?: string;
};

type SaleReturnItem = {
    id: string;
    quantity: number;
    product: ProductType;
    reason: string;
};

type CreditNote = {
    id: string;
    creditNoteNumber: string;
    createdAt: string;
    amount: number;
    reason: string;
    saleInvoiceNumber: string;
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
    createdBy: string;
    saleReturn: {
        id: string;
        returnNumber: string;
        items: SaleReturnItem[];
    } | null;
};

export default function CreditNotePage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const user = useUser();
    const [creditNote, setCreditNote] = useState<CreditNote | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const business = getBusinessInfo();

    useEffect(() => {
        async function fetchCreditNote() {
            try {
                const res = await fetch(`/api/credit-notes/${id}`);
                if (!res.ok) throw new Error("Failed to fetch credit note");
                const data: CreditNote = await res.json();
                setCreditNote(data);
                console.log(data)
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchCreditNote();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading credit note…</div>;
    if (error) return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
    if (!creditNote) return null;

    const items = creditNote.saleReturn?.items || [];

    const totals = creditNote.saleReturn?.items?.reduce(
        (acc, item) => {
            const price = item.product.price ?? 0;
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantity;
            acc.tonnage += (weight * item.quantity) / 1000;
            acc.subtotal += price * item.quantity;
            return acc;
        },
        { quantity: 0, tonnage: 0, subtotal: 0 }
    ) ?? { quantity: 0, tonnage: 0, subtotal: 0 };

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
                                <h1 className="text-4xl font-bold text-blue-900 mb-4">CREDIT NOTE</h1>
                            </div>
                        </div>

                        <hr className="border-t border-black mb-2 mt-2" />

                        {/* META */}
                        <div className="grid grid-cols-2 px-5 xl:grid-cols-3 mb-5 print-grid-cols-3">
                            <div>
                                <h1 className="font-semibold">Credit Note Details</h1>
                                <p className="text-sm">Credit Note No: {creditNote.creditNoteNumber}</p>
                                <p className="text-sm">Invoice No: {creditNote.saleInvoiceNumber}</p>
                                <p className="text-sm">Date Issued: {new Date(creditNote.createdAt).toLocaleDateString()}</p>
                                <p className="text-sm">Prepared By: {user?.fullName}</p>
                                <p className="text-sm">Point of Sale : {creditNote.location?.name ?? "-"}</p>
                            </div>

                            <div>
                                <h1 className="font-semibold">Customer Details</h1>
                                <p className="text-sm">{creditNote.customer.name}</p>
                                <p className="text-sm">{creditNote.customer.address}</p>
                                <p className="text-sm">TPIN: {creditNote.customer.tpinNumber}</p>
                                <p className="text-sm">{creditNote.customer.email}</p>
                                <p className="text-sm">{creditNote.customer.phone}</p>
                            </div>

                            <div>
                                <p className="font-semibold">Totals</p>
                                <p className="text-sm">Total Items: {totals.quantity}</p>
                                <p className="text-sm">Tonnage: {totals.tonnage.toFixed(2)}</p>
                                <p className="text-sm">Amount: K{creditNote.amount.toFixed(2)}</p>
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
                                        <th className="px-4 py-2 border-r border-black text-center">Reason</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Tonnage</th>
                                        <th className="px-4 py-2 border-r border-black text-center text-center">Total</th>

                                    </tr>
                                </thead>
                                {creditNote.saleReturn ? (
                                    <tbody className="border border-black">
                                        {creditNote.saleReturn.items?.map((item) => (
                                            <tr key={item.id}>
                                                <td className="px-4 py-2 border-r border-black">{item.product.name}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.product.sku ?? "-"}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.product.packSize ?? "-"}</td>
                                                <td className="px-4 py-2 border-r border-black text-left">{item.reason}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">K{(item.product.price ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.quantity}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{(((item.product.weightValue ?? 0) * item.quantity) / 1000).toFixed(2)}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">K{((item.product.price ?? 0) * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        ))}
                                        <EmptyRows columns={8} count={Math.max(0, 10 - (creditNote.saleReturn?.items?.length ?? 0))} />
                                    </tbody>
                                ) : (
                                    <tbody className="border border-black">
                                        <tr>
                                            <td colSpan={8} className="px-4 py-4 text-center text-sm text-zinc-500">
                                                No returned items for this credit note.
                                            </td>
                                        </tr>
                                    </tbody>
                                )}
                                <tfoot className="border border-black">
                                    <tr className="bg-zinc-100 font-semibold">
                                        <td colSpan={5} className="px-4 py-2 text-center border-r border-black">TOTAL</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.quantity}</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.tonnage.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center border-r border-black">K{creditNote.amount.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* FOOTER */}
                        <div className="grid grid-cols-1 px-5 mt-8 mb-10">
                            <p>Approved By: _____________________</p>
                            <p>Date: ____________________________</p>
                            <p>Signature: _______________________</p>
                        </div>
                    </div>
                </div>

                {/* PRINT BUTTON */}
                <div className="mr-6 mt-4 flex justify-end">
                    <PrintButton mode="landscape" />
                </div>
            </div>
        </div>
    );
}
