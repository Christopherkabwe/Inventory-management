"use client";

import { useState, useEffect, useRef } from "react";

interface FilterExportProps {
    title: string;
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;
    selectedLocations: string[];
    setSelectedLocations: (locations: string[]) => void;
    selectedCategories: string[];
    setSelectedCategories: (categories: string[]) => void;
    selectedProducts: string[];
    setSelectedProducts: (products: string[]) => void;
    locationOptions: { value: string; label: string }[];
    categoryOptions: { value: string; label: string }[];
    productOptions: { value: string; label: string }[];
    exportCSV: () => void;
    exportPDF: () => void;
}

export default function FilterExport({
    title,
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    selectedLocations,
    setSelectedLocations,
    selectedCategories,
    setSelectedCategories,
    selectedProducts,
    setSelectedProducts,
    locationOptions,
    categoryOptions,
    productOptions,
    exportCSV,
    exportPDF,
}: FilterExportProps) {
    const [showProducts, setShowProducts] = useState(false);
    const productRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (productRef.current && !productRef.current.contains(e.target as Node)) {
                setShowProducts(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    return (
        <div className="flex flex-wrap justify-between items-center gap-2 mb-4 p-2 bg-white rounded border hover:shadow-sm">
            {/* Date Filters */}
            <div className="flex gap-4 flex-wrap items-center">
                <label className="flex items-center gap-1 text-sm">
                    Start Date:
                    <input
                        type="date"
                        value={startDate ? startDate.toISOString().split("T")[0] : ""}
                        onChange={(e) =>
                            setStartDate(e.target.value ? new Date(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 text-sm"
                    />
                </label>
                <label className="flex items-center gap-1 text-sm">
                    End Date:
                    <input
                        type="date"
                        value={endDate ? endDate.toISOString().split("T")[0] : ""}
                        onChange={(e) =>
                            setEndDate(e.target.value ? new Date(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 text-sm"
                    />
                </label>

                {/* Location Filter */}
                <label className="flex items-center gap-1 text-sm">
                    Location:
                    <select
                        value={selectedLocations[0] || "all"}
                        onChange={(e) =>
                            setSelectedLocations(
                                e.target.value === "all" ? [] : [e.target.value]
                            )
                        }
                        className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        <option value="all">All</option>
                        {locationOptions.map((loc) => (
                            <option key={loc.value} value={loc.value}>
                                {loc.label}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Category Filter */}
                <label className="flex items-center gap-1 text-sm">
                    Category:
                    <select
                        value={selectedCategories[0] || "all"}
                        onChange={(e) =>
                            setSelectedCategories(
                                e.target.value === "all" ? [] : [e.target.value]
                            )
                        }
                        className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                    >
                        <option value="all">All</option>
                        {categoryOptions.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </label>

                {/* Product Filter */}
                <div ref={productRef} className="relative">
                    <span className="mr-2 text-sm">Products:</span>
                    <button
                        onClick={() => setShowProducts((v) => !v)}
                        className="px-3 h-8 border rounded bg-white hover:bg-gray-100 text-sm"
                    >
                        {selectedProducts.length === 0
                            ? "All Products"
                            : `${selectedProducts.length} selected`}
                    </button>
                    {showProducts && (
                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-50 w-64 max-h-56 overflow-y-auto p-2">
                            <button
                                onClick={() => setSelectedProducts([])}
                                className="text-xs text-blue-600 hover:underline mb-2 block"
                            >
                                Clear Selection
                            </button>
                            {productOptions.map((p) => (
                                <label
                                    key={p.value}
                                    className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer text-sm"
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedProducts.includes(p.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts([...selectedProducts, p.value]);
                                            } else {
                                                setSelectedProducts(
                                                    selectedProducts.filter((x) => x !== p.value)
                                                );
                                            }
                                        }}
                                        className="w-4 h-4"
                                    />
                                    {p.label}
                                </label>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Export Buttons */}
            <div className="flex gap-2 flex-wrap items-center">
                <button
                    onClick={exportCSV}
                    className="text-sm px-2 py-1 rounded border hover:bg-gray-100"
                >
                    Export CSV
                </button>
                <button
                    onClick={exportPDF}
                    className="text-sm px-2 py-1 rounded border hover:bg-gray-100"
                >
                    Export PDF
                </button>
            </div>
        </div>
    );
}
