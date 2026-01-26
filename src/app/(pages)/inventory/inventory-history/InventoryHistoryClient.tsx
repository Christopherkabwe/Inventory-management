"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
import { MultiProductCombobox } from "@/components/MultiSelectComboBox/MultiProductCombobox";
import { MultiCategoryCombobox } from "@/components/MultiSelectComboBox/MultiCategoryComboBox";
import { MultiLocationCombobox } from "@/components/MultiSelectComboBox/MultiLocationComboBox";
import { DateRangeFilter } from "@/components/Date-Filters/DateRangeFilter";
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";
import Pagination from "@/components/pagination/pagination";
import SearchInput from "@/components/search/SearchInput";


interface InventoryRow {
    date: string;
    productId: string;
    sku: string;
    product: string;
    category?: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    locationId: string;
    locationName: string;
    delta: number;
    balance: number;
    tonnage: number;
    sourceType: string;
    reference: string;
}
interface SourceType {
    id: string;
    label: string;
}

interface Category {
    id: string;
    label: string;
}

interface DateRange {
    start?: Date;
    end?: Date;
}

interface Props {
    rows: InventoryRow[];
}


export default function InventoryStockClient({ rows }: Props) {
    const [allRows, setAllRows] = useState<InventoryRow[]>(rows);
    const [filteredRows, setFilteredRows] = useState<InventoryRow[]>(rows);
    const [loading, setLoading] = useState(false);
    const [referenceSearch, setReferenceSearch] = useState("");
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [dateRange, setDateRange] = useState<DateRange>({});
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [locations, setLocations] = useState([]);
    const [sourceTypes, setSourceTypes] = useState([]);

    useEffect(() => {
        setAllRows(rows);
        setFilteredRows(rows);

        // Populate products, categories, locations, and source types
        const uniqueProducts = Array.from(
            new Map(rows.map(p => [p.productId, p.product])).entries()
        ).map(([id, name]) => ({ id, name }));
        const uniqueCategories: Category[] = Array.from(
            new Set(rows.map(r => r.category).filter(Boolean))
        ).map(label => ({ id: label!, label }));
        const uniqueLocations = Array.from(
            new Map(rows.map(r => [r.locationId, r.locationName])).entries()
        ).map(([id, label]) => ({ id, label }));
        const uniqueSourceTypes: SourceType[] = Array.from(
            new Set(rows.map(r => r.sourceType))
        ).map(label => ({ id: label!, label }));

        setProducts(uniqueProducts);
        setCategories(uniqueCategories);
        setLocations(uniqueLocations);
        setSourceTypes(uniqueSourceTypes);
    }, [rows]);

    useEffect(() => {
        let filtered = allRows;
        // Filter by product IDs
        if (selectedProducts.length > 0) {
            filtered = filtered.filter(r => selectedProducts.includes(r.productId));
        }
        // Filter by category names
        if (selectedCategories.length > 0) {
            filtered = filtered.filter(r => selectedCategories.includes(r.category!));
        }
        // Filter by location IDs
        if (selectedLocations.length > 0) {
            filtered = filtered.filter(r => selectedLocations.includes(r.locationId));
        }
        // Filter by reference search
        if (referenceSearch.trim() !== "") {
            const searchLower = referenceSearch.toLowerCase();
            filtered = filtered.filter(r =>
                r.reference.toLowerCase().includes(searchLower) ||
                r.sku.toLowerCase().includes(searchLower) ||
                r.product.toLowerCase().includes(searchLower) ||
                r.category?.toLowerCase().includes(searchLower) ||
                r.locationName.toLowerCase().includes(searchLower) ||
                new Date(r.date).toLocaleDateString().toLowerCase().includes(searchLower)
            );
        }
        // ✅ Filter by date range
        // Date range normalization
        const start = dateRange.start ? new Date(new Date(dateRange.start).setHours(0, 0, 0, 0)) : null;
        const end = dateRange.end ? new Date(new Date(dateRange.end).setHours(23, 59, 59, 999)) : null;
        if (start || end) {
            filtered = filtered.filter((r) => {
                const rowDate = new Date(r.date);
                if (start && rowDate < start) return false;
                if (end && rowDate > end) return false;
                return true;
            });
        }
        setFilteredRows(filtered);
    }, [allRows, selectedProducts, selectedCategories, selectedLocations, referenceSearch, dateRange]);


    // Frontend cross-check: highlight discrepancies
    const renderDelta = (row: InventoryRow) => {
        const color =
            row.delta > 0
                ? "text-green-600"
                : row.delta < 0
                    ? "text-red-600"
                    : "text-gray-700";
        return <span className={color}>{row.delta > 0 ? `+${row.delta}` : row.delta}</span>;
    };



    const exportHeaders: ExportHeader<InventoryRow>[] = [
        { key: "date", label: "Date" },
        { key: "product", label: "Product" },
        { key: "sku", label: "SKU" },
        { key: "packSize", label: "Pack Size" },
        { key: "weightUnit", label: "UoM" },
        { key: "weightValue", label: "Weight" },
        { key: "category", label: "Category" },
        { key: "locationName", label: "Location" },
        { key: "delta", label: "Δ Qty" },
        { key: "balance", label: "Balance" },
        { key: "tonnage", label: "Tonnage (t)" },
        { key: "reference", label: "Reference" },
    ];

    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [rowsPerPage, setRowsPerPage] = useState(20); // can adjust

    const totalPages = Math.ceil(filteredRows.length / rowsPerPage);

    const paginatedRows = filteredRows.slice(
        (currentPage - 1) * rowsPerPage,
        currentPage * rowsPerPage
    );

    const exportData = paginatedRows;

    return (
        <div>
            <div className="space-y-2 p-5">
                <div>
                    <h1 className="text-3xl font-bold">Inventory Transaction History</h1>
                    <p className="text-gray-500 mt-1 mb-2">Record of all inventory transactions</p>
                </div>
                {/* Filters */}
                <div className="w-full flex justify-between gap-5 p-2 rounded-lg border border-zinc-300">
                    <div className="w-full">
                        <SearchInput
                            value={referenceSearch}
                            onChange={setReferenceSearch}
                            placeholder="Search..."
                        />
                    </div>
                    <DateRangeFilter
                        value={dateRange}
                        onChange={setDateRange}
                    />

                    <div className="w-full">
                        <MultiProductCombobox
                            products={products}
                            values={selectedProducts}
                            onChange={setSelectedProducts}
                        />
                    </div>
                    <div className="w-full">
                        <MultiCategoryCombobox
                            categories={categories}
                            values={selectedCategories}
                            onChange={setSelectedCategories}
                        />
                    </div>
                    <div className="w-full">
                        <MultiLocationCombobox
                            locations={locations}
                            values={selectedLocations}
                            onChange={setSelectedLocations}
                        />
                    </div>
                    <div className="w-full">
                        <ExportButton
                            type="csv"
                            headers={exportHeaders}
                            data={exportData}
                            filename="inventory-stock-history.csv"
                            label="Export CSV"
                        />
                    </div>
                    <div className="w-full">
                        <ExportButton
                            type="pdf"
                            headers={exportHeaders}
                            data={exportData}
                            filename="inventory-stock-history.pdf"
                            title="Inventory Stock History"
                            mode="landscape"
                            label="Export PDF"
                        />
                    </div>
                </div>
                <div className="rounded-sm overflow-y-auto max-h-[650px] bg-white">
                    <table className="w-full border-collapse text-sm overflow-x-auto">
                        <thead className="">
                            <tr className="border-b bg-blue-200 sticky top-0">
                                <th className="text-left p-2">Date</th>
                                <th className="text-left p-2">Product</th>
                                <th className="text-left p-2">SKU</th>
                                <th className="text-left p-2">Pack Size</th>
                                <th className="text-left p-2">UoM</th>
                                <th className="text-left p-2">Weight</th>
                                <th className="text-left p-2">Category</th>
                                <th className="text-left p-2">Location</th>
                                <th className="text-right p-2">Δ Qty</th>
                                <th className="text-right p-2">Balance</th>
                                <th className="text-right p-2">Tonnage (t)</th>
                                <th className="text-left p-2">Source</th>
                                <th className="text-left p-2">Reference</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <Loading
                                        message="Loading.."
                                        colSpan={20}
                                        className="text-center py-4"
                                    />
                                </tr>

                            ) : paginatedRows.length ? (
                                paginatedRows.map((r, i) => (
                                    <tr
                                        key={i}
                                        className={"border-b last:border-0"}
                                    >
                                        <td className="text-left p-2">{new Date(r.date).toLocaleDateString()}</td>
                                        <td className="text-left p-2">{r.product}</td>
                                        <td className="text-left p-2">{r.sku}</td>
                                        <td className="text-left p-2">{r.packSize}</td>
                                        <td className="text-left p-2">{r.weightUnit}</td>
                                        <td className="text-left p-2">{r.weightValue?.toFixed(2)}</td>
                                        <td className="text-left p-2">{r.category}</td>
                                        <td className="text-left p-2">{r.locationName}</td>
                                        <td className="text-right p-2">{renderDelta(r)}</td>
                                        <td className="text-right p-2">{r.balance}</td>
                                        <td className="text-right p-2">{r.tonnage?.toFixed(2)}</td>
                                        <td className="text-left p-2">{r.sourceType}</td>
                                        <td className="text-left p-2 truncate">{r.reference}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={14} className="text-center py-4">
                                        No inventory found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>


                <div className="flex justify-center mt-4">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={(page) => setCurrentPage(page)}
                    />
                </div>
            </div>
        </div>
    );
}
