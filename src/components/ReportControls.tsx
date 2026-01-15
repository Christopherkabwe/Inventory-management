// components/ReportControls.tsx
"use client";

import React from "react";
import MultiSelect, { MultiSelectOption } from "./Dropdowns/MultiSelect";
import { ExportButton } from "./ExportButton";
import { ExportHeader } from "../lib/ExportUtils";

interface ReportControlsProps<T> {
    // Multi-select options
    productOptions: MultiSelectOption[];
    locationOptions: MultiSelectOption[];
    categoryOptions: MultiSelectOption[];

    // Selected values + setters
    selectedProducts: string[];
    setSelectedProducts: (vals: string[]) => void;

    selectedLocations: string[];
    setSelectedLocations: (vals: string[]) => void;

    selectedCategory: string[];
    setSelectedCategory: (vals: string[]) => void;

    // Export
    headers: ExportHeader<T>[];
    data: T[];
}

export function ReportControls<T>({
    productOptions,
    locationOptions,
    categoryOptions,
    selectedProducts,
    setSelectedProducts,
    selectedLocations,
    setSelectedLocations,
    selectedCategory,
    setSelectedCategory,
    headers,
    data,
}: ReportControlsProps<T>) {
    return (
        <div className="bg-white gap-4 rounded-lg p-5 w-full">
            <div className="text-lg font-semibold mb-2">Filters & Export</div>

            <div className="flex flex-wrap gap-4" >

                <MultiSelect
                    label="Select Products"
                    options={productOptions}
                    value={selectedProducts}
                    onChange={(vals) => setSelectedProducts(vals)
                    }
                    placeholder="All Products"
                />

                <MultiSelect
                    label="Select Locations"
                    options={locationOptions}
                    value={selectedLocations}
                    onChange={(vals) => setSelectedLocations(vals)}
                    placeholder="All Locations"
                />

                <MultiSelect
                    label="Select Categories"
                    options={categoryOptions}
                    value={selectedCategory}
                    onChange={(vals) => setSelectedCategory(vals)}
                    placeholder="All Categories"
                />

                <ExportButton
                    type="csv"
                    headers={headers}
                    data={data}
                    filename="stock-report.csv"
                    label="Export CSV"
                />

                <ExportButton
                    type="pdf"
                    headers={headers}
                    data={data}
                    filename="stock-report.pdf"
                    label="Export PDF"
                    title="Stock Report"
                    mode="landscape"
                />

            </div>
        </div>
    );
}
