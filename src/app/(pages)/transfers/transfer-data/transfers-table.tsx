"use client";

import { useState, Fragment, useEffect } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";
import buildTransferSummaryExport, {
    formatDateTime,
    getItemTonnage,
    getSubtotal
} from "@/components/helper-functions/transfers/buildTransferSummaryExport";
import { buildTransferItemExport } from "@/components/helper-functions/transfers/buildTransferItemExport";
import Pagination from "@/components/pagination/pagination";
import { DateRangeFilter } from "@/components/Date-Filters/DateRangeFilter";
import SearchInput from "@/components/search/SearchInput";

type TransferExportRow = {
    ibtNumber: string;
    status: string;
    from: string;
    to: string;
    quantity: number;
    tonnage: string;
    createdAt: string;
};

type TransferItemExportRow = {
    ibtNumber: string;
    status: string;
    from: string;
    to: string;
    sku: string;
    product: string;
    packSize: number;
    weight: string;
    quantity: number;
    tonnage: string;
    createdAt: string;
};
interface DateRange {
    start?: Date;
    end?: Date;
}
export default function TransfersTable({ transfers }: { transfers: any[] }) {
    const [open, setOpen] = useState<Record<string, boolean>>({});
    const [referenceSearch, setReferenceSearch] = useState("");
    const [dateRange, setDateRange] = useState<DateRange>({});
    const toggle = (id: string) => {
        setOpen((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const summaryExportData = buildTransferSummaryExport(transfers);

    const summaryExportHeaders: ExportHeader<TransferExportRow>[] = [
        { key: "ibtNumber", label: "IBT Number" },
        { key: "status", label: "Status" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "quantity", label: "Quantity" },
        { key: "tonnage", label: "Tonnage (MT)" },
        { key: "createdAt", label: "Created At" },
    ];

    const itemExportData = buildTransferItemExport(transfers);
    const itemExportHeaders: ExportHeader<TransferItemExportRow>[] = [
        { key: "ibtNumber", label: "IBT Number" },
        { key: "status", label: "Status" },
        { key: "from", label: "From" },
        { key: "to", label: "To" },
        { key: "sku", label: "SKU" },
        { key: "product", label: "Product" },
        { key: "packSize", label: "Pack Size" },
        { key: "weight", label: "Weight" },
        { key: "quantity", label: "Quantity" },
        { key: "tonnage", label: "Tonnage (MT)" },
        { key: "createdAt", label: "Created At" },
    ];

    // Filtered Data
    const filteredTransfers = transfers.filter((t) => {
        const searchValue = referenceSearch.toLowerCase();
        const matchesSearch =
            t.ibtNumber.toLowerCase().includes(searchValue) ||
            t.status.toLowerCase().includes(searchValue) ||
            t.fromLocation.name.toLowerCase().includes(searchValue) ||
            t.toLocation.name.toLowerCase().includes(searchValue);

        const matchesDate =
            (!dateRange.start || new Date(t.createdAt) >= dateRange.start) &&
            (!dateRange.end || new Date(t.createdAt) <= dateRange.end);

        return matchesSearch && matchesDate;
    });

    // Pagination
    const ITEMS_PER_PAGE = 10;

    const [currentPage, setCurrentPage] = useState(1);

    const totalPages = Math.ceil(transfers.length / ITEMS_PER_PAGE);

    const paginatedTransfers = filteredTransfers.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    useEffect(() => {
        setCurrentPage(1);
    }, [referenceSearch, dateRange]);

    return (
        <div className="bg-white p-5 overflow-auto rounded-lg border">
            <div className="flex justify-between gap-2 mb-2 px-2 py-">
                {/* SUMMARY EXPORT */}
                <div>
                    <SearchInput
                        value={referenceSearch}
                        onChange={setReferenceSearch}
                        placeholder="Search IBT, Status or Location"
                    />
                </div>
                <div>
                    <DateRangeFilter
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </div>
                <div>
                    <ExportButton
                        type="csv"
                        headers={summaryExportHeaders}
                        data={summaryExportData}
                        filename="Stock-Transfer-Summary.csv"
                        label="Export Summary CSV"
                    />
                </div>

                <div>
                    <ExportButton
                        type="pdf"
                        headers={summaryExportHeaders}
                        data={summaryExportData}
                        filename="Stock-Transfer-Summary.pdf"
                        label="Export Summary PDF"
                    />
                </div>
                {/* ITEM EXPORT */}
                <div>
                    <ExportButton
                        type="csv"
                        headers={itemExportHeaders}
                        data={itemExportData}
                        filename="Stock-Transfer-Items.csv"
                        label="Export Items CSV"
                    />
                </div >
                <div>
                    <ExportButton
                        type="pdf"
                        headers={itemExportHeaders}
                        data={itemExportData}
                        filename="Stock-Transfer-Items.pdf"
                        mode="landscape"
                        label="Export Items PDF"
                    />
                </div>
            </div>
            <div>
                <table className="w-full max-h-[70vh] text-sm border-collapse">
                    <thead className="bg-zinc-100 sticky top-0 z-30">
                        <tr>
                            <th className="px-4 py-2 text-left">IBT Number</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">From</th>
                            <th className="px-4 py-2 text-left">To</th>
                            <th className="px-4 py-2 text-left">Quantity</th>
                            <th className="px-4 py-2 text-left">Tonnage</th>
                            <th className="px-4 py-2 text-left">Created At</th>
                        </tr>
                    </thead>

                    <tbody>
                        {paginatedTransfers.map((t) => {
                            const subtotal = getSubtotal(t.items);
                            const isOpen = open[t.id];

                            return (
                                <Fragment key={t.id}>
                                    {/* SUMMARY ROW */}
                                    <tr
                                        className={[
                                            "border-t cursor-pointer",
                                            isOpen
                                                ? "sticky top-8 z-20 bg-white shadow-sm"
                                                : "bg-white",
                                        ].join(" ")}
                                    >
                                        <td className="px-4 py-2 font-mono">
                                            <button
                                                onClick={() => toggle(t.id)}
                                                className="inline-flex items-center gap-2 hover:underline cursor-pointer"
                                            >
                                                {isOpen ? (
                                                    <ChevronDown className="h-4 w-4" />
                                                ) : (
                                                    <ChevronRight className="h-4 w-4" />
                                                )}
                                                {t.ibtNumber}
                                            </button>
                                        </td>

                                        <td className="px-4 py-2">{t.status}</td>
                                        <td className="px-4 py-2">{t.fromLocation.name}</td>
                                        <td className="px-4 py-2">{t.toLocation.name}</td>

                                        {/* SUBTOTAL */}
                                        <td className="px-4 py-2 text-sm">
                                            {subtotal.qty} units
                                        </td>
                                        <td className="px-4 py-2 text-xs">
                                            {subtotal.tonnage.toFixed(2)}{" "} Tons
                                        </td>

                                        <td className="px-4 py-2 text-xs">
                                            {formatDateTime(t.createdAt)}
                                        </td>
                                    </tr>

                                    {/* ITEM ROWS */}
                                    {open[t.id] && (
                                        <>
                                            {/* PRODUCT HEADER */}
                                            <tr className="bg-zinc-200 text-xs text-zinc-700">
                                                <th className="px-8 py-2 text-left">IBT No.</th>
                                                <th className="px-4 py-2 text-left">SKU</th>
                                                <th className="px-4 py-2 text-left">Pack Size</th>
                                                <th className="px-4 py-2 text-left">Weight</th>
                                                <th className="px-4 py-2 text-left">Product</th>
                                                <th className="px-4 py-2 text-left">Quantity</th>
                                                <th className="px-4 py-2 text-left">Tonnage</th>
                                            </tr>

                                            {/* PRODUCT ROWS */}
                                            {t.items.map((item: any) => (
                                                <tr
                                                    key={`${t.id}-${item.id}`}
                                                    className="border-t bg-zinc-50"
                                                >
                                                    <td className="px-8 py-2 font-mono text-zinc-500">
                                                        {t.ibtNumber}
                                                    </td>
                                                    <td className="px-4 py-2 text-zinc-600">
                                                        {item.product.sku}
                                                    </td>
                                                    <td className="px-4 py-2 text-zinc-600">
                                                        {item.product.packSize}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {item.product.weightValue} {item.product.weightUnit}
                                                    </td>
                                                    <td className="px-4 py-2">
                                                        {item.product.name}
                                                    </td>
                                                    <td className="px-4 py-2 tabular-nums">
                                                        {item.quantity}
                                                    </td>

                                                    <td className="px-4 py-2 tabular-nums font-medium">
                                                        {getItemTonnage(item).toFixed(2)} MT
                                                    </td>
                                                </tr>
                                            ))}

                                            {/* SUBTOTAL ROW */}
                                            {(() => {
                                                const subtotal = getSubtotal(t.items);

                                                return (
                                                    <tr className="border-t bg-zinc-100 font-semibold">
                                                        <td
                                                            colSpan={5}
                                                            className="px-8 py-2 text-right text-zinc-700"
                                                        >
                                                            Total
                                                        </td>
                                                        <td className="px-4 py-2 tabular-nums">
                                                            {subtotal.qty}
                                                        </td>
                                                        <td className="px-4 py-2 tabular-nums">
                                                            {subtotal.tonnage.toFixed(2)} MT
                                                        </td>
                                                    </tr>
                                                );
                                            })()}

                                        </>
                                    )}

                                </Fragment>
                            );
                        })}
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
        </div >
    );
}
