"use client";

import { useEffect, useState } from "react";
import MultiSelect, { MultiSelectOption } from "./Multiselect/MultiSelect";

export interface ClientFilters {
    products: string[];
    categories: string[];
    users: string[];
    locations: string[];
    search?: string;
}

interface FiltersClientProps {
    onChange?: (filters: ClientFilters) => void;
}

export default function FiltersClient({ onChange }: FiltersClientProps) {
    const [products, setProducts] = useState<MultiSelectOption[]>([]);
    const [categories, setCategories] = useState<MultiSelectOption[]>([]);
    const [users, setUsers] = useState<MultiSelectOption[]>([]);
    const [locations, setLocations] = useState<MultiSelectOption[]>([]);

    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [search, setSearch] = useState("");

    // Fetch options client-side
    useEffect(() => {
        fetch("/api/options/products").then(r => r.json()).then(setProducts);
        fetch("/api/options/categories").then(r => r.json()).then(setCategories);
        fetch("/api/options/users").then(r => r.json()).then(setUsers);
        fetch("/api/options/locations").then(r => r.json()).then(setLocations);
    }, []);

    // Notify parent when filters change
    useEffect(() => {
        onChange?.({
            products: selectedProducts,
            categories: selectedCategories,
            users: selectedUsers,
            locations: selectedLocations,
            search,
        });
    }, [selectedProducts, selectedCategories, selectedUsers, selectedLocations, search]);

    return (
        <div className="space-y-4 mb-5">
            {/* Search input */}
            <input
                type="text"
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border px-3 py-2 rounded-md"
            />

            {/* Filters container */}
            <div className="flex flex-col gap-5 sm:flex-row sm:gap-4 sm:flex-wrap">
                <div className="flex-1 min-w-[200px] gap-5">
                    <MultiSelect
                        label="Products"
                        options={products}
                        value={selectedProducts}
                        onChange={setSelectedProducts}
                    />
                </div>
                <div className="flex-1 min-w-[200px] gap-5">
                    <MultiSelect
                        label="Categories"
                        options={categories}
                        value={selectedCategories}
                        onChange={setSelectedCategories}
                    />
                </div>
                <div className="flex-1 min-w-[200px] gap-5">
                    <MultiSelect
                        label="Users"
                        options={users}
                        value={selectedUsers}
                        onChange={setSelectedUsers}
                    />
                </div>
                <div className="flex-1 min-w-[200px] gap-5">
                    <MultiSelect
                        label="Locations"
                        options={locations}
                        value={selectedLocations}
                        onChange={setSelectedLocations}
                    />
                </div>
            </div>
        </div>
    );
}
