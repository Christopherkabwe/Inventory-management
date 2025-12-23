"use client";
import { useState, useRef, useEffect } from "react";
import { MapPin, User, Package } from "lucide-react";

interface Props {
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
    locationOptions: { value: string; label: string }[];
    categoryOptions: { value: string; label: string }[];
    productOptions: { value: string; label: string }[];
    exportCSV: () => void;
    exportPDF: () => void;
    setView: (view: string) => void;
}

const DateFiltersExports = ({
    view,
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
    setView,
}: Props) => {
    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const locationRef = useRef(null);
    const categoryRef = useRef(null);
    const productRef = useRef(null);

    const [filteredProducts, setFilteredProducts] = useState(productOptions);
    const [filteredCategories, setFilteredCategories] = useState(categoryOptions);

    useEffect(() => {
        if (selectedCategories.length > 0) {
            const filtered = productOptions.filter((product) => {
                return selectedCategories.includes(product.category);
            });
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(productOptions);
        }
    }, [selectedCategories, productOptions]);

    useEffect(() => {
        if (selectedProducts.length > 0) {
            const categories = [...new Set(selectedProducts.map((productId) => {
                const product = productOptions.find((p) => p.value === productId);
                return product?.category;
            }))];
            const filtered = categoryOptions.filter((category) => {
                return categories.includes(category.value);
            });
            setFilteredCategories(filtered);
        } else {
            setFilteredCategories(categoryOptions);
        }
    }, [selectedProducts, productOptions, categoryOptions]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (locationRef.current && !locationRef.current.contains(event.target)) {
                setShowLocations(false);
            }
            if (categoryRef.current && !categoryRef.current.contains(event.target)) {
                setShowCategories(false);
            }
            if (productRef.current && !productRef.current.contains(event.target)) {
                setShowProducts(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="flex flex-wrap items-center justify-between mb-4 gap-2">
            <div className="flex gap-2 items-center rounded border bg-gray-30 px-2 py-1 flex-wrap">
                <h2 className="font-semibold">Date Range:</h2>
                <label className="flex items-center gap-2">
                    Start Date:
                    <input type="date" value={startDate?.toISOString().substring(0, 10) || ""} onChange={e => setStartDate(e.target.value ? new Date(e.target.value) : null)} className="border rounded px-2 py-1 text-sm hover:bg-gray-200" />
                </label>
                <label className="flex items-center gap-2">
                    End Date:
                    <input type="date" value={endDate?.toISOString().substring(0, 10) || ""} onChange={e => setEndDate(e.target.value ? new Date(e.target.value) : null)} className="border rounded px-2 py-1 text-sm hover:bg-gray-200" />
                </label>
            </div>
            <div className="flex gap-2 flex-wrap">
                <div ref={locationRef}>
                    <button onClick={() => setShowLocations(!showLocations)} className="px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer">Select Locations</button>
                    {showLocations && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-35">
                            <button onClick={() => setSelectedLocations([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2">Clear Selection</button>
                            {locationOptions.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <input type="checkbox" id={option.value} checked={selectedLocations.includes(option.value)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedLocations([...selectedLocations, option.value]);
                                        } else {
                                            setSelectedLocations(selectedLocations.filter((l) => l !== option.value));
                                        }
                                    }} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.value} className="border rounded px-2 py-1 text-sm hover:bg-gray-200">{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div ref={categoryRef}>
                    <button onClick={() => setShowCategories(!showCategories)} className="px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer">Select Categories</button>
                    {showCategories && (
                        <div className="p-2 border rounded mt-1 absolute bg-white z-10 w-37">
                            <button onClick={() => setSelectedCategories([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2">Clear Selection</button>
                            {filteredCategories.map((option) => (
                                <div key={option.value} className="flex items-center gap-2">
                                    <input type="checkbox" id={option.value} checked={selectedCategories.includes(option.value)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedCategories([...selectedCategories, option.value]);
                                        } else {
                                            setSelectedCategories(selectedCategories.filter((c) => c !== option.value));
                                        }
                                    }} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.value} className="text-sm hover:bg-gray-200 cursor-pointer">{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <div ref={productRef}>
                    <button onClick={() => setShowProducts(!showProducts)} className="px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer">Select Products</button>
                    {showProducts && (
                        <div className="p-2 border rounded mt-2 absolute bg-white z-10 w-35 h-48 overflow-y-auto">
                            <button onClick={() => setSelectedProducts([])} className="text-sm text-blue-500 hover:underline cursor-pointer mb-2">Clear Selection</button>
                            {filteredProducts.map((option) => (
                                <div key={option.value} className="flex items-center gap-3 mr-2">
                                    <input type="checkbox" id={option.value} checked={selectedProducts.includes(option.value)} onChange={(e) => {
                                        if (e.target.checked) {
                                            setSelectedProducts([...selectedProducts, option.value]);
                                        } else {
                                            setSelectedProducts(selectedProducts.filter((p) => p !== option.value));
                                        }
                                    }} className="w-4 h-4 cursor-pointer" />
                                    <label htmlFor={option.value} className="text-sm hover:bg-gray-200 cursor-pointer">{option.label}</label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-2 flex-wrap">
                <button onClick={exportCSV} className="px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer">Export CSV</button>
                <button onClick={exportPDF} className="px-3 py-1 border rounded hover:bg-gray-200 cursor-pointer">Export PDF</button>
            </div>
        </div>
    );
};

export default DateFiltersExports;