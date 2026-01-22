"use client";

import { Fragment, useState, useEffect } from "react";
import DeliveryNoteModal from "@/components/sales-flow/DeliveryNoteModal";
import ReturnsCreditModal from "@/components/sales-flow/ReturnsCreditModal";
import ProformaInvoiceModal from "@/components/sales-flow/ProformaInvoiceModal"; // New Pro-forma modal

// TYPES
type ProductType = {
    id: string;
    name: string;
    sku: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
};

type SaleItemType = {
    id: string;
    product: ProductType;
    quantity: number;
    quantityDelivered: number;
};

type CustomerType = {
    id: string;
    name: string;
    email?: string;
    phone?: string;
};

type SaleType = {
    id: string;
    invoiceNumber: string;
    status: string;
    customer: CustomerType;
    location: { id: string; name: string };
    items: SaleItemType[];
    saleDate: string;
};

// UTILS
const formatDateTime = (dateStr: string) =>
    new Date(dateStr).toLocaleString();

const getItemTonnage = (item: SaleItemType) =>
    (item.quantity * item.product.weightValue * item.product.packSize) / 1000; // Example: kg → tons

const getSubtotal = (items: SaleItemType[]) => {
    return items.reduce(
        (acc, i) => {
            acc.qty += i.quantity;
            acc.delivered += i.quantityDelivered;
            acc.tonnage += getItemTonnage(i);
            return acc;
        },
        { qty: 0, delivered: 0, tonnage: 0 }
    );
};

// COMPONENT
export default function SalesPage() {
    const [sales, setSales] = useState<SaleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSale, setSelectedSale] = useState<SaleType | null>(null);
    const [modalType, setModalType] = useState<"DELIVERY" | "RETURN" | null>(null);
    const [selectedProforma, setSelectedProforma] = useState<{ id: string; orderNumber: string } | null>(null);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    // FETCH SALES
    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rbac/sales-flow/invoices");
            const data = await res.json();
            if (data && Array.isArray(data.sales)) {
                setSales(data.sales);
            } else {
                setSales([]);
                console.warn("API returned unexpected data:", data);
            }
        } catch (err) {
            console.error(err);
            setSales([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSales();
    }, []);

    // MODAL HANDLERS
    const toggle = (id: string) => setOpen(prev => ({ ...prev, [id]: !prev[id] }));

    const openDeliveryModal = (sale: SaleType) => {
        setSelectedSale(sale);
        setModalType("DELIVERY");
    };

    const openReturnModal = (sale: SaleType) => {
        setSelectedSale(sale);
        setModalType("RETURN");
    };

    const openProformaModal = (sale: SaleType) => {
        setSelectedProforma({ id: sale.id, orderNumber: sale.invoiceNumber });
    };

    const closeModal = () => {
        setSelectedSale(null);
        setModalType(null);
        setSelectedProforma(null);
    };

    return (
        <div className="p-6 space-y-6">
            <h1 className="text-2xl font-bold mb-4">Sales / Invoices</h1>

            {loading ? (
                <div>Loading sales...</div>
            ) : sales.length === 0 ? (
                <div>No sales found.</div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 border">Invoice #</th>
                                <th className="p-2 border">Status</th>
                                <th className="p-2 border">Customer</th>
                                <th className="p-2 border">Location</th>
                                <th className="p-2 border">Date</th>
                                <th className="p-2 border">Qty</th>
                                <th className="p-2 border">Delivered</th>
                                <th className="p-2 border">Tonnage</th>
                                <th className="p-2 border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((s) => {
                                const subtotal = getSubtotal(s.items);
                                const isOpen = open[s.id];

                                return (
                                    <Fragment key={s.id}>
                                        {/* SUMMARY ROW */}
                                        <tr className={`border-t cursor-pointer ${isOpen ? "sticky top-8 z-20 bg-white shadow-sm" : "bg-white"}`}>
                                            <td className="px-4 py-2 font-mono">
                                                <button onClick={() => toggle(s.id)} className="inline-flex items-center gap-2 hover:underline cursor-pointer">
                                                    {isOpen ? <span>&#9660;</span> : <span>&#9658;</span>} {s.invoiceNumber}
                                                </button>
                                            </td>
                                            <td className="px-4 py-2">{s.status}</td>
                                            <td className="px-4 py-2">{s.customer.name}</td>
                                            <td className="px-4 py-2">{s.location.name}</td>
                                            <td className="px-4 py-2">{formatDateTime(s.saleDate)}</td>
                                            <td className="px-4 py-2 tabular-nums">{subtotal.qty}</td>
                                            <td className="px-4 py-2 tabular-nums">{subtotal.delivered}</td>
                                            <td className="px-4 py-2 tabular-nums">{subtotal.tonnage.toFixed(2)} MT</td>
                                            <td className="px-4 py-2 flex gap-2">
                                                {s.status !== "CANCELLED" && (
                                                    <>
                                                        <button
                                                            className="px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                            onClick={() => openDeliveryModal(s)}
                                                        >
                                                            Delivery
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                                            onClick={() => openReturnModal(s)}
                                                        >
                                                            Return
                                                        </button>
                                                        <button
                                                            className="px-2 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600"
                                                            onClick={() => openProformaModal(s)}
                                                        >
                                                            Pro-forma
                                                        </button>
                                                    </>
                                                )}
                                            </td>
                                        </tr>

                                        {/* ITEM ROWS */}
                                        {isOpen && (
                                            <>
                                                <tr className="bg-zinc-200 text-xs text-zinc-700">
                                                    <th className="px-4 py-2 text-left">SKU</th>
                                                    <th className="px-4 py-2 text-left">Product</th>
                                                    <th className="px-4 py-2 text-left">Pack Size</th>
                                                    <th className="px-4 py-2 text-left">Weight</th>
                                                    <th className="px-4 py-2 text-left">Quantity</th>
                                                    <th className="px-4 py-2 text-left">Delivered</th>
                                                    <th className="px-4 py-2 text-left">Tonnage</th>
                                                    <th colSpan={2}></th>
                                                </tr>

                                                {s.items.map((item) => (
                                                    <tr key={`${s.id}-${item.id}`} className="border-t bg-zinc-50">
                                                        <td className="px-4 py-2">{item.product.name}</td>
                                                        <td className="px-4 py-2">{item.product.sku}</td>
                                                        <td className="px-4 py-2">{item.product.packSize}</td>
                                                        <td className="px-4 py-2">{item.product.weightValue.toFixed(2)} {item.product.weightUnit}</td>
                                                        <td className="px-4 py-2 tabular-nums">{item.quantity}</td>
                                                        <td className="px-4 py-2 tabular-nums">{item.quantityDelivered}</td>
                                                        <td className="px-4 py-2 tabular-nums">{getItemTonnage(item).toFixed(2)} MT</td>
                                                        <td colSpan={2}></td>
                                                    </tr>
                                                ))}

                                                {/* SUBTOTAL ROW */}
                                                <tr className="border-t bg-zinc-100 font-semibold">
                                                    <td colSpan={4} className="px-4 py-2 text-right text-zinc-700">Total</td>
                                                    <td className="px-4 py-2 tabular-nums">{subtotal.qty}</td>
                                                    <td className="px-4 py-2 tabular-nums">{subtotal.delivered}</td>
                                                    <td className="px-4 py-2 tabular-nums">{subtotal.tonnage.toFixed(2)} MT</td>
                                                    <td colSpan={2}></td>
                                                </tr>
                                            </>
                                        )}
                                    </Fragment>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* MODALS */}
            {selectedSale && modalType === "DELIVERY" && (
                <DeliveryNoteModal
                    saleId={selectedSale.id}
                    saleNumber={selectedSale.invoiceNumber}
                    items={selectedSale.items}
                    onClose={closeModal}
                    onDeliveryCreated={fetchSales}
                />
            )}

            {selectedSale && modalType === "RETURN" && (
                <ReturnsCreditModal
                    saleId={selectedSale.id}
                    saleNumber={selectedSale.invoiceNumber}
                    items={selectedSale.items}
                    onClose={closeModal}
                    onReturnCreated={fetchSales}
                />
            )}

            {selectedProforma && (
                <ProformaInvoiceModal
                    salesOrderId={selectedProforma.id}
                    orderNumber={selectedProforma.orderNumber}
                    onClose={closeModal}
                    onCreated={fetchSales}
                />
            )}
        </div>
    );
}
