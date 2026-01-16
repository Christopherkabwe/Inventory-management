"use client";

import { useEffect, useState, useMemo } from "react";
import Pagination from "@/components/pagination";
import EditInventoryButton from "@/components/EditInventoryButton";
import InventoryFilters from "@/components/InventoryFilters";
import { unitToKg } from "@/lib/UnitToKg";
import { fetchInventory } from "@/lib/fetchInventory";
import Loading from "@/components/Loading";
import DeleteFromInventoryButton from "@/components/DeleteInventoryButton";

const pageSize = 10;

export default function ManageInventory() {
    const [inventoryData, setInventoryData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [q, setQ] = useState("");
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [currentPage, setCurrentPage] = useState(1);

    // Options
    const [uniqueLocations, setUniqueLocations] = useState<{ id: string; name: string }[]>([]);
    const [productOptions, setProductOptions] = useState<{ id: string; name: string }[]>([]);
    const [categoryOptions, setCategoryOptions] = useState<{ id: string; name: string }[]>([]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        setLoading(true);
        fetchInventory()
            .then((data) => {
                setInventoryData(data);

                // compute filter options
                const locationsOpt = Array.from(
                    new Map(
                        data
                            .map((i) => i.location)
                            .filter((l): l is NonNullable<typeof l> => !!l)
                            .map((l) => [l.id, { id: l.id, name: l.name }])
                    ).values()
                );
                setUniqueLocations(locationsOpt);

                const productsOpt = Array.from(
                    new Map(
                        data.map((i) => [i.productId, { id: i.productId, name: i.product?.name ?? "Unknown" }])
                    ).values()
                );
                setProductOptions(productsOpt);

                const categoriesOpt = Array.from(
                    new Set(data.map((i) => i.product?.category ?? "Uncategorized"))
                ).map((c) => ({ id: c, name: c }));
                setCategoryOptions(categoriesOpt);
            })
            .finally(() => setLoading(false));
    }, []);

    // ==================== FILTER INVENTORY ====================
    const filteredInventory = useMemo(() => {
        return inventoryData.filter((inv) => {
            const matchQuery = q ? inv.product?.name.toLowerCase().includes(q.toLowerCase()) : true;
            const matchLocation = locations.length ? locations.includes(inv.location?.name ?? "") : true;
            const matchProduct = selectedProducts.length ? selectedProducts.includes(inv.product?.name ?? "") : true;
            const matchCategory = selectedCategories.length ? selectedCategories.includes(inv.product?.category ?? "Uncategorized") : true;
            return matchQuery && matchLocation && matchProduct && matchCategory;
        }).map((inv) => {
            const quantity = inv.quantity || 0;
            const inTransit = inv.intransit || 0;
            const packSize = inv.product?.packSize || 1;
            const weightValue = inv.product?.weightValue || 0;
            const weightUnit = inv.product?.weightUnit || "kg";
            const price = Number(inv.product?.price) || 0;
            const tonnage = (quantity * packSize * unitToKg(weightValue, weightUnit)) / 1000;
            const value = quantity * price;
            const lowStockAt = inv.product?.lowStockAt || 0;
            return { ...inv, tonnage, value };
        });
    }, [inventoryData, q, locations, selectedProducts, selectedCategories]);

    const totalPages = Math.max(1, Math.ceil(filteredInventory.length / pageSize));

    const paginatedItems = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        const items = filteredInventory.slice(start, start + pageSize);

        return items.map((inventory) => {
            const quantity = inventory.quantity || 0;
            const inTransit = inventory.intransit || 0;
            const packSize = inventory.product?.packSize || 1;
            const weightValue = inventory.product?.weightValue || 0;
            const weightUnit = inventory.product?.weightUnit || "kg";
            const price = Number(inventory.product?.price) || 0;
            const lowStockAt = inventory.product?.lowStockAt || "kg";

            const tonnage = (quantity * packSize * unitToKg(weightValue, weightUnit)) / 1000;
            const value = quantity * price;

            return { ...inventory, tonnage, value };
        });
    }, [filteredInventory, currentPage]);

    return (
        <div className="space-y-2 mb-5">
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-gray-900">Inventory Management</h1>
                <p className="text-sm text-gray-500">Manage your stock products and track inventory levels</p>
            </div>

            <div id="inventory-table" className="flex flex-col space-y-4 bg-white opacity-80 p-4 rounded-xl border hover:shadow-md transition-shadow">
                {/* Filters */}
                <InventoryFilters
                    uniqueLocations={uniqueLocations}
                    products={productOptions}
                    categories={categoryOptions}
                    query={q}
                    setQuery={setQ}
                    locations={locations}
                    setLocations={setLocations}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    inventoryData={filteredInventory}
                //inventoryData={paginatedItems}
                />

                {/* Inventory Table */}
                <div className={`transition-all duration-300 ${isModalOpen ? "pointer-events-none blur-sm" : ""}`}>
                    <div className="max-h-[700px] overflow-y-auto overflow-x-auto">
                        <table className="w-full text-sm border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-3 border-r text-left font-semibold">#</th>
                                    <th className="py-2 px-3 border-r text-left font-semibold">Product Name</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">SKU</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Pack Size</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Weight Value</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Weight Unit</th>
                                    <th className="py-2 px-3 border-r text-left font-semibold">Category</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Location</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Price</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Quantity</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Tonnage</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Value</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">In Transit</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Low Stock At</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300 whitespace-nowrap">
                                {loading ? (
                                    <tr>
                                        <Loading message="Loading Inventory" colSpan={20} />
                                    </tr>
                                ) : paginatedItems.length ? (
                                    paginatedItems.map((inv, idx) => (
                                        <tr key={inv.id ?? idx} className={`hover:bg-gray-50 ${idx % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                            <td className="px-3 py-2 border-r">{idx + 1 + (currentPage - 1) * pageSize}</td>
                                            <td className="px-3 py-2 border-r">{inv.product?.name}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.product?.sku}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.product?.packSize}</td>
                                            <td className="px-3 py-2 border-r">{inv.product?.weightValue.toFixed(2)}</td>
                                            <td className="px-3 py-2 border-r">{inv.product?.weightUnit}</td>
                                            <td className="px-3 py-2 border-r">{inv.product?.category}</td>
                                            <td className="px-3 py-2 border-r">{inv.location?.name}</td>
                                            <td className="px-3 py-2 border-r text-center">K{Number(inv.product?.price).toFixed(2)}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.quantity}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.tonnage.toFixed(2)}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.value.toFixed(2)}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.inTransit}</td>
                                            <td className="px-3 py-2 border-r text-center">{inv.lowStockAt}</td>
                                            <td className="flex px-3 py-2 border-r items-center justify-center gap-2">
                                                <EditInventoryButton
                                                    inventory={inv}
                                                    locations={uniqueLocations}
                                                    onEdit={(updatedInventory) => {
                                                        setInventoryData(prev => prev.map(i => i.id === updatedInventory.id ? updatedInventory : i))
                                                    }}
                                                />
                                                <DeleteFromInventoryButton
                                                    inventory={inv}
                                                    onDelete={(id) =>
                                                        setInventoryData(prev => prev.filter(i => i.id !== id))
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={14} className="text-center py-4">
                                            No inventory found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {totalPages > 1 && (
                            <div className="bg-gray-100 rounded-lg border border-gray-300 p-3 mt-5 mb-5">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={setCurrentPage}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
