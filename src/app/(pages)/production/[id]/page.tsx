"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, RotateCw } from "lucide-react";
import PrintButton from "@/components/print/PrintButton";
import EmptyRows from "@/components/EmptyRows";
import { getBusinessInfo } from "@/lib/businessInfo";
import { useUser } from "@/app/context/UserContext";

/* =======================
   TYPES
======================= */
type Product = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    weightValue?: number;
    weightUnit?: string;
};

type ProductionItem = {
    quantity: number;
    product: Product;
};

type Production = {
    id: string;
    productionNo: string;
    batchNumber: string;
    notes?: string;
    createdAt: string;
    createdBy: {
        fullName: string;
    };
    location: {
        name: string;
    };
    items: ProductionItem[];
};

/* =======================
   COMPONENT
======================= */
export default function ProductionViewPage() {
    const { id } = useParams<{ id: string }>();
    const user = useUser();
    const business = getBusinessInfo();

    const [production, setProduction] = useState<Production | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchProduction() {
            try {
                const res = await fetch(`/api/rbac/productions/${id}`);
                if (!res.ok) throw new Error("Failed to fetch production");
                const data = await res.json();
                setProduction(data);
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchProduction();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading production…</div>;
    if (error) return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
    if (!production) return null;

    /* =======================
       TOTALS
    ======================= */
    const totals = production.items.reduce(
        (acc, item) => {
            const weight = item.product.weightValue ?? 0;
            acc.quantity += item.quantity;
            acc.tonnage += (weight * item.quantity) / 1000;
            return acc;
        },
        { quantity: 0, tonnage: 0 }
    );

    /* =======================
       RENDER
    ======================= */
    return (
        <div className="px-2">
            {/* Back */}
            <div className="mb-4">
                <Link
                    href="/production"
                    className="inline-flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900"
                >
                    <ArrowLeft className="h-4 w-4" /> Back
                </Link>
            </div>

            {/* PRINT AREA */}
            <div id="print-area" className="bg-white print:border print:border-black">
                <div className="space-y-1 py-4">
                    {/* HEADER */}
                    <div className="grid grid-cols-2 xl:grid-cols-3 px-5">
                        <div className="space-y-1">
                            <p className="text-2xl font-bold text-blue-900">{business.name}</p>
                            <p className="text-sm">TPIN: {business.TPIN}</p>
                            <p className="text-sm">{business.address}</p>
                            <p className="text-sm">{business.email}</p>
                            <p className="text-sm">{business.contact}</p>
                        </div>

                        <div className="hidden xl:flex justify-center items-center">
                            <RotateCw className="h-16 w-16 text-black" />
                        </div>

                        <div className="text-right">
                            <h1 className="text-4xl font-bold text-blue-900 mb-2">
                                PRODUCTION
                            </h1>
                        </div>
                    </div>

                    <hr className="border-t border-black my-3" />

                    {/* META */}
                    <div className="grid grid-cols-2 xl:grid-cols-3 px-5 mb-5">
                        <div>
                            <h1 className="font-semibold">Production Details</h1>
                            <p className="text-sm">
                                Production No: <span>{production.productionNo}</span>
                            </p>
                            <p className="text-sm">
                                Batch Number: <span>{production.batchNumber}</span>
                            </p>
                            <p className="text-sm">
                                Date: {new Date(production.createdAt).toLocaleDateString()}
                            </p>
                            <p className="text-sm">
                                Prepared By: {production.createdBy?.fullName ?? user?.fullName}
                            </p>
                        </div>

                        <div>
                            <h1 className="font-semibold">Location</h1>
                            <p className="text-sm">{production.location.name}</p>
                        </div>

                        <div>
                            <h1 className="font-semibold">Notes</h1>
                            <p className="text-sm">{production.notes || "-"}</p>
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
                                    <th className="px-4 py-2 border-r border-black text-center">Pack Size</th>
                                    <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                    <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                    <th className="px-4 py-2 text-center">Tonnage</th>
                                </tr>
                            </thead>
                            <tbody className="border border-black">
                                {production.items.map((item, idx) => (
                                    <tr key={idx}>
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
                                            {item.product.weightValue ?? "-"}{" "}
                                            {item.product.weightUnit ?? ""}
                                        </td>
                                        <td className="px-4 py-2 border-r border-black text-center">
                                            {item.quantity}
                                        </td>
                                        <td className="px-4 py-2 text-center">
                                            {(((item.product.weightValue ?? 0) * item.quantity) / 1000).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                                <EmptyRows columns={6} count={Math.max(0, 10 - production.items.length)} />
                            </tbody>
                            <tfoot className="border border-black">
                                <tr className="bg-zinc-100 font-semibold">
                                    <td colSpan={4} className="px-4 py-2 border-r border-black text-center">
                                        TOTAL
                                    </td>
                                    <td className="px-4 py-2 border-r border-black text-center">
                                        {totals.quantity}
                                    </td>
                                    <td className="px-4 py-2 text-center">
                                        {totals.tonnage.toFixed(2)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                    {/* FOOTER */}
                    <div className="px-5 mt-8 mb-10">
                        <p>Supervisor: _____________________</p>
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
    );
}
