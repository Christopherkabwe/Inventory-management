"use client";

import { useMemo, useState } from "react";
import DateFiltersExports2 from "@/components/DateFiltersExports2";
import { FilterState } from "@/types/filters";

export default function TestPageClient({
    inventory = [],
    locations = [],
    categories = [],
    products = [],
}: any) {
    const [filters, setFilters] = useState<FilterState>({
        startDate: null,
        endDate: null,
        locationIds: [],
        categoryIds: [],
        productIds: [],
    });

    const filteredInventory = useMemo(() => {
        return inventory.filter((item: any) => {
            if (
                filters.locationIds?.length &&
                !filters.locationIds.includes(item.locationId)
            ) return false;

            if (
                filters.productIds?.length &&
                !filters.productIds.includes(item.productId)
            ) return false;

            if (
                filters.categoryIds?.length &&
                !filters.categoryIds.includes(item.product?.category)
            ) return false;

            return true;
        });
    }, [inventory, filters]);

    return (
        <DateFiltersExports2
            locations={locations}
            categories={categories}
            products={products}
            onChange={setFilters}
        />
    );
}
