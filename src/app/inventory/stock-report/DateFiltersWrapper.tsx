"use client";

import { useState, useRef, useEffect } from "react";
import { MapPin, User, Package } from "lucide-react";

interface Option {
    value: string;
    label: string;
    category?: string;
}

interface Props {
    inventory: any[]; // full inventory from server
    exportCSV: () => void;
    exportPDF: () => void;
}

const DateFiltersWrapper = ({ inventory, exportCSV, exportPDF }: Props) => {
    // Convert inventory into product & category options safely
    const productOptions: Option[] = (inventory || [])
        .filter((i) => i.product)
        .map((i) => ({
            value: i.product.id,
            label: i.product.name,
            category: i.product.category || undefined,
        }));

    const categoryOptions: Option[] = Array.from(
        new Set(productOptions.map((p) => p.category).filter(Boolean))
    ).map((c) => ({ value: c!, label: c! }));

    const locationOptions: Option[] = Array.from(
        new Set((inventory || []).map((i) => i.location?.name).filter(Boolean))
    ).map((loc) => ({ value: loc!, label: loc! }));

    return (
        <DateFiltersExports
            view="stock-report"
            startDate={null}
            endDate={null}
            setStartDate={() => { }}
            setEndDate={() => { }}
            selectedLocations={[]}
            setSelectedLocations={() => { }}
            selectedCategories={[]}
            setSelectedCategories={() => { }}
            selectedProducts={[]}
            setSelectedProducts={() => { }}
            locationOptions={locationOptions}
            categoryOptions={categoryOptions}
            productOptions={productOptions}
            exportCSV={exportCSV}
            exportPDF={exportPDF}
            setView={() => { }}
        />
    );
};

interface DateFiltersProps {
    view: string;
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
    locationOptions: Option[];
    categoryOptions: Option[];
    productOptions: Option[];
    exportCSV: () => void;
    exportPDF: () => void;
    setView: (view: string) => void;
}

const DateFiltersExports = ({
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
}: DateFiltersProps) => {
    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);

    const locationRef = useRef<HTMLDivElement | null>(null);
    const categoryRef = useRef<HTMLDivElement | null>(null);
    const productRef = useRef<HTMLDivElement | null>(null);

    const [filteredProducts, setFilteredProducts] = useState<Option[]>(productOptions || []);
    const [filteredCategories, setFilteredCategories] = useState<Option[]>(categoryOptions || []);

    // Filter products based on selected categories
    useEffect(() => {
        if ((selectedCategories || []).length > 0) {
            const filtered = (productOptions || []).filter(
                (product) => product.category && selectedCategories.includes(product.category)
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(productOptions || []);
        }
    }, [selectedCategories, productOptions]);

    // Filter categories based on selected products
    useEffect(() => {
        if ((selectedProducts || []).length > 0) {
            const categories = [
                ...new Set(
                    (selectedProducts || [])
                        .map((id) => (productOptions || []).find((p) => p.value === id)?.category)
                        .filter(Boolean)
                ),
            ];
            const filtered = (categoryOptions || []).filter((c) => categories.includes(c.value));
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categoryOptions || []);
        }
    }, [selectedProducts, productOptions, categoryOptions]);

    // Click outside to close dropdowns
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) {
                setShowLocations(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
                setShowCategories(false);
            }
            if (productRef.current && !productRef.current.contains(event.target as Node)) {
                setShowProducts(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex gap-2 items-center px-2 py-1 flex-wrap">
                <label className="flex h-8 items-center gap-2">
                    Start Date:
                    <input
                        type="date"
                        value={startDate?.toISOString().substring(0, 10) || ""}
                        onChange={(e) =>
                            setStartDate(e.target.value ? new Date(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 text-sm hover:bg-gray-200"
                    />
                </label>
                <label className="flex h-8 items-center gap-2">
                    End Date:
                    <input
                        type="date"
                        value={endDate?.toISOString().substring(0, 10) || ""}
                        onChange={(e) =>
                            setEndDate(e.target.value ? new Date(e.target.value) : null)
                        }
                        className="border rounded px-2 py-1 text-sm hover:bg-gray-200"
                    />
                </label>
            </div>

            <div className="flex gap-2 flex-wrap">
                {/* Locations */}
                <div ref={locationRef}>
                    <button
                        onClick={() => setShowLocations(!showLocations)}
                        className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer"
                    >
                        Select Locations
                    </button>
                    {showLocations && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-35">
                            <button
                                onClick={() => setSelectedLocations([])}
                                className="text-sm text-blue-500 hover:underline cursor-pointer mb-2"
                            >
                                Clear Selection
                            </button>
                            {(locationOptions || []).map((option, idx) => (
                                <div key={`${option.value}-${idx}`} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={option.value}
                                        checked={(selectedLocations || []).includes(option.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedLocations([
                                                    ...(selectedLocations || []),
                                                    option.value,
                                                ]);
                                            } else {
                                                setSelectedLocations(
                                                    (selectedLocations || []).filter((l) => l !== option.value)
                                                );
                                            }
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className="border rounded px-2 py-1 text-sm hover:bg-gray-200"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Categories */}
                <div ref={categoryRef}>
                    <button
                        onClick={() => setShowCategories(!showCategories)}
                        className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer"
                    >
                        Select Categories
                    </button>
                    {showCategories && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-37">
                            <button
                                onClick={() => setSelectedCategories([])}
                                className="text-sm text-blue-500 hover:underline cursor-pointer mb-2"
                            >
                                Clear Selection
                            </button>
                            {(filteredCategories || []).map((option, idx) => (
                                <div key={`${option.value}-${idx}`} className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id={option.value}
                                        checked={(selectedCategories || []).includes(option.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedCategories([
                                                    ...(selectedCategories || []),
                                                    option.value,
                                                ]);
                                            } else {
                                                setSelectedCategories(
                                                    (selectedCategories || []).filter((c) => c !== option.value)
                                                );
                                            }
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className="text-sm hover:bg-gray-200 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Products */}
                <div ref={productRef}>
                    <button
                        onClick={() => setShowProducts(!showProducts)}
                        className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer"
                    >
                        Select Products
                    </button>
                    {showProducts && (
                        <div className="p-2 border rounded mt-2 absolute bg-white z-10 w-35 h-48 overflow-y-auto">
                            <button
                                onClick={() => setSelectedProducts([])}
                                className="text-sm text-blue-500 hover:underline cursor-pointer mb-2"
                            >
                                Clear Selection
                            </button>
                            {(filteredProducts || []).map((option, idx) => (
                                <div key={`${option.value}-${idx}`} className="flex items-center gap-3 mr-2">
                                    <input
                                        type="checkbox"
                                        id={option.value}
                                        checked={(selectedProducts || []).includes(option.value)}
                                        onChange={(e) => {
                                            if (e.target.checked) {
                                                setSelectedProducts([...(selectedProducts || []), option.value]);
                                            } else {
                                                setSelectedProducts((selectedProducts || []).filter((p) => p !== option.value));
                                            }
                                        }}
                                        className="w-4 h-4 cursor-pointer"
                                    />
                                    <label
                                        htmlFor={option.value}
                                        className="text-sm hover:bg-gray-200 cursor-pointer"
                                    >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="flex gap-2 flex-wrap">
                <button
                    onClick={exportCSV}
                    className="px-2 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer"
                >
                    Export CSV
                </button>
                <button
                    onClick={exportPDF}
                    className="px-2 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer"
                >
                    Export PDF
                </button>
            </div>
        </div>
    );
};

export default DateFiltersWrapper;
