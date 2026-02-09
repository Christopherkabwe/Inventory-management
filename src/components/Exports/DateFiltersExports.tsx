"use client";

import { useState, useRef, useEffect, useMemo, forwardRef } from "react";
import { Sale } from "@/components/sales/Sale";
import { Calendar } from "../search/Calendar";
import { MultiLocationCombobox } from "../MultiSelectComboBox/MultiLocationComboBox";

// ----------------- Types -----------------
interface Location {
    id: string;
    name: string;
    address?: string;
}

interface Category {
    id: string;
    name: string;
    category: string | null;

}

interface Product {
    id: string;
    name: string;
    category: string | null;
}

interface User {
    id: string;
    name: string;
    locationId: string | null;
}

interface Props {
    startDate: Date | null;
    endDate: Date | null;
    setStartDate: (date: Date | null) => void;
    setEndDate: (date: Date | null) => void;

    selectedLocations: string[];
    setSelectedLocations: (ids: string[]) => void;

    selectedCategories: string[];
    setSelectedCategories: (ids: string[]) => void;

    selectedProducts: string[];
    setSelectedProducts: (ids: string[]) => void;

    selectedUsers: string[];
    setSelectedUsers: (ids: string[]) => void;

    locationOptions: Location[];
    categoryOptions: Category[]; // just array of strings
    productOptions: Product[];
    userOptions: User[];

    exportCSV: () => void;
    exportPDF: () => void;
}

// ----------------- Component -----------------
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
    selectedUsers,
    setSelectedUsers,
    locationOptions,
    categoryOptions,
    productOptions,
    userOptions,
    exportCSV,
    exportPDF,
}: Props) => {
    const [showLocations, setShowLocations] = useState(false);
    const [showCategories, setShowCategories] = useState(false);
    const [showProducts, setShowProducts] = useState(false);
    const [showUsers, setShowUsers] = useState(false);

    const locationRef = useRef<HTMLDivElement>(null);
    const categoryRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);
    const userRef = useRef<HTMLDivElement>(null);

    // ----------------- Filtered Products -----------------
    const filteredProducts = useMemo(() => {
        if (selectedCategories.length === 0) return productOptions;
        return productOptions.filter((p) => selectedCategories.includes(p.category ?? ""));
    }, [productOptions, selectedCategories]);

    // ----------------- Filtered Categories -----------------
    const filteredCategories = useMemo(() => {
        if (selectedProducts.length === 0) return categoryOptions;

        const categoriesInProducts = new Set(
            selectedProducts
                .map((pid) => productOptions.find((p) => p.id === pid)?.category)
                .filter(Boolean) as string[]
        );

        return categoryOptions.filter((c) => categoriesInProducts.has(c));
    }, [selectedProducts, productOptions, categoryOptions]);

    // ---------------- CLOSE DROPDOWNS ON OUTSIDE CLICK ----------------
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (locationRef.current && !locationRef.current.contains(event.target as Node)) setShowLocations(false);
            if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) setShowCategories(false);
            if (productRef.current && !productRef.current.contains(event.target as Node)) setShowProducts(false);
            if (userRef.current && !userRef.current.contains(event.target as Node)) setShowUsers(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // ---------------- DATE HANDLERS ----------------
    const formatDateForInput = (date: Date | null) => {
        if (!date) return "";
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
    };
    const handleStartDateChange = (value: string) => setStartDate(value ? new Date(`${value}T00:00:00`) : null);
    const handleEndDateChange = (value: string) => setEndDate(value ? new Date(`${value}T23:59:59`) : null);

    // ---------------- RENDER ----------------
    return (
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between mb-2 gap-2">
            {/* Date Pickers */}
            <div className="flex flex-row border border-gray-300 rounded gap-2 w-full xl:w-auto">
                <label className="flex items-center gap-2 px-2 h-8 flex-1 xl:flex-none min-w-0 cursor-pointer">
                    <span className="whitespace-nowrap text-sm">Start :</span>
                    <input
                        type="date"
                        value={formatDateForInput(startDate)}
                        onChange={(e) => handleStartDateChange(e.target.value)}
                        className="text-sm w-full min-w-0 hover:bg-gray-100 cursor-pointer"
                    />
                </label>
                <label className="flex items-center gap-2 py-1 px-2 h-8 flex-1 xl:flex-none min-w-0 cursor-pointer">
                    <span className="whitespace-nowrap text-sm">End :</span>
                    <input
                        type="date"
                        value={formatDateForInput(endDate)}
                        onChange={(e) => handleEndDateChange(e.target.value)}
                        className="text-sm w-full min-w-0 hover:bg-gray-100 cursor-pointer"
                    />
                </label>
            </div>

            {/* Dropdown Filters */}
            <div className="grid grid-cols-1 xl:grid-cols-4 gap-2 w-full xl:w-auto">
                {/* Locations */}
                <DropdownFilter
                    ref={locationRef}
                    label="Locations"
                    options={locationOptions}
                    selected={selectedLocations}
                    setSelected={setSelectedLocations}
                    show={showLocations}
                    setShow={setShowLocations}
                />
                {/* Categories */}
                <DropdownFilter
                    ref={categoryRef}
                    label="Categories"
                    options={filteredCategories.map((c) => ({ id: c, name: c }))}
                    selected={selectedCategories}
                    setSelected={setSelectedCategories}
                    show={showCategories}
                    setShow={setShowCategories}
                />

                {/* Products */}
                <DropdownFilter
                    ref={productRef}
                    label="Products"
                    options={filteredProducts}
                    selected={selectedProducts}
                    setSelected={setSelectedProducts}
                    show={showProducts}
                    setShow={setShowProducts}
                />

                {/* Users */}
                <DropdownFilter
                    ref={userRef}
                    label="Users"
                    options={userOptions}
                    selected={selectedUsers}
                    setSelected={setSelectedUsers}
                    show={showUsers}
                    setShow={setShowUsers}
                />
            </div>

            {/* Export Buttons */}
            <div className="flex flex-row gap-2 w-full xl:w-auto">
                <button onClick={exportCSV} className="px-2 py-1 h-8 text-xs border rounded hover:bg-gray-200 cursor-pointer">
                    Export CSV
                </button>
                <button onClick={exportPDF} className="px-2 py-1 h-8 text-xs border rounded hover:bg-gray-200 cursor-pointer">
                    Export PDF
                </button>
            </div>
        </div>
    );
};

export default DateFiltersExports;

// ----------------- Generic DropdownFilter -----------------
interface DropdownFilterProps<T extends { id: string; name: string }> {
    label: string;
    options: T[];
    selected: string[];
    setSelected: (ids: string[]) => void;
    show: boolean;
    setShow: (show: boolean) => void;
}

const DropdownFilter = forwardRef<HTMLDivElement, DropdownFilterProps<any>>(
    ({ label, options, selected, setSelected, show, setShow }, ref) => {
        const handleCheckboxChange = (id: string) => {
            if (selected.includes(id)) {
                setSelected(selected.filter((s) => s !== id));
            } else {
                setSelected([...selected, id]);
            }
        };

        return (
            <div ref={ref} className="relative flex-1 min-w-0 xl:flex-none">
                <button
                    onClick={() => setShow(!show)}
                    className="w-full px-3 py-1 h-8 border border-gray-300 rounded hover:bg-gray-200 text-sm truncate"
                >
                    Select {label}
                </button>
                {show && (
                    <div className="absolute z-20 mt-1 w-full max-w-xs bg-white border rounded p-2 max-h-48 overflow-y-auto">
                        <button
                            onClick={() => setSelected([])}
                            className="text-sm text-blue-500 hover:underline mb-2"
                        >
                            Clear Selection
                        </button>
                        {options.map((opt) => (
                            <label key={opt.id} className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={selected.includes(opt.id)}
                                    onChange={() => handleCheckboxChange(opt.id)}
                                />
                                <span className="truncate">{opt.name}</span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        );
    }
);

DropdownFilter.displayName = "DropdownFilter";
