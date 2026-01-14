// FiltersWrapper.tsx
"use client"; // <-- REQUIRED for useState/useEffect
import { useState } from "react";
import Filters from "@/components/FiltersClient";
import InventoryTable from "@/components/InventoryTable";
import InventorySummary from "./InventorySummary";

export default function FiltersWrapper({ products, categories, users, locations }) {
    const [filteredData, setFilteredData] = useState([]);

    const handleFilterChange = async (filters) => {
        const params = new URLSearchParams();
        for (const key of ["products", "categories", "users", "locations"]) {
            filters[key].forEach((v) => params.append(key, v));
        }
        if (filters.search) params.append("search", filters.search);

        const res = await fetch(`/api/inventoryTest?${params.toString()}`);
        const data = await res.json();
        console.log(data)
        setFilteredData(data.inventories);
    };

    return (
        <>
            <Filters
                products={products}
                categories={categories}
                users={users}
                locations={locations}
                onFilterChange={handleFilterChange}
            />
            <InventorySummary
                title="Inventory Summary"
                iconColor="blue"
            />
        </>
    );
}
