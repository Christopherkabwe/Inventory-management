"use client";

import { Fragment, useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useRouter } from "next/navigation";
import Pagination from "@/components/pagination/pagination";
import buildSalesSummaryExport from "@/components/helper-functions/sales/buildSalesSummaryExport";
import { buildSalesItemExport } from "@/components/helper-functions/sales/buildSalesItemExport";
import { ExportHeader } from "@/lib/ExportUtils";
import { ExportButton } from "@/components/Exports/ExportButton";
import Loading from "@/components/Loading";
import SearchInput from "@/components/search/SearchInput";
import { DateRangeFilter } from "@/components/Date-Filters/DateRangeFilter";
import { Button } from "@/components/ui/button";
import { Download, ChevronUp, ChevronDown } from "lucide-react";

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
    orderNumber: string;
    status: string;
    customer: CustomerType;
    location: { id: string; name: string };
    items: SaleItemType[];
    saleDate: string;
    salesOrderId: string;
};
interface DateRange {
    start?: Date;
    end?: Date;
}
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
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const router = useRouter();
    const [search, setSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>({});
    const [showExports, setShowExports] = useState(false);

    // FETCH SALES
    const fetchSales = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/invoices");
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
    // Pagination

    const ITEMS_PER_PAGE = 15;

    const [currentPage, setCurrentPage] = useState(1);


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

    // Filtered Sales Invoices
    const filteredSales = sales.filter((s) => {
        const q = search.toLowerCase().trim();

        /* ---------- TEXT SEARCH ---------- */
        const matchesSearch =
            !q ||
            s.invoiceNumber?.toLowerCase().includes(q) ||
            s.orderNumber?.toLowerCase().includes(q) ||
            s.customer?.name?.toLowerCase().includes(q) ||
            s.location?.name?.toLowerCase().includes(q);

        if (!matchesSearch) return false;

        /* ---------- DATE RANGE ---------- */
        if (dateRange.start || dateRange.end) {
            const rowDate = new Date(s.saleDate);

            const start = dateRange.start
                ? new Date(new Date(dateRange.start).setHours(0, 0, 0, 0))
                : null;

            const end = dateRange.end
                ? new Date(new Date(dateRange.end).setHours(23, 59, 59, 999))
                : null;

            if (start && rowDate < start) return false;
            if (end && rowDate > end) return false;
        }

        return true;
    });

    const totalPages = Math.ceil(filteredSales.length / ITEMS_PER_PAGE);

    const paginatedSales = filteredSales.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [search, dateRange]);

    return (
        <div>
            <div>
                <h1 className="text-3xl px-5 font-bold mb-1">Sales Invoices</h1>
                <p className="text-gray-500 px-5 mb-3">Record of all sales & invoices</p>
            </div>
            <div className="bg-white p-5 overflow-auto rounded-lg border">
                <div className="space-y-1">
                    <div className="grid grid-cols-2 gap-5 mb-2">
                        {/* SEARCH – span 2 cols */}
                        <div className="">
                            <SearchInput
                                value={search}
                                onChange={setSearch}
                                placeholder="Search..."
                                className="w-full"
                            />
                        </div>

                        {/* DATE RANGE – span 2 cols */}
                        <div className="w-full">
                            <DateRangeFilter
                                value={dateRange}
                                onChange={setDateRange}
                            />
                        </div>
                    </div>
                    <div className="flex flex-row justify-end gap-5 mb-2">
                        <div className="flex justify-end mb-3">

                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowExports((v) => !v)}
                                className="flex items-center gap-2"
                            >
                                <Download className="h-4 w-4" />
                                Exports
                                {showExports ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                            </Button>
                        </div>
                        {showExports && (
                            <div className="flex flex-row justify-end gap-5 mb-5">
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
                        )}
                    </div>
                </div>
                <div>
                    <table className="w-full max-h-[70vh] text-sm border-collapse">
                        <thead className="bg-zinc-100 sticky top-0 z-30">
                            <tr>
                                <th className="p-2 border text-sm">Invoice #</th>
                                <th className="p-2 border text-sm">Order #</th>
                                <th className="p-2 border text-sm">Status</th>
                                <th className="p-2 border text-sm">Customer</th>
                                <th className="p-2 border text-sm">Location</th>
                                <th className="p-2 border text-sm">Date</th>
                                <th className="p-2 border text-sm">Ordet Qty</th>
                                <th className="p-2 border text-sm">Qty Delivered</th>
                                <th className="p-2 border text-sm">Tonnage</th>
                                <th className="p-2 border text-sm">Sales Value</th>
                                <th className="p-2 border text-sm">View</th>
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
                                        {search ? "No matching invoices found." : "No sales found."}
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
                                                <td className="px-2 py-1 text-xs font-mono border border-zinc-300">
                                                    {s.orderNumber}
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
                                                                className="px-1 py-1 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700"
                                                            >
                                                                Invoice
                                                            </button>
                                                            {/* NEW BUTTON: View Delivery Notes for this invoice */}
                                                            <button
                                                                onClick={() => router.push(`/view-docs/delivery-note/${s.id}`)}
                                                                className="px-1 py-1 bg-green-500 text-white rounded cursor-pointer hover:bg-green-600"
                                                            >
                                                                Delivery Notes
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/sales/sales-orders/${s.salesOrderId}`)}
                                                                className="px-1 py-1 bg-orange-500 text-white rounded cursor-pointer hover:bg-orange-600"
                                                            >
                                                                Sales Order
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/sales/invoices/${s.id}/credit-note`)}
                                                                className="px-1 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                                                            >
                                                                Credit Note
                                                            </button>
                                                            <button
                                                                onClick={() => router.push(`/sales/sales-returns/${s.invoiceNumber}`)}
                                                                className="px-1 py-1 bg-purple-600 text-white rounded hover:bg-red-700"
                                                            >
                                                                Sales Return
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
                                                        const itemSubtotal = item.quantity * item.price;
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
                                                                <td className="px-4 py-2 text-left"> {formatMoney(subtotal.salesValue)} </td>
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
                <div className="mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={setCurrentPage}
                    />
                </div>
            </div>
        </div >
    );
}
