"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, RotateCcw, RotateCw } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";
import PrintButton from "@/components/print/PrintButton";
import { useUser } from "@/app/context/UserContext";
import EmptyRows from "@/components/EmptyRows";

type ProductType = {
    id: string;
    name: string;
    sku?: string;
    category?: string;
    packSize?: number;
    price?: number;
    weightValue?: number;
    weightUnit?: string;
};

type SalesOrderItem = {
    id: string;
    quantity: number;
    quantityInvoiced: number;
    product: ProductType;
};

type SalesOrder = {
    id: string;
    orderNumber: string;
    status: string;
    createdAt: string;
    customer: {
        id: string;
        name: string;
        email?: string;
        phone?: string;
        tpinNumber?: string;
        city?: string;
        address?: string;
        assignedUser: string;
    };
    location?: {
        id: string;
        name?: string;
        address?: string;
    };
    createdBy?: {
        id: string;
        fullName?: string;
    };
    items: SalesOrderItem[];
};

const statusStyles: Record<string, string> = {
    PENDING: "text-black font-semibold bg-yellow-400 border-yellow-200",
    COMPLETED: "text-black font-semibold bg-green-400 border-green-200",
    CANCELLED: "text-black font-semibold bg-red-400 border-red-200",
};

export default function SalesOrderPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const [order, setOrder] = useState<SalesOrder | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [customerManager, setCustomerManager] = useState('');
    const users = useUser();


    useEffect(() => {
        async function fetchData() {
            try {
                // Fetch users
                const usersRes = await fetch('/api/options/users');
                if (!usersRes.ok) throw new Error("Failed to fetch users");
                const usersData = await usersRes.json();

                // Fetch order
                const orderRes = await fetch(`/api/sales-orders/orders/${id}`);
                if (!orderRes.ok) throw new Error("Failed to fetch sales order");
                const orderData = await orderRes.json();

                setOrder(orderData);
                const customerManagerId = usersData.find((user) => user.id === orderData.customer.assignedUser);
                if (customerManagerId) {
                    setCustomerManager(customerManagerId.fullName);
                }
            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id]);

    if (loading) return <div className="py-24 text-center text-sm text-zinc-500">Loading order…</div>;
    if (error) return <div className="py-24 text-center text-sm text-red-600">{error}</div>;
    if (!order) return null;

    const totals = order.items.reduce(
        (acc, item) => {
            const pendingQuantity = item.quantity - item.quantityInvoiced;
            acc.quantity += item.quantity;
            acc.pending += pendingQuantity;
            acc.tonnage += ((item.product.weightValue ?? 0) * item.quantity) / 1000;
            acc.productTotalValue += ((item.product.price ?? 0) * item.quantity);
            return acc;
        },
        { quantity: 0, pending: 0, tonnage: 0, productTotalValue: 0 }
    );

    // Check if any item has pending quantity
    const hasPending = order.items.some(item => item.quantity - item.quantityInvoiced > 0);

    return (
        <div>
            <div className="px-5">
                {/* Back */}
                <div className="mb-4">
                    <button
                        className="inline-flex items-center gap-2 text-sm cursor-pointer font-medium text-zinc-600 hover:text-zinc-900"
                        onClick={() => router.back()}
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to orders
                    </button>
                </div>

                {/* Header */}
                <div id="print-area" className=" print:border print:border-black bg-white">
                    <div className="space-y-2 px-5 py-2">
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-0 w-full print-grid-cols-3 mb-3">
                            <div className="overflow-x-auto p-1 w-full text-center space-y-2">
                                <p className="text-2xl text-blue-900 text-left font-bold">Biz360° Business Management</p>
                                <p className="text-md text-left font-bold">123 Business St., Lusaka, Zambia</p>
                                <p className="text-md text-left font-bold">support@biz360.com</p>
                                <p className="text-md text-left font-bold">+260 978 370 871</p>
                            </div>
                            <div className="hidden sm:flex justify-center items-center overflow-x-auto p-10 gap-5 w-full">
                                <RotateCw className="xl:h-20 xl:w-20 h-12 w-12 text-blue-900" />
                                <h1 className="text-2xl text-blue-900 font-bold">Biz360°</h1>
                            </div>
                            <div className="w-full justify-end items-center">
                                <h1 className="text-4xl font-bold text-blue-900 mb-6 text-right">
                                    Sales Order
                                </h1>
                                <div className="flex justify-end items-center">
                                    <span
                                        className={`inline-flex px-3 py-1 text-xs rounded-sm ${statusStyles[order.status] ?? "bg-zinc-100 text-zinc-700 border-zinc-300"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <hr className="border-t-1 border-black dark:border-gray-500 mb-3" />
                        <div className="grid grid-cols-1 xl:grid-cols-3 bg-white print-grid-cols-3 px-5 mb-5">
                            <div className="pr-4">
                                <p className="mt-1 text-sm text-zinc-700 font-semibold">
                                    Order No.: <span className="text-sm text-zinc-700">{order.orderNumber}</span>
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Sales Person: <span className="text-sm text-zinc-700">{customerManager}</span>
                                </p>
                                <p className="mt-1 text-sm text-zinc-500">
                                    Created By: <span className="text-sm text-zinc-700">{order.createdBy?.fullName}</span>
                                </p>
                            </div>

                            <div className="ml-4">
                                <p className="mt-1 text-sm text-zinc-700 font-semibold">{order.customer.name}</p>
                                <p className="mt-1 text-sm text-zinc-700">Address: {order.customer.address}</p>
                                <p className="mt-1 text-sm text-zinc-700">TPIN: {order.customer.tpinNumber}</p>
                                <p className="mt-1 text-sm text-zinc-700">{order.customer.email}</p>
                                <p className="mt-1 text-sm text-zinc-700">{order.customer.phone}</p>
                            </div>

                            <div className="ml-4">
                                <p className="mt-1 text-sm text-zinc-700 font-semibold">
                                    Date Created:
                                    <span className="ml-1">{new Date(order.createdAt).toLocaleDateString()}</span>
                                </p>
                                <p className="mt-1 text-sm text-zinc-700">
                                    Time:
                                    <span className="ml-1">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                </p>
                                <p className="mt-1 text-sm text-zinc-700">
                                    Delivery By:
                                    <span className="ml-1">
                                        {new Date(new Date(order.createdAt).getTime() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                                    </span>
                                </p>
                            </div>
                        </div>
                        <hr className="border-t-1 border-black dark:border-gray-500 mb-5" />
                        {/* Items Table */}
                        <div className="overflow-x-auto border shadow-sm">
                            <table className="w-full text-sm px-5">
                                <thead className="bg-zinc-100 border border-black">
                                    <tr className="border-b border-black">
                                        <th className="px-4 py-2 border-r border-black text-left">Product</th>
                                        <th className="px-4 py-2 border-r border-black text-center">SKU</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Pack Size</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Price</th>
                                        <th className="px-4 py-2 border-r border-black text-center">UoM</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Weight</th>
                                        <th className="px-4 py-2 border-r border-black text-center">Quantity</th>
                                        {hasPending && <th className="px-4 py-2 border-r border-black text-center">Pending Qty</th>}
                                        <th className="px-4 py-2 text-center border-r border-black">Tonnage (MT)</th>
                                        <th className="px-4 py-2 text-center">Total</th>
                                    </tr>
                                </thead>

                                <tbody className="border border-black">
                                    {order.items.map((item) => {
                                        const pendingQuantity = item.quantity - item.quantityInvoiced;
                                        return (
                                            <tr key={item.id} className="border-b border-zinc-200">
                                                <td className="px-4 py-2 border-r border-black">{item.product.name}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.product.sku ?? "-"}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.product.packSize ?? "-"}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">K{(item.product.price ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.product.weightUnit ?? "-"}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{(item.product.weightValue ?? 0).toFixed(2)}</td>
                                                <td className="px-4 py-2 border-r border-black text-center">{item.quantity}</td>
                                                {hasPending && <td className="px-4 py-2 border-r border-black text-center">{pendingQuantity}</td>}
                                                <td className="px-4 py-2 border-r border-black text-center">{((item.product.weightValue ?? 0) * item.quantity / 1000).toFixed(2)}</td>
                                                <td className="px-4 py-2 text-center">K{((item.product.price ?? 0) * item.quantity).toFixed(2)}</td>
                                            </tr>
                                        );
                                    })}
                                    <EmptyRows columns={hasPending ? 10 : 9} count={Math.max(0, 10 - order.items.length)} />
                                </tbody>

                                <tfoot className="border border-black">
                                    <tr className="bg-zinc-100 font-semibold border-b border-black">
                                        <td colSpan={6} className="px-4 py-2 text-center uppercase tracking-wider border-r border-black">Total</td>
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.quantity}</td>
                                        {hasPending && <td className="px-4 py-2 text-center border-r border-black">{totals.pending}</td>}
                                        <td className="px-4 py-2 text-center border-r border-black">{totals.tonnage.toFixed(2)}</td>
                                        <td className="px-4 py-2 text-center">K{totals.productTotalValue.toFixed(2)}</td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>

                        {/* Created By */}
                        <div className="flex justify-between mt-6 mb-10">
                            Authorised By: _____________________
                        </div>
                    </div>
                </div >
            </div>
            <div className="mr-6">
                <PrintButton mode="landscape" />
            </div>
        </div >
    );
}
