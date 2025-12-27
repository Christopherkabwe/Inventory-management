"use client";

import { useState } from "react";
import { FilterState } from "@/types/filters";

interface Props {
    locations?: { id: string; name: string }[];
    categories?: { id: string; name: string }[];
    products?: { id: string; name: string }[];

    onChange: (filters: FilterState) => void;
    onExportCSV?: () => void;
    onExportPDF?: () => void;
}

export default function DateFiltersExports2({
    locations = [],
    categories = [],
    products = [],
    onChange,
    onExportCSV,
    onExportPDF,
}: Props) {
    const [filters, setFilters] = useState<FilterState>({
        startDate: null,
        endDate: null,
        locationIds: [],
        categoryIds: [],
        productIds: [],
    });

    function update<K extends keyof FilterState>(key: K, value: FilterState[K]) {
        const next = { ...filters, [key]: value };
        setFilters(next);
        onChange(next);
    }

    return (
        <div className="flex flex-wrap items-center gap-3">
            {/* Date range */}
            <div className="flex items-center gap-2">
                <label className="text-sm">Start Date:</label>
                <input
                    type="date"
                    onChange={(e) =>
                        update("startDate", e.target.value ? new Date(e.target.value) : null)
                    }
                    className="border rounded px-2 py-1 text-sm"
                />

                <label className="text-sm">End Date:</label>
                <input
                    type="date"
                    onChange={(e) =>
                        update("endDate", e.target.value ? new Date(e.target.value) : null)
                    }
                    className="border rounded px-2 py-1 text-sm"
                />
            </div>

            {/* Location filter */}
            {locations.length > 0 && (
                <select
                    multiple
                    className="border rounded px-2 py-1 text-sm"
                    onChange={(e) =>
                        update(
                            "locationIds",
                            Array.from(e.target.selectedOptions).map((o) => o.value)
                        )
                    }
                >
                    {locations.map((l) => (
                        <option key={l.id} value={l.id}>
                            {l.name}
                        </option>
                    ))}
                </select>
            )}

            {/* Category filter */}
            {categories.length > 0 && (
                <select
                    multiple
                    className="border rounded px-2 py-1 text-sm"
                    onChange={(e) =>
                        update(
                            "categoryIds",
                            Array.from(e.target.selectedOptions).map((o) => o.value)
                        )
                    }
                >
                    {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                            {c.name}
                        </option>
                    ))}
                </select>
            )}

            {/* Product filter */}
            {products.length > 0 && (
                <select
                    multiple
                    className="border rounded px-2 py-1 text-sm"
                    onChange={(e) =>
                        update(
                            "productIds",
                            Array.from(e.target.selectedOptions).map((o) => o.value)
                        )
                    }
                >
                    {products.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            )}

            {/* Export buttons */}
            <div className="ml-auto flex gap-2">
                {onExportCSV && (
                    <button onClick={onExportCSV} className="btn-secondary">
                        Export CSV
                    </button>
                )}
                {onExportPDF && (
                    <button onClick={onExportPDF} className="btn-secondary">
                        Export PDF
                    </button>
                )}
            </div>
        </div>
    );
}
