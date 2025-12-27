"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { Sale } from "@/components/Sale";

interface Props {
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
    sales: Sale[];
    exportCSV: () => void;
    exportPDF: () => void;
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
    sales,
    exportCSV,
    exportPDF,
}: Props) => {
    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);

    const locationRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);


    // ---------------- PRODUCT OPTIONS ----------------
    const products = useMemo(() => {
        if (!sales || sales.length === 0) return [];
        const productMap = new Map<string, { id: string; name: string; category: string | null }>();
        sales.forEach((sale) => {
            if (sale.product && !productMap.has(sale.productId)) {
                productMap.set(sale.productId, {
                    id: sale.productId,
                    name: sale.product.name,
                    category: sale.product.category ?? null,
                });
            }
        });
        return Array.from(productMap.values());
    }, [sales]);


    // Filter products based on selected categories
    useEffect(() => {
        if (selectedCategories.length > 0) {
            setFilteredProducts(
                products.filter((p) =>
                    selectedCategories.includes(p.category ?? "")
                )
            );
        } else {
            setFilteredProducts(products);
        }
    }, [products, selectedCategories]);


    // ---------------- FILTERED STATE ----------------
    const [filteredCategories, setFilteredCategories] = useState(categoryOptions);
    const [filteredProducts, setFilteredProducts] = useState(products);

    // Filter products based on selected categories
    useEffect(() => {
        setFilteredProducts(products);
    }, [products]);

    // Filter categories based on selected products
    useEffect(() => {
        if (selectedProducts.length > 0) {
            const categories = Array.from(
                new Set(
                    selectedProducts
                        .map((id) => products.find((p) => p.id === id)?.category)
                        .filter(Boolean)
                )
            ) as string[];
            setFilteredCategories(categoryOptions.filter((c) => categories.includes(c.value)));
        } else {
            setFilteredCategories(categoryOptions);
        }
    }, [selectedProducts, products, categoryOptions]);

    // ---------------- CLOSE DROPDOWNS ON OUTSIDE CLICK ----------------
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
    }, [locationRef, categoryRef, productRef]);

    // ---------------- DATE HANDLERS ----------------
    const formatDateForInput = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };

    const handleStartDateChange = (value: string) => {
        setStartDate(value ? new Date(`${value}T00:00:00`) : null);
    };
    const handleEndDateChange = (value: string) => {
        setEndDate(value ? new Date(`${value}T23:59:59`) : null);
    };

    return (
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-2 gap-2">
            {/* Date Pickers */}
            <div className="flex flex-wrap gap-2 items-center px-2 py-1 w-full xl:w-auto">
                <label className="flex h-8 items-center gap-2">
                    Start Date:
                    <input type="date" value={formatDateForInput(startDate)} onChange={(e) => handleStartDateChange(e.target.value)} className="border rounded px-2 py-1 text-sm hover:bg-gray-200" />
                </label>
                <label className="flex h-8 items-center gap-2">
                    End Date:
                    <input type="date" value={formatDateForInput(endDate)} onChange={(e) => handleEndDateChange(e.target.value)} className="border rounded px-2 py-1 text-sm hover:bg-gray-200" />
                </label>
            </div>
            {/* Dropdown Filters */}
            <div className="flex flex-wrap gap-2 w-full xl:w-auto">
                {/* Locations */}
                <div ref={locationRef} className="relative">
                    <button onClick={() => setShowLocations(!showLocations)} className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer" >
                        Select Locations
                    </button>
                    {showLocations && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-36 max-h-48 overflow-y-auto">
                            <button onClick={() => setSelectedLocations([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2" >
                                Clear Selection
                            </button>
                            {locationOptions.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <input type="checkbox" id={option.value} checked={selectedLocations.includes(option.value)} onChange={(e) => e.target.checked ? setSelectedLocations([...selectedLocations, option.value]) : setSelectedLocations(selectedLocations.filter((l) => l !== option.value))} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.value} className="px-2 py-1 text-sm hover:bg-gray-200 cursor-pointer" >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Categories */}
                <div ref={categoryRef} className="relative">
                    <button onClick={() => setShowCategories(!showCategories)} className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer" >
                        Select Categories
                    </button>
                    {showCategories && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-36 max-h-48 overflow-y-auto">
                            <button onClick={() => setSelectedCategories([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2" >
                                Clear Selection
                            </button>
                            {filteredCategories.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <input type="checkbox" id={option.value} checked={selectedCategories.includes(option.value)} onChange={(e) => e.target.checked ? setSelectedCategories([...selectedCategories, option.value]) : setSelectedCategories(selectedCategories.filter((c) => c !== option.value))} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.value} className="text-sm hover:bg-gray-200 cursor-pointer" >
                                        {option.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Products */}
                <div ref={productRef} className="relative">
                    <button onClick={() => setShowProducts(!showProducts)} className="px-3 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer" >
                        Select Products
                    </button>
                    {showProducts && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-36 max-h-48 overflow-y-auto">
                            <button onClick={() => setSelectedProducts([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2" >
                                Clear Selection
                            </button>
                            {filteredProducts.map((option) => (
                                <div key={option.id} className="flex items-center gap-2">
                                    <input type="checkbox" id={option.id} checked={selectedProducts.includes(option.id)} onChange={(e) => e.target.checked ? setSelectedProducts([...selectedProducts, option.id]) : setSelectedProducts(selectedProducts.filter((p) => p !== option.id))} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.id} className="text-sm hover:bg-gray-200 cursor-pointer" >
                                        {option.name}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {/* Export Buttons */}
            <div className="flex gap-2 flex-wrap w-full xl:w-auto">
                <button onClick={exportCSV} className="px-2 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer" >
                    Export CSV
                </button>
                <button onClick={exportPDF} className="px-2 py-1 h-8 border rounded hover:bg-gray-200 cursor-pointer" >
                    Export PDF
                </button>
            </div>
        </div>
    );
};

export default DateFiltersExports;
