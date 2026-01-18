"use client";

import { useEffect, useState, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { Product, Location, Inventory } from "@/components/interfaces"
import Loading from "@/components/Loading";
import InventoryFilters from "@/components/inventory/InventoryFilters";
import Pagination from "@/components/pagination/pagination";

type InventoryItem = Inventory & {
    product: Product & {
        price: number;
    };
    location: Location;
    createdBy: {
        id: string;
        fullName: string | null;
    };
    assignedUser?: {
        id: string;
        fullName: string | null;
        managerId: string | null;
    } | null;
};


export default function InventoryPage() {
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Filters
    const [query, setQuery] = useState("");
    const [locations, setLocations] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        const fetchInventory = async () => {
            try {
                const res = await fetch("/api/rbac/inventory");
                const data = await res.json();
                setInventory(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error("Failed to fetch inventory", err);
                setInventory([]);
            } finally {
                setLoading(false);
            }
        };

        fetchInventory();
    }, []);

    const uniqueLocations = useMemo(
        () =>
            Array.from(
                new Map(
                    inventory
                        .filter(i => i.location)
                        .map(i => [i.location.id, { id: i.location.id, name: i.location.name }])
                ).values()
            ),
        [inventory]
    );

    const productOptions = useMemo(
        () =>
            Array.from(
                new Map(
                    inventory
                        .filter(i => i.product)
                        .map(i => [i.product.id, { id: i.product.id, name: i.product.name }])
                ).values()
            ),
        [inventory]
    );

    const categoryOptions = useMemo(
        () =>
            Array.from(
                new Set(inventory.map(i => i.product?.category ?? "Uncategorized"))
            ).map(c => ({ id: c, name: c })),
        [inventory]
    );
    console.log("Category Options:", categoryOptions);


    // Filtered data based on search inputs
    const filteredInventory = useMemo(() => {
        return inventory.filter((item) => {
            const matchQuery = query
                ? item.product?.name.toLowerCase().includes(query.toLowerCase())
                : true;

            const matchLocation = locations.length
                ? locations.includes(item.location?.name)
                : true;

            const matchProduct = selectedProducts.length
                ? selectedProducts.includes(item.product?.name)
                : true;

            const matchCategory = selectedCategories.length
                ? selectedCategories.includes(item.product?.category ?? "Uncategorized")
                : true;

            return matchQuery && matchLocation && matchProduct && matchCategory;
        });
    }, [inventory, query, locations, selectedProducts, selectedCategories]);

    const totalPages = Math.ceil(filteredInventory.length / ITEMS_PER_PAGE);

    const paginatedInventory = useMemo(() => {
        const start = (currentPage - 1) * ITEMS_PER_PAGE;
        const end = start + ITEMS_PER_PAGE;
        return filteredInventory.slice(start, end);
    }, [filteredInventory, currentPage]);

    useEffect(() => {
        setCurrentPage(1);
    }, [query, locations, selectedProducts, selectedCategories]);

    // FILTER PROPS //
    const filterProps = useMemo(() => ({
        uniqueLocations,
        products: productOptions,
        categories: categoryOptions,
        query,
        setQuery,
        locations,
        setLocations,
        selectedProducts,
        setSelectedProducts,
        selectedCategories,
        setSelectedCategories,
        inventoryData: filteredInventory,
    }), [
        uniqueLocations,
        productOptions,
        categoryOptions,
        query,
        locations,
        selectedProducts,
        selectedCategories,
        filteredInventory,
    ]);

    return (
        <DashboardLayout>
            <div className="min-h-screen bg-gray-100 p-5">
                <h1 className="text-2xl font-semibold mb-2">Inventory Data</h1>
                <p className="mb-2">Record of all Inventory Data transactions </p>
                {/* Filters */}
                <div className="bg-white rounded-lg shadow p-5">
                    <div className="w-full flex flex-col xl:flex-row gap-4 mb-4 ">
                        <InventoryFilters {...filterProps} />
                    </div>
                    <div className="max-h-[600px] overflow-x-auto">
                        <table className="min-w-full border-collapse border whitespace-nowrap">
                            <thead className="sticky top-0 bg-gray-100 text-left">
                                <tr>
                                    <th className="p-2 border w-12 text-center">#</th>
                                    <th className="p-2 border">Product</th>
                                    <th className="p-2 border">SKU</th>
                                    <th className="p-2 border">Pack Size</th>
                                    <th className="p-2 border">Weight Value</th>
                                    <th className="p-2 border">Weight Unit</th>
                                    <th className="p-2 border">Category</th>
                                    <th className="p-2 border">Location</th>
                                    <th className="p-2 border">Price</th>
                                    <th className="p-2 border">Quantity</th>
                                    <th className="p-2 border">Low Stock At</th>
                                    <th className="p-2 border">Expiry Date</th>
                                    <th className="p-2 border">Assigned User</th>
                                    <th className="p-2 border">Created By</th>
                                    <th className="p-2 border">Created At</th>
                                    <th className="p-2 border">Updated At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <Loading message="Loading Inventory" colSpan={15} />
                                    </tr>
                                ) : (
                                    paginatedInventory.map((item: InventoryItem, index: number) => (
                                        <tr key={item.id} className="hover:bg-gray-50">
                                            <td className="p-2 border text-center font-medium text-gray-600">
                                                {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                                            </td>
                                            <td className="p-2 border">{item.product?.name}</td>
                                            <td className="p-2 border">{item.product?.sku}</td>
                                            <td className="p-2 border">{item.product?.packSize}</td>

                                            <td className="p-2 border">
                                                {typeof item.product?.weightValue === "number"
                                                    ? item.product.weightValue.toFixed(2)
                                                    : "0.00"}
                                            </td>
                                            <td className="p-2 border">
                                                {item.product?.weightUnit}
                                            </td>

                                            <td className="p-2 border">
                                                {item.product?.category ?? "Uncategorized"}
                                            </td>

                                            <td className="p-2 border">{item.location?.name}</td>

                                            <td className="p-2 border text-right">
                                                {typeof item.product?.price === "number"
                                                    ? item.product.price.toFixed(2)
                                                    : "0.00"}
                                            </td>

                                            <td className="p-2 border">{item.quantity}</td>
                                            <td className="p-2 border">{item.lowStockAt}</td>

                                            <td className="p-2 border">
                                                {item.expiryDate
                                                    ? new Date(item.expiryDate).toLocaleDateString()
                                                    : "-"}
                                            </td>

                                            <td className="p-2 border">
                                                {item.assignedUser?.fullName ?? "-"}
                                            </td>

                                            <td className="p-2 border">
                                                {item.createdBy?.fullName ?? "-"}
                                            </td>

                                            <td className="p-2 border">
                                                {new Date(item.createdAt).toLocaleString()}
                                            </td>

                                            <td className="p-2 border">
                                                {new Date(item.updatedAt).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                                {!loading && filteredInventory.length === 0 && (
                                    <tr>
                                        <td colSpan={16} className="p-4 text-center text-gray-500">
                                            No inventory matches your filters
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </DashboardLayout>
    );
}
