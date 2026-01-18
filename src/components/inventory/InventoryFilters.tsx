"use client";

import MultiSelect from "@/components/Multiselect/MultiSelect";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function InventoryFilters({
    uniqueLocations,
    products,
    categories,
    query,
    setQuery,
    locations,
    setLocations,
    selectedProducts,
    setSelectedProducts,
    selectedCategories,
    setSelectedCategories,
    inventoryData,
}: {
    uniqueLocations: { id: string; name: string }[];
    products: { id: string; name: string }[];
    categories: { id: string; name: string }[];
    query: string;
    setQuery: (q: string) => void;
    locations: string[];
    setLocations: (l: string[]) => void;
    selectedProducts: string[];
    setSelectedProducts: (p: string[]) => void;
    selectedCategories: string[];
    setSelectedCategories: (c: string[]) => void;
    inventoryData: any[];
}) {
    const exportCSV = () => {
        if (!inventoryData || !inventoryData.length) return;

        const csvContent = [
            "Product,SKU,PackSize,WeightValue,WeightUnit,Category,Location,Price,Quantity,Tonnage,Value,LowStockAt,ExpiryDate,AssignedUser,CreatedBy,CreatedAt,UpdatedAt",
            ...inventoryData.map((i) =>
                [
                    i.product?.name ?? "",
                    i.product?.sku ?? "",
                    i.product?.packSize ?? 0,
                    (i.product?.weightValue ?? 0).toFixed(2),
                    i.product?.weightUnit ?? "kg",
                    i.product?.category ?? "",
                    i.location?.name ?? "",
                    (i.product?.price ?? 0).toFixed(2),
                    i.quantity ?? 0,
                    (i.tonnage ?? 0).toFixed(2),
                    (i.value ?? 0).toFixed(2),
                    i.lowStockAt ?? "",
                    i.expiryDate ?? "",
                    i.assignedUser?.fullName ?? "",
                    i.createdBy?.fullName ?? "",
                    new Date(i.createdAt).toLocaleDateString(),
                    new Date(i.updatedAt).toLocaleDateString(),
                ].join(",")
            ),
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_filtered.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    const exportPDF = () => {
        if (!inventoryData || !inventoryData.length) return;

        const doc = new jsPDF();
        autoTable(doc, {
            head: [["Product", "SKU", "PackSize", "WeightValue", "WeightUnit", "Category", "Location", "Price", "Quantity", "Tonnage", "Value", "LowStockAt", "ExpiryDate", "AssignedUser", "CreatedBy", "CreatedAt", "UpdatedAt"]],
            body: inventoryData.map((i) => [
                i.product?.name ?? "",
                i.product?.sku ?? "",
                i.product?.packSize ?? 0,
                (i.product?.weightValue ?? 0).toFixed(2),
                i.product?.weightUnit ?? "kg",
                i.product?.category ?? "",
                i.location?.name ?? "",
                (i.product?.price ?? 0).toFixed(2),
                i.quantity ?? 0,
                (i.tonnage ?? 0).toFixed(2),
                (i.value ?? 0).toFixed(2),
                i.lowStockAt ?? "",
            ]),
        });
        doc.save("inventory_filtered.pdf");
    };

    return (
        <div className="p-2 space-y-2">
            {/* Search */}

            {/*
            <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search product..."
                className="border border-gray-200 bg-white rounded-md px-3 py-2 w-full"
            />
            */}

            {/* Filters */}
            <div className="font-bold">
                <h2>Filters and Exports</h2>
            </div>
            <div className="flex flex-wrap gap-4">
                <MultiSelect label="Locations" options={uniqueLocations || []} value={locations} onChange={setLocations} />
                <MultiSelect label="Products" options={products || []} value={selectedProducts} onChange={setSelectedProducts} />
                <MultiSelect label="Categories" options={categories || []} value={selectedCategories} onChange={setSelectedCategories} />

                {/* Export Buttons */}
                <div className="mt-6">
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                    >
                        Export CSV
                    </button>
                </div>

                <div className="mt-6">
                    <button
                        onClick={exportPDF}
                        className="px-4 py-2 border rounded-md text-sm bg-gray-100 hover:bg-gray-200"
                    >
                        Export PDF
                    </button>
                </div>
            </div>
        </div>
    );
}
