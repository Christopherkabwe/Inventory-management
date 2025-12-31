"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Inventory, ProductList, Location } from "@prisma/client";

type InventoryItem = Inventory & {
    product: ProductList;
    location: Location;
};

export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterProduct, setFilterProduct] = useState("");
    const [filterLocation, setFilterLocation] = useState("");

    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch("/api/inventory/raw");
                const data = await res.json();
                setInventory(data);
            } catch (err) {
                console.error("Failed to fetch inventory", err);
            } finally {
                setLoading(false);
            }
        };
        fetchInventory();
    }, []);

    // Filtered data based on search inputs
    const filteredInventory = useMemo(() => {
        return inventory.filter(
            (item) =>
                item.product.name.toLowerCase().includes(filterProduct.toLowerCase()) &&
                item.location.name.toLowerCase().includes(filterLocation.toLowerCase())
        );
    }, [inventory, filterProduct, filterLocation]);

    // Export visible table to CSV
    const exportCSV = () => {
        const headers = [
            "Product",
            "SKU",
            "Pack Size",
            "Weight",
            "Location",
            "Quantity",
            "Low Stock At",
            "Expiry Date",
            "Created By",
            "Created At",
            "Updated At",
        ];
        const rows = filteredInventory.map((item) => [
            item.product.name,
            item.product.sku,
            item.product.packSize,
            `${item.product.weightValue} ${item.product.weightUnit}`,
            item.location.name,
            item.quantity,
            item.lowStockAt,
            item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-",
            item.createdBy,
            new Date(item.createdAt).toLocaleString(),
            new Date(item.updatedAt).toLocaleString(),
        ]);

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers, ...rows].map((e) => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `inventory_${new Date().toISOString()}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <DashboardLayout>
            <div className="min-h-screen p-6 bg-gray-100">
                <h1 className="text-2xl font-semibold mb-4">Inventory Data</h1>

                {/* Filters */}
                <div className="flex flex-col xl:flex-row gap-4 mb-4">
                    <input
                        type="text"
                        placeholder="Search Product"
                        value={filterProduct}
                        onChange={(e) => setFilterProduct(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full xl:w-1/3"
                    />
                    <input
                        type="text"
                        placeholder="Search Location"
                        value={filterLocation}
                        onChange={(e) => setFilterLocation(e.target.value)}
                        className="border px-3 py-2 rounded-md w-full xl:w-1/3"
                    />
                    <button
                        onClick={exportCSV}
                        className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                        Export CSV
                    </button>
                </div>

                {loading ? (
                    <p className="text-gray-500">Loading...</p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded shadow">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border">Product</th>
                                    <th className="p-2 border">SKU</th>
                                    <th className="p-2 border">Pack Size</th>
                                    <th className="p-2 border">Weight</th>
                                    <th className="p-2 border">Location</th>
                                    <th className="p-2 border">Quantity</th>
                                    <th className="p-2 border">Low Stock At</th>
                                    <th className="p-2 border">Expiry Date</th>
                                    <th className="p-2 border">Created By</th>
                                    <th className="p-2 border">Created At</th>
                                    <th className="p-2 border">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredInventory.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="p-2 border">{item.product.name}</td>
                                        <td className="p-2 border">{item.product.sku}</td>
                                        <td className="p-2 border">{item.product.packSize}</td>
                                        <td className="p-2 border">
                                            {item.product.weightValue} {item.product.weightUnit}
                                        </td>
                                        <td className="p-2 border">{item.location.name}</td>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">{item.lowStockAt}</td>
                                        <td className="p-2 border">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : "-"}</td>
                                        <td className="p-2 border">{item.createdBy}</td>
                                        <td className="p-2 border">{new Date(item.createdAt).toLocaleString()}</td>
                                        <td className="p-2 border">{new Date(item.updatedAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
