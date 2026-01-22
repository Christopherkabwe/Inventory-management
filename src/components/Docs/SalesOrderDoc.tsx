"use client";

import React from "react";

// TYPES
type ProductType = {
    id: string;
    name: string;
    sku?: string;
    packSize?: number;
    weightValue?: number;
    weightUnit?: string;
};

type SalesOrderItemType = {
    id: string;
    product: ProductType;
    quantity: number;
};

type CustomerType = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
};

type LocationType = {
    id: string;
    name: string;
    address?: string;
};

type SalesOrderDocumentProps = {
    data: any; // SalesOrder object from API
};

export default function SalesOrderDocumentPage({ data }: SalesOrderDocumentProps) {
    if (!data) return <div>No Sales Order data provided.</div>;

    // Normalize items safely
    const items: SalesOrderItemType[] = Array.isArray(data.items) ? data.items : [];

    const getSubtotal = (items: SalesOrderItemType[]) => {
        return items.reduce(
            (acc, i) => {
                acc.qty += i?.quantity ?? 0;
                return acc;
            },
            { qty: 0 }
        );
    };

    const subtotal = getSubtotal(items);

    const formatDateTime = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toLocaleString() : "-";

    // Safely get customer & location
    const customer: CustomerType = data.customer ?? { name: "-" };
    const location: LocationType = data.location ?? { name: "-", address: "-" };

    return (
        <div className="p-6 max-w-4xl mx-auto border border-gray-300 rounded shadow-sm bg-white">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-bold">SALES ORDER</h1>
                    <p><strong>Order #: </strong>{data.orderNumber ?? "-"}</p>
                    <p><strong>Date: </strong>{formatDateTime(data.createdAt)}</p>
                    <p><strong>Status: </strong>{data.status ?? "-"}</p>
                </div>
                <div className="text-right">
                    <p><strong>Customer: </strong>{customer.name}</p>
                    {customer.email && <p>Email: {customer.email}</p>}
                    {customer.phone && <p>Phone: {customer.phone}</p>}
                    <p><strong>Location: </strong>{location.name}</p>
                    {location.address && <p>{location.address}</p>}
                </div>
            </div>

            {/* Items Table */}
            <table className="w-full border border-gray-300 mb-4">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-2 py-1 text-left">SKU</th>
                        <th className="border px-2 py-1 text-left">Product</th>
                        <th className="border px-2 py-1 text-right">Qty</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((i) => (
                        <tr key={i.id} className="border-t">
                            <td className="px-2 py-1">{i.product?.sku ?? "-"}</td>
                            <td className="px-2 py-1">{i.product?.name ?? "-"}</td>
                            <td className="px-2 py-1 text-right">{i.quantity ?? 0}</td>
                        </tr>
                    ))}
                    <tr className="font-semibold bg-gray-100">
                        <td colSpan={2} className="px-2 py-1 text-right">Total Quantity</td>
                        <td className="px-2 py-1 text-right">{subtotal.qty}</td>
                    </tr>
                </tbody>
            </table>

            {/* Footer */}
            <div className="flex justify-between mt-8">
                <div>
                    <p>Prepared By: {data.createdBy?.fullName || data.createdBy || "-"}</p>
                </div>
                <div>
                    <p>Authorised By: _____________________</p>
                </div>
            </div>
        </div>
    );
}
