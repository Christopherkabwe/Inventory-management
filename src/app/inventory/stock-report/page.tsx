"use client";

import { useEffect, useState, useMemo } from "react";
import Sidebar from "@/components/sidebar2";
import { Package, ChevronLeft, ChevronRight } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import DateFiltersExports from "@/components/DateFiltersExports";

interface Product {
    id: string;
    name: string;
    category: string;
    sku: string;
    price: number;
    quantity: number;
}

interface ReportData {
    productName: string;
    locationName: string;
    date: string; // ISO string
    openingStock: number;
    receipts: number;
    sales: number;
    transfersIn: number;
    transfersOut: number;
    returns: number;
    damaged: number;
    expired: number;
    rebagGain: number;
    rebagLoss: number;
    closingStock: number;
}

interface ProductOption {
    value: string;
    label: string;
    category: string;
}

const ITEMS_PER_PAGE = 20;

export default function StockReportDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [report, setReport] = useState<ReportData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [splitByLocation, setSplitByLocation] = useState(false);

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const prodRes = await fetch("/api/products");
                const productsDataRaw = await prodRes.json();
                const productsData = Array.isArray(productsDataRaw.products) ? productsDataRaw.products : [];
                setProducts(productsData);

                // Build query params for date filtering
                const params = new URLSearchParams();
                if (startDate) params.append("startDate", startDate.toISOString());
                if (endDate) params.append("endDate", endDate.toISOString());

                const repRes = await fetch(`/api/stock-report?${params.toString()}`);
                const reportData = await repRes.json();
                setReport(reportData);

            } catch (err) {
                console.error(err);
                setError("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [startDate, endDate]); // refetch whenever dates change

    const productCategoryMap = useMemo(() => {
        const map: Record<string, string> = {};
        products.forEach((p) => (map[p.name] = p.category));
        return map;
    }, [products]);

    const productOptions: ProductOption[] = useMemo(
        () =>
            products.map((p) => ({
                value: p.name,
                label: p.name,
                category: p.category,
            })),
        [products]
    );

    const locationOptions = useMemo(() => {
        const locations = Array.from(new Set(report.map((r) => r.locationName)));
        return locations.map((l) => ({ value: l, label: l }));
    }, [report]);

    const categoryOptions = useMemo(() => {
        const categories = Array.from(new Set(products.map((p) => p.category)));
        return categories.map((c) => ({ value: c, label: c }));
    }, [products]);

    const filteredReport = useMemo(() => {
        let filtered = report.filter((r) => {
            if (selectedLocations.length && !selectedLocations.includes(r.locationName)) return false;
            const category = productCategoryMap[r.productName] || "Uncategorized";
            if (selectedCategories.length && !selectedCategories.includes(category)) return false;
            if (selectedProducts.length && !selectedProducts.includes(r.productName)) return false;
            return true;
        });

        if (!splitByLocation) {
            const aggMap: Record<string, ReportData> = {};
            filtered.forEach((r) => {
                if (!aggMap[r.productName]) {
                    aggMap[r.productName] = { ...r };
                } else {
                    const agg = aggMap[r.productName];
                    agg.openingStock += r.openingStock;
                    agg.receipts += r.receipts;
                    agg.sales += r.sales;
                    agg.transfersIn += r.transfersIn;
                    agg.transfersOut += r.transfersOut;
                    agg.returns += r.returns;
                    agg.damaged += r.damaged;
                    agg.expired += r.expired;
                    agg.rebagGain += r.rebagGain;
                    agg.rebagLoss += r.rebagLoss;
                    agg.closingStock += r.closingStock;
                }
            });
            filtered = Object.values(aggMap).map((r) => ({
                ...r,
                locationName: "All Locations",
            }));
        }

        return filtered;
    }, [
        report,
        selectedLocations,
        selectedCategories,
        selectedProducts,
        splitByLocation,
        productCategoryMap,
    ]);

    const totalPages = Math.ceil(filteredReport.length / ITEMS_PER_PAGE);
    const paginatedReport = filteredReport.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    const exportCSVWrapper = () => exportCSV(filteredReport, splitByLocation);
    const exportPDFWrapper = () => exportPDF(filteredReport, splitByLocation);

    return (
        <main>
            <Sidebar />
            <div className="ml-64 p-4">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Package className="h-5 w-5" /> Stock Report
                </h2>

                {/* Filters & Toggle Row */}
                <div className="flex items-center justify-between gap-4 flex-wrap">
                    <div className="flex h-8 w-50 items-center mb-2 gap-2 px-2 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer">

                        <input
                            type="checkbox"
                            id="splitByLocation"
                            checked={splitByLocation}
                            onChange={() => setSplitByLocation(!splitByLocation)}
                            className="w-4 h-4"
                        />
                        <label htmlFor="splitByLocation" className="text-sm select-none">
                            Split by Location
                        </label>
                    </div>
                    {/* Date & Filters Component */}
                    <div className="flex-1 min-w-[300px]">
                        <DateFiltersExports
                            view="stock"
                            startDate={startDate}
                            endDate={endDate}
                            setStartDate={setStartDate}
                            setEndDate={setEndDate}
                            selectedLocations={selectedLocations}
                            setSelectedLocations={setSelectedLocations}
                            selectedCategories={selectedCategories}
                            setSelectedCategories={setSelectedCategories}
                            selectedProducts={selectedProducts}
                            setSelectedProducts={setSelectedProducts}
                            locationOptions={locationOptions}
                            categoryOptions={categoryOptions}
                            productOptions={productOptions}
                            exportCSV={exportCSVWrapper}
                            exportPDF={exportPDFWrapper}
                            setView={() => { }}
                        />
                    </div>
                </div>
                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border">
                        <thead className="bg-gray-200">
                            <tr>
                                <th className="border p-2">Product</th>
                                {splitByLocation && <th className="border p-2">Location</th>}
                                <th className="border p-2">Opening</th>
                                <th className="border p-2">Receipts</th>
                                <th className="border p-2">Sales</th>
                                <th className="border p-2">Transfers In</th>
                                <th className="border p-2">Transfers Out</th>
                                <th className="border p-2">Returns</th>
                                <th className="border p-2">Rebag Gain</th>
                                <th className="border p-2">Rebag Loss</th>
                                <th className="border p-2">Damaged</th>
                                <th className="border p-2">Expired</th>
                                <th className="border p-2">Closing</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedReport.map((r, idx) => (
                                <tr key={r.productName + idx} className="hover:bg-gray-100">
                                    <td className="border p-2">{r.productName}</td>
                                    {splitByLocation && <td className="border p-2">{r.locationName}</td>}
                                    <td className="border p-2">{r.openingStock}</td>
                                    <td className="border p-2">{r.receipts}</td>
                                    <td className="border p-2">{r.sales}</td>
                                    <td className="border p-2">{r.transfersIn}</td>
                                    <td className="border p-2">{r.transfersOut}</td>
                                    <td className="border p-2">{r.returns}</td>
                                    <td className="border p-2">{r.rebagGain}</td>
                                    <td className="border p-2">{r.rebagLoss}</td>
                                    <td className="border p-2">{r.damaged}</td>
                                    <td className="border p-2">{r.expired}</td>
                                    <td className="border p-2">{r.closingStock}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex justify-center gap-2 mt-4">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(currentPage - 1)}
                        className="px-3 py-1 border rounded bg-black text-white hover:bg-purple-600 disabled:opacity-50"
                    >
                        <ChevronLeft />
                    </button>
                    <span className="px-3 py-1">
                        Page {currentPage} of {totalPages}
                    </span>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(currentPage + 1)}
                        className="px-3 py-1 border rounded bg-black text-white hover:bg-purple-600 disabled:opacity-50"
                    >
                        <ChevronRight />
                    </button>
                </div>
            </div>
        </main >
    );
}

// ---------- Export Helpers ----------

function exportCSV(filteredReport: ReportData[], splitByLocation: boolean) {
    const headers = ["Product"];
    if (splitByLocation) headers.push("Location");
    headers.push(
        "Opening Stock",
        "Receipts",
        "Sales",
        "Transfers In",
        "Transfers Out",
        "Returns",
        "Damaged",
        "Expired",
        "Rebag Gain",
        "Rebag Loss",
        "Closing Stock"
    );

    const rows = filteredReport.map((r) => {
        const row: any[] = [r.productName];
        if (splitByLocation) row.push(r.locationName);
        row.push(
            r.openingStock,
            r.receipts,
            r.sales,
            r.transfersIn,
            r.transfersOut,
            r.returns,
            r.damaged,
            r.expired,
            r.rebagGain,
            r.rebagLoss,
            r.closingStock
        );
        return row;
    });

    const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "stock_report.csv";
    a.click();
    URL.revokeObjectURL(url);
}

function exportPDF(filteredReport: ReportData[], splitByLocation: boolean) {
    const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
    doc.setFontSize(16);
    doc.text("Stock Report", doc.internal.pageSize.getWidth() / 2, 40, { align: "center" });

    const head = ["Product"];
    if (splitByLocation) head.push("Location");
    head.push(
        "Opening",
        "Receipts",
        "Sales",
        "Transfers In",
        "Transfers Out",
        "Returns",
        "Damaged",
        "Expired",
        "Rebag Gain",
        "Rebag Loss",
        "Closing"
    );

    autoTable(doc, {
        startY: 60,
        head: [head],
        body: filteredReport.map((r) => {
            const row: any[] = [r.productName];
            if (splitByLocation) row.push(r.locationName);
            row.push(
                r.openingStock,
                r.receipts,
                r.sales,
                r.transfersIn,
                r.transfersOut,
                r.returns,
                r.damaged,
                r.expired,
                r.rebagGain,
                r.rebagLoss,
                r.closingStock
            );
            return row;
        }),
        styles: { fontSize: 8, cellPadding: 3 },
        headStyles: { fillColor: [100, 100, 100], textColor: 255 },
        alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    doc.save("stock_report.pdf");
}
