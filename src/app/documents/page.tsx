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

type DocumentItem = {
    id: string;
    product: ProductType;
    quantity: number;
    quantityDelivered?: number;
    quantityReturned?: number;
    price?: number;
    total?: number;
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

type DocumentPageProps = {
    data: any; // document object from API
    documentType: string; // "Invoice", "Order", "DeliveryNote", etc.
};

export default function DocumentPage({ data, documentType }: DocumentPageProps) {
    if (!data) return <div>No document data provided.</div>;

    // Normalize items
    const items: DocumentItem[] = data.items ?? data.sale?.items ?? [];

    const getSubtotal = (items: DocumentItem[]) => {
        return items.reduce(
            (acc, i) => {
                acc.qty += i.quantity ?? 0;
                acc.delivered += i.quantityDelivered ?? 0;
                acc.returned += i.quantityReturned ?? 0;
                acc.total += i.total ?? 0;
                return acc;
            },
            { qty: 0, delivered: 0, returned: 0, total: 0 }
        );
    };

    const subtotal = getSubtotal(items);

    const formatDateTime = (dateStr?: string) =>
        dateStr ? new Date(dateStr).toLocaleString() : "-";

    // Safely get customer & location
    const customer = data.customer ?? data.sale?.customer ?? { name: "-" };
    const location = data.location ?? data.sale?.location ?? { name: "-", address: "-" };

    const renderHeader = () => (
        <div className="flex justify-between items-start mb-4">
            <div>
                <h1 className="text-xl font-bold">{documentType.toUpperCase()}</h1>
                <p>
                    <strong>Document #: </strong>
                    {data.invoiceNumber ?? data.orderNumber ?? data.proformaNumber ?? data.deliveryNoteNo ?? data.quoteNumber ?? data.returnNumber ?? data.creditNoteNumber ?? "-"}
                </p>
                <p>
                    <strong>Date: </strong>
                    {formatDateTime(data.saleDate ?? data.createdAt ?? data.transferDate)}
                </p>
            </div>
            <div className="text-right">
                <p><strong>Customer: </strong>{customer.name ?? "-"}</p>
                {customer.email && <p>Email: {customer.email}</p>}
                {customer.phone && <p>Phone: {customer.phone}</p>}
                <p><strong>Location: </strong>{location.name ?? "-"}</p>
                {location.address && <p>{location.address}</p>}
            </div>
        </div>
    );

    const renderItemsTable = () => (
        <table className="w-full border border-gray-300 mb-4">
            <thead className="bg-gray-100">
                <tr>
                    <th className="border px-2 py-1 text-left">SKU</th>
                    <th className="border px-2 py-1 text-left">Product</th>
                    <th className="border px-2 py-1 text-right">Qty</th>
                    {(documentType.toLowerCase() === "invoice" || documentType.toLowerCase() === "deliverynote") && (
                        <th className="border px-2 py-1 text-right">Delivered</th>
                    )}
                    {documentType.toLowerCase() === "return" && (
                        <th className="border px-2 py-1 text-right">Returned</th>
                    )}
                    <th className="border px-2 py-1 text-right">Price</th>
                    <th className="border px-2 py-1 text-right">Total</th>
                </tr>
            </thead>
            <tbody>
                {items.map((i) => (
                    i.product && (
                        <tr key={i.id} className="border-t">
                            <td className="px-2 py-1">{i.product.sku ?? "-"}</td>
                            <td className="px-2 py-1">{i.product.name ?? "-"}</td>
                            <td className="px-2 py-1 text-right">{i.quantity ?? 0}</td>
                            {(documentType.toLowerCase() === "invoice" || documentType.toLowerCase() === "deliverynote") && (
                                <td className="px-2 py-1 text-right">{i.quantityDelivered ?? 0}</td>
                            )}
                            {documentType.toLowerCase() === "return" && (
                                <td className="px-2 py-1 text-right">{i.quantityReturned ?? 0}</td>
                            )}
                            <td className="px-2 py-1 text-right">{(i.price ?? 0)}</td>
                            <td className="px-2 py-1 text-right">{(i.total ?? 0)}</td>
                        </tr>
                    )
                ))}
                <tr className="font-semibold bg-gray-100">
                    <td colSpan={2} className="px-2 py-1 text-right">Subtotal</td>
                    <td className="px-2 py-1 text-right">{subtotal.qty}</td>
                    {(documentType.toLowerCase() === "invoice" || documentType.toLowerCase() === "deliverynote") && (
                        <td className="px-2 py-1 text-right">{subtotal.delivered}</td>
                    )}
                    {documentType.toLowerCase() === "return" && (
                        <td className="px-2 py-1 text-right">{subtotal.returned}</td>
                    )}
                    <td></td>
                    <td className="px-2 py-1 text-right">{subtotal.total}</td>
                </tr>
            </tbody>
        </table>
    );

    const renderFooter = () => (
        <div className="flex justify-between mt-8">
            <div>
                <p>Prepared By: {data.createdBy?.fullName || data.createdBy || "-"}</p>
            </div>
            <div>
                <p>Authorised By: _____________________</p>
            </div>
        </div>
    );

    return (
        <div className="p-6 max-w-4xl mx-auto border border-gray-300 rounded shadow-sm bg-white">
            {renderHeader()}
            {renderItemsTable()}
            {renderFooter()}
        </div>
    );
}
