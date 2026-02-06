"use client";

import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loading from "@/components/Loading";
import { ExportHeader } from "@/lib/ExportUtils";
import { ExportButton } from "../Exports/ExportButton";
import SearchInput from "../search/SearchInput";
import { DateRangeFilter } from "../Date-Filters/DateRangeFilter";

interface DateRange {
    start?: Date;
    end?: Date;
}

interface BatchRow {
    productionNo: string;
    batchNumber: string;
    product: string;
    sku: string;
    category: string;
    quantity: number;
    tonnage: number;
    location: string;
    date: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    price: number;
    costPerBag: number;
    totalValue: number;
    totalCost: number;
    profitMargin: number;
    totalProfit: number;
}

export default function ProductionBatchTracking() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [locationId, setLocationId] = useState("");
    const [batch, setBatch] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [batchRows, setBatchRows] = useState<BatchRow[]>([]);
    const [loading, setLoading] = useState(false);

    const [dateRange, setDateRange] = useState<DateRange>({});

    const fetchReports = async () => {
        setLoading(true);
        try {
            const productParams = new URLSearchParams();
            if (from) productParams.append("from", from);
            if (to) productParams.append("to", to);
            if (locationId) productParams.append("locationId", locationId);

            const locationParams = new URLSearchParams();
            if (from) locationParams.append("from", from);
            if (to) locationParams.append("to", to);

            const batchParams = new URLSearchParams();
            if (batch) batchParams.append("batch", batch);
            if (from) batchParams.append("from", from);
            if (to) batchParams.append("to", to);

            const [p, l, b] = await Promise.all([
                fetch(`/api/rbac/reports/production/by-product?${productParams}`).then(r => r.json()),
                fetch(`/api/rbac/reports/production/by-location?${locationParams}`).then(r => r.json()),
                fetch(`/api/rbac/reports/production/by-batch?${batchParams}`).then(r => r.json()),
            ]);
            const batchRowsUpdated = b.data.map(b => ({
                ...b,
                totalProfit: (b.totalValue - b.totalCost)
            }));
            setBatchRows(batchRowsUpdated || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchReports().finally(() => setLoading(false));
    }, []);

    // ----- CSV Export -----
    const exportCSV = (filename: string, data: any[], headers: string[]) => {
        const rows = data.map(row =>
            headers.map(h => {
                const value = row[h as keyof typeof row];
                // Format numbers with 2 decimal places
                if (typeof value === "number") return value.toFixed(2);
                return value;
            })
        );

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // ----- PDF Export -----
    const exportPDF = (title: string, headers: string[], data: any[]) => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(14);
        doc.text(title, 14, 15);

        autoTable(doc, {
            head: [headers],
            body: data.map(row =>
                headers.map(h => {
                    const value = row[h as keyof typeof row];
                    // Format numbers with 2 decimal places
                    if (typeof value === "number") return value.toFixed(2);
                    return value;
                })
            ),
            startY: 20,
            styles: { fontSize: 12, cellWidth: 'auto', overflow: 'linebreak' },
            headStyles: { fillColor: [100, 150, 250], textColor: 255, fontStyle: 'bold' },
            // fillColor: [37, 99, 235] blue-600
            // fillColor: [220, 220, 220] gray
            theme: 'grid',
        });

        doc.save(`${title}.pdf`);
    };
    // EXPORTS
    const batchExportHeaders: ExportHeader<BatchRow>[] = [
        { key: "productionNo", label: "Production No" },
        { key: "batchNumber", label: "Batch No" },
        { key: "date", label: "Production Date" },
        { key: "location", label: "Location" },
        { key: "product", label: "Product Name" },
        { key: "sku", label: "SKU" },
        { key: "weightValue", label: "Weight" },
        { key: "quantity", label: "Quantity" },
        { key: "tonnage", label: "Tonnage" },
        { key: "costPerBag", label: "Unit Cost" },
        { key: "price", label: "Selling price" },
        { key: "profitMargin", label: "Profit Margin" },
        { key: "totalCost", label: "Total Cost" },
        { key: "totalValue", label: "Total Value" },
        { key: "totalValue", label: "Total Value" },
        { key: "totalProfit", label: "Total Profit" },
    ];

    const filteredbatchRows = batchRows.filter(b => {
        // --- Search filter ---
        const matchesSearch =
            b.productionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.batchNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            b.location.toLowerCase().includes(searchQuery.toLowerCase());

        if (!matchesSearch) return false;

        // --- Date range filter ---
        const rowDate = new Date(b.date);
        const start = dateRange.start ? new Date(dateRange.start.setHours(0, 0, 0, 0)) : null;
        const end = dateRange.end ? new Date(dateRange.end.setHours(23, 59, 59, 999)) : null;

        if (start && rowDate < start) return false;
        if (end && rowDate > end) return false;

        return true;
    });

    return (
        < div className="bg-white p-5 rounded-md border space-y-2 mb-5" >
            <h2 className="font-semibold mb-2 dark:text-black">Batch Tracking Report</h2>
            <div className="flex gap-2 mb-2 justify-between">
                <SearchInput
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder="Search by Production No, Batch No or Location"
                    className="w-full"
                />
                <div>
                    <DateRangeFilter
                        value={dateRange}
                        onChange={setDateRange}
                    />
                </div>
                <ExportButton
                    type="csv"
                    headers={batchExportHeaders}
                    data={filteredbatchRows}
                    filename="productions.csv"
                    label="Export CSV"
                />
                <ExportButton
                    type="pdf"
                    headers={batchExportHeaders}
                    data={filteredbatchRows}
                    filename="productions.pdf"
                    label="Export PDF"
                    mode="landscape"
                />
            </div>
            <div className="max-h-[500px] overflow-auto w-full text-black">
                <table className="min-w-full border border-gray-300 divide-y divide-x divide-gray-300 text-sm text-left">
                    <thead className="bg-gray-100 sticky top-0">
                        <tr className="divide-y divide-x divide-gray-200">
                            <th className="px-2 py-1">#</th>
                            <th className="px-2 py-1">Batch No</th>
                            <th className="px-2 py-1">Production No</th>
                            <th className="px-2 py-1">Production Date</th>
                            <th className="px-2 py-1">Location</th>
                            <th className="px-2 py-1">Product Name</th>
                            <th className="px-2 py-1">SKU</th>
                            <th className="px-2 py-1">Pack Size</th>
                            <th className="px-2 py-1">Weight</th>
                            <th className="px-2 py-1">UoM</th>
                            <th className="px-2 py-1">Quantity</th>
                            <th className="px-2 py-1">Tonnage</th>
                            <th className="px-2 py-1">Unit Cost</th>
                            <th className="px-2 py-1">Selling Price</th>
                            <th className="px-2 py-1">Profit Margin</th>
                            <th className="px-2 py-1">Total Cost</th>
                            <th className="px-2 py-1">Total Value</th>
                            <th className="px-2 py-1">Total Profit</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y text-sm">
                        {loading ? (
                            <Loading
                                colSpan={20} message="Loading Production Data"
                            />
                        ) : filteredbatchRows.length === 0 ? (
                            <tr>
                                <td colSpan={20} className="px-4 py-2 text-sm text-gray-800 text-center">
                                    No productions found.
                                </td>
                            </tr>
                        ) : (
                            <>
                                {filteredbatchRows?.map((b, i) => (
                                    <tr key={i} className="divide-y divide-x divide-gray-200 whitespace-nowrap">
                                        <td className="px-2 py-1">{i + 1}</td>
                                        <td className="px-2 py-1">{b.batchNumber}</td>
                                        <td className="px-2 py-1">{b.productionNo}</td>
                                        <td className="px-2 py-1">{new Date(b.date).toLocaleDateString()}</td>
                                        <td className="px-2 py-1">{b.location}</td>
                                        <td className="px-2 py-1">{b.product}</td>
                                        <td className="px-2 py-1">{b.sku}</td>
                                        <td className="px-2 py-1">{b.packSize}</td>
                                        <td className="px-2 py-1">{(b.weightValue).toFixed(2)}</td>
                                        <td className="px-2 py-1">{b.weightUnit}</td>
                                        <td className="px-2 py-1">{b.quantity}</td>
                                        <td className="px-2 py-1">{(b.tonnage).toFixed(2)}</td>
                                        <td className="px-2 py-1">{`K${b.costPerBag?.toFixed(2)}`}</td>
                                        <td className="px-2 py-1">{`K${b.price?.toFixed(2)}`}</td>
                                        <td className="px-2 py-1">{b.profitMargin | 0}%</td>
                                        <td className="px-2 py-1">{`K${b.totalCost?.toFixed(2)}`}</td>
                                        <td className="px-2 py-1">{`K${b.totalValue?.toFixed(2)}`}</td>
                                        <td className="px-2 py-1">{`K${(b.totalValue - b.totalCost)?.toFixed(2)}`}</td>
                                    </tr>
                                ))}

                                {/* Total Row */}
                                <tr className="bg-gray-200 font-semibold divide-y divide-x divide-gray-300">
                                    <td className="p-2 text-center" colSpan={9}>Total</td>
                                    <td className="p-2 ">
                                        {batchRows.reduce((sum, b) => sum + b.quantity, 0)}
                                    </td>
                                    <td className="p-2">
                                        {batchRows.reduce((sum, b) => sum + b.tonnage, 0).toFixed(2)}
                                    </td>
                                    <td className="p-2 text-center">-</td>
                                    <td className="p-2 text-center">-</td>
                                    <td className="p-2 text-center">-</td>
                                    <td className="p-2 text-center">-</td>
                                    <td className="p-2">
                                        K{batchRows.reduce((sum, b) => sum + b.totalCost, 0).toFixed(2)}
                                    </td>
                                    <td className="p-2">
                                        K{batchRows.reduce((sum, b) => sum + b.totalValue, 0).toFixed(2)}
                                    </td>
                                    <td className="p-2">
                                        K{batchRows.reduce((sum, b) => sum + (b.totalValue - b.totalCost), 0).toFixed(2)}
                                    </td>
                                </tr>
                            </>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
