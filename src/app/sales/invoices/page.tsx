"use client";

import { Fragment, useState, useEffect } from "react";
import DeliveryNoteModal from "@/components/sales-flow/DeliveryNoteModal";
import ReturnsCreditModal from "@/components/sales-flow/ReturnsCreditModal";
import ProformaInvoiceModal from "@/components/sales-flow/ProformaInvoiceModal"; // New Pro-forma modal
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination/pagination";
import buildSalesSummaryExport from "@/components/helper-functions/sales/buildSalesSummaryExport";
import { buildSalesItemExport } from "@/components/helper-functions/sales/buildSalesItemExport";
import { ExportHeader } from "@/lib/ExportUtils";
import { ExportButton } from "@/components/Exports/ExportButton";
import Loading from "@/components/Loading";

// TYPES
type ProductType = {
    id: string;
    name: string;
    sku: string;
    price: number;
    packSize: number;
    weightValue: number;
    weightUnit: string;
};

type SaleItemType = {
    id: string;
    product: ProductType;
    quantity: number;
    price: number;
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
    new Date(dateStr).toLocaleDateString();

const getItemTonnage = (item: SaleItemType) =>
    (item.quantity * item.product.weightValue * item.product.packSize) / 1000; // Example: kg → tons

const getSubtotal = (items: SaleItemType[]) => {
    if (!items) return { qty: 0, delivered: 0, tonnage: 0, salesValue: 0, invoiceValue: 0 };
    return items.reduce(
        (acc, i) => {
            acc.qty += i.quantity;
            acc.delivered += i.quantityDelivered;
            acc.tonnage += getItemTonnage(i);
            acc.salesValue += i.quantity * i.price;
            acc.invoiceValue += i.quantityDelivered * i.price;
            return acc;
        },
        { qty: 0, delivered: 0, tonnage: 0, salesValue: 0, invoiceValue: 0 }
    );
};

const formatMoney = (v: number) => {
    const parts = new Intl.NumberFormat("en-GB", {
        style: "currency",
        currency: "ZMW",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        useGrouping: true,
    }).formatToParts(v);

    return parts
        .map(p => (p.type === "group" ? " " : p.value))
        .join("");
};

// COMPONENT
export default function SalesPage() {
    const [sales, setSales] = useState<SaleType[]>([]);
    const [loading, setLoading] = useState(false);
    const [selectedSale, setSelectedSale] = useState<SaleType | null>(null);
    const [modalType, setModalType] = useState<"DELIVERY" | "RETURN" | null>(null);
    const [selectedProforma, setSelectedProforma] = useState<{ id: string; orderNumber: string } | null>(null);
    const [open, setOpen] = useState<Record<string, boolean>>({});

    const router = useRouter();

    // FETCH SALES
    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rbac/sales-flow/invoices");
            const data = await res.json();
            if (data && Array.isArray(data.data)) {
                setSales(data.data);
            } else if (Array.isArray(data)) {
                setSales(data);
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

    // Pagination

    const ITEMS_PER_PAGE = 15;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(sales.length / ITEMS_PER_PAGE);

    const paginatedSales = sales?.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );
    useEffect(() => {
        setCurrentPage(1);
    }, [sales.length]);

    const summaryExportData = buildSalesSummaryExport(sales);
    const itemExportData = buildSalesItemExport(sales);

    const summaryHeaders: ExportHeader<any>[] = [
        { key: "invoiceNumber", label: "Invoice #" },
        { key: "status", label: "Status" },
        { key: "customer", label: "Customer" },
        { key: "location", label: "Location" },
        { key: "quantity", label: "Order Qty" },
        { key: "delivered", label: "Delivered Qty" },
        { key: "tonnage", label: "Tonnage (MT)" },
        { key: "salesValue", label: "Sales Value" },
        { key: "invoiceValue", label: "Invoiced Value" },
        { key: "saleDate", label: "Sale Date" },
    ];

    const itemHeaders: ExportHeader<any>[] = [
        { key: "invoiceNumber", label: "Invoice #" },
        { key: "status", label: "Status" },
        { key: "customer", label: "Customer" },
        { key: "sku", label: "SKU" },
        { key: "product", label: "Product" },
        { key: "packSize", label: "Pack Size" },
        { key: "weight", label: "Weight" },
        { key: "quantity", label: "Order Qty" },
        { key: "delivered", label: "Delivered Qty" },
        { key: "tonnage", label: "Tonnage (MT)" },
        { key: "price", label: "Price" },
        { key: "value", label: "Value" },
        { key: "saleDate", label: "Sale Date" },
    ];

    return (
        <DashboardLayout>
            <div>
                <h1 className="text-3xl px-5 font-bold mb-1">Sales Invoices</h1>
                <p className="text-gray-500 px-5 mb-3">Record of all sales & invoices</p>
            </div>
            <div className="bg-white p-5 overflow-auto rounded-lg border">
                <div className="flex mb-5 justify-end">

                    <div className="flex flex-col-1 justify-end gap-2 xl:gap-5">
                        <ExportButton
                            type="csv"
                            headers={summaryHeaders}
                            data={summaryExportData}
                            filename="Sales-Invoice-Summary.csv"
                            label="Export Summary CSV"
                        />

                        <ExportButton
                            type="pdf"
                            headers={summaryHeaders}
                            data={summaryExportData}
                            filename="Sales-Invoice-Summary.pdf"
                            label="Export Summary PDF"
                        />

                        <ExportButton
                            type="csv"
                            headers={itemHeaders}
                            data={itemExportData}
                            filename="Sales-Invoice-Items.csv"
                            label="Export Items CSV"
                        />

                        <ExportButton
                            type="pdf"
                            headers={itemHeaders}
                            data={itemExportData}
                            filename="Sales-Invoice-Items.pdf"
                            mode="landscape"
                            label="Export Items PDF"
                        />
                    </div>
                </div>
                <div>
                    <table className="w-full max-h-[70vh] text-sm border-collapse">
                        <thead className="bg-zinc-100 sticky top-0 z-30">
                            <tr>
                                <th className="p-2 border text-sm">Invoice #</th>
                                <th className="p-2 border text-sm">Status</th>
                                <th className="p-2 border text-sm">Customer</th>
                                <th className="p-2 border text-sm">Location</th>
                                <th className="p-2 border text-sm">Date</th>
                                <th className="p-2 border text-sm">Ordet Qty</th>
                                <th className="p-2 border text-sm">Qty Delivered</th>
                                <th className="p-2 border text-sm">Tonnage</th>
                                <th className="p-2 border text-sm">Sales Value</th>
                                <th className="p-2 border text-sm">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <Loading
                                    colSpan={10}
                                    message="Loading Sales.."
                                />
                            ) : paginatedSales.length === 0 ? (
                                <tr>
                                    <td colSpan={10} className="text-center py-4">
                                        No sales found.
                                    </td>
                                </tr>
                            ) : (
                                paginatedSales.map((s) => {
                                    const subtotal = getSubtotal(s.items);
                                    const isOpen = open[s.id];

                                    return (
                                        <Fragment key={s.id}>
                                            {/* SUMMARY ROW */}
                                            <tr className={`border-t cursor-pointer ${isOpen ? "sticky top-8 z-20 bg-white shadow-sm" : "bg-white"}`}>
                                                <td className="px-2 py-1 text-sm font-mono border border-zinc-300">
                                                    <button onClick={() => toggle(s.id)} className="inline-flex items-center gap-2 hover:underline cursor-pointer">
                                                        {isOpen ? <span>&#9660;</span> : <span>&#9658;</span>} {s.invoiceNumber}
                                                    </button>
                                                </td>
                                                <td className="px-2 py-1 text-xs border border-zinc-300">{s.status}</td>
                                                <td className="px-2 py-1 text-xs border border-zinc-300">{s.customer.name}</td>
                                                <td className="px-2 py-1 text-xs border border-zinc-300">{s.location.name}</td>
                                                <td className="px-2 py-1 text-xs border border-zinc-300">{formatDateTime(s.saleDate)}</td>
                                                <td className="px-2 py-1 text-xs tabular-nums border border-zinc-300">{subtotal.qty}</td>
                                                <td className="px-2 py-1 text-xs tabular-nums border border-zinc-300">{subtotal.delivered}</td>
                                                <td className="px-2 py-1 text-xs tabular-nums border border-zinc-300">{subtotal.tonnage.toFixed(2)} MT</td>
                                                <td className="px-2 py-1 text-xs tabular-nums border border-zinc-300">{formatMoney(subtotal.salesValue)}</td>
                                                <td className="w-full flex justify-center text-xs flex gap-2 px-2 py-1">
                                                    {s.status !== "CANCELLED" && (
                                                        <>
                                                            <button
                                                                onClick={() => router.push(`/sales/invoices/${s.id}`)}
                                                                className="px-1 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                            >
                                                                View
                                                            </button>
                                                            <button
                                                                className="px-1 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                                                onClick={() => openDeliveryModal(s)}
                                                            >
                                                                Delivery
                                                            </button>
                                                            <button
                                                                className="p-1 bg-red-500 text-white rounded hover:bg-red-600"
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
                                                    <tr className="bg-zinc-100 text-xs text-zinc-700 whitespace-nowrap">
                                                        <th className="px-8 py-2 text-left">Invoice No.</th>
                                                        <th className="px-8 py-2 text-left">Product</th>
                                                        <th className="px-8 py-2 text-left">SKU</th>
                                                        <th className="px-8 py-2 text-left">Pack Size</th>
                                                        <th className="px-8 py-2 text-left">Weight</th>
                                                        <th className="px-8 py-2 text-left">Price</th>
                                                        <th className="px-8 py-2 text-left">Order Qty</th>
                                                        <th className="px-8 py-2 text-left">Qty Delivered</th>
                                                        <th className="px-8 py-2 text-left">Tonnage</th>
                                                        <th className="px-8 py-2 text-left">Sales Value</th>
                                                    </tr>
                                                    {s.items.map((item) => {
                                                        const itemSubtotal = item.quantityDelivered * item.price;
                                                        return (
                                                            <tr key={`${s.id}-${item.id}`} className="border-t bg-zinc-50 whitespace-nowrap">
                                                                <td className="px-8 py-2 font-mono text-zinc-500">{s.invoiceNumber}</td>
                                                                <td className="px-4 py-2 text-zinc-600">{item.product.name}</td>
                                                                <td className="px-4 py-2 text-zinc-600">{item.product.sku}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{item.product.packSize}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{item.product.weightValue.toFixed(2)} {item.product.weightUnit}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{formatMoney(item.price)}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{item.quantity}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{item.quantityDelivered}</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-center">{getItemTonnage(item).toFixed(2)} MT</td>
                                                                <td className="px-4 py-2 text-zinc-600 text-left">{formatMoney(itemSubtotal)}</td>
                                                            </tr>
                                                        );
                                                    })}
                                                    {/* SUBTOTAL ROW */}
                                                    {(() => {
                                                        const subtotal = getSubtotal(s.items);
                                                        return (
                                                            <tr className="border-t bg-zinc-100 font-semibold">
                                                                <td colSpan={6} className="px-8 py-2 text-right text-zinc-700"> Total </td>
                                                                <td className="px-4 py-2 tabular-nums"> {subtotal.qty} </td>
                                                                <td className="px-4 py-2 tabular-nums"> {subtotal.delivered} </td>
                                                                <td className="px-4 py-2 tabular-nums"> {subtotal.tonnage.toFixed(2)} MT </td>
                                                                <td className="px-4 py-2 text-left"> {formatMoney(subtotal.invoiceValue)} </td>
                                                            </tr>
                                                        );
                                                    })()}
                                                </>
                                            )}
                                        </Fragment>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>


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
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </DashboardLayout>
    );
}
