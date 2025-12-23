"use client";
import { useState, useEffect, use } from "react";
import { useStackApp } from "@stackframe/stack";
import Sidebar from "@/components/sidebar";
import { useToaster } from '@/components/Toaster';
import { motion } from 'framer-motion';
import Pagination from "@/components/pagination";
import { useRouter } from 'next/navigation';

interface Sale {
    id: string;
    product: { id?: string; name: string };
    customer: { id?: string; name: string };
    quantity: number;
    salePrice: number;
    totalAmount: number;
    createdAt: string;
    location: { name: string };
}

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}

export default function SalesPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const stackApp = useStackApp();
    const user = stackApp.useUser();
    const { addToast } = useToaster();
    const router = useRouter();

    const userId = user?.id;
    const params = use(searchParams);
    const q = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;

    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loadingSales, setLoadingSales] = useState(true);

    const [pagination, setPagination] = useState({
        totalPages: 1,
        page: 1,
        totalSales: 0,
        limit: pageSize,
    });

    const [isLoadingProducts, setIsLoadingProducts] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState<number | null>(null);

    /* ---------------- PRODUCTS ---------------- */

    const fetchProducts = async () => {
        if (!userId) return;
        setIsLoadingProducts(true);

        try {
            const res = await fetch(`/api/products?userId=${userId}`);
            const data = await res.json();
            setProducts(data.products || []);
        } catch {
            addToast("Error loading products.", "error");
        } finally {
            setIsLoadingProducts(false);
        }
    };

    /* ---------------- SALES (CRITICAL FIX) ---------------- */

    const fetchSales = async () => {
        if (!userId) return;

        try {
            setLoadingSales(true);

            const res = await fetch(
                `/api/sales?userId=${userId}&page=${page}&limit=${pageSize}`
            );
            const data = await res.json();

            setSales(data.data || []);
            setPagination(
                data.pagination || {
                    totalPages: 1,
                    page: 1,
                    totalSales: 0,
                    limit: pageSize,
                }
            );
        } catch {
            addToast("Error loading sales.", "error");
        } finally {
            setLoadingSales(false);
        }
    };

    /* ---------------- CUSTOMERS ---------------- */

    const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

    const fetchCustomers = async () => {
        if (!userId) return;
        setIsLoadingCustomers(true);

        try {
            const res = await fetch(`/api/customers?userId=${userId}`);
            const data = await res.json();
            setCustomers(data.customers || []);
        } catch {
            addToast("Error loading customers.", "error");
        } finally {
            setIsLoadingCustomers(false);
        }
    };

    /* ---------------- LOCATIONS (FIXED) ---------------- */

    const [uniqueLocations, setUniqueLocations] = useState<any[]>([]);

    const fetchLocations = async () => {
        if (!userId) return;
        try {
            const res = await fetch(`/api/locations?userId=${userId}`);
            const data = await res.json();
            setUniqueLocations(data.locations || []);
        } catch {
            addToast("Error loading locations.", "error");
        }
    };

    /* ---------------- EFFECTS ---------------- */

    useEffect(() => {
        fetchProducts();
        fetchCustomers();
        fetchLocations();
    }, [userId]);

    useEffect(() => {
        fetchSales();
    }, [userId, page, pageSize]);

    useEffect(() => {
        if (pagination.page > pagination.totalPages) {
            router.push(`/sales?page=${pagination.totalPages}`);
        }
    }, [pagination]);

    useEffect(() => {
        if (selectedProductId) {
            const p = products.find(p => p.id === selectedProductId);
            setSalePrice(p ? p.price : null);
        } else {
            setSalePrice(null);
        }
    }, [selectedProductId, products]);

    /* ---------------- CREATE SALE ---------------- */

    const handleCreateSale = async (formData: FormData) => {
        const productId = formData.get("productId") as string;
        const quantity = Number(formData.get("quantity"));
        const salePrice = Number(formData.get("salePrice"));
        const totalAmount = quantity * salePrice;

        if (!productId || !selectedCustomerId || !selectedLocation) {
            addToast("Please fill all required fields.", "error");
            return;
        }

        setIsSubmitting(true);

        try {
            const res = await fetch("/api/sales", {
                method: "POST",
                body: JSON.stringify({
                    productId,
                    quantity,
                    salePrice,
                    totalAmount,
                    customerId: selectedCustomerId,
                    locationId: selectedLocation,
                    userId,
                }),
            });

            if (res.ok) {
                addToast("Sale created!", "success");

                await fetchSales();     // 🔥 FIX
                await fetchProducts();  // update stock

                setSelectedProductId("");
                setSelectedCustomerId("");
                setSelectedLocation("");
                setQuantity(1);
                setSalePrice(null);
            } else {
                const error = await res.json();
                addToast(error.error || "Failed to create sale.", "error");
            }
        } catch {
            addToast("Something went wrong.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    /* ---------------- DELETE SALE ---------------- */

    const handleDeleteSale = async (saleId: string) => {
        if (!confirm("Are you sure?")) return;

        const res = await fetch(`/api/sales/${saleId}`, { method: "DELETE" });
        if (res.ok) {
            addToast("Sale deleted!", "success");
            await fetchSales(); // 🔥 FIX
        } else {
            addToast("Failed to delete sale.", "error");
        }
    };

    /* ---------------- EDIT SALE ---------------- */

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingSale, setEditingSale] = useState<Sale | null>(null);

    const handleEditSale = (sale: Sale) => {
        setEditingSale(sale);
        setIsEditModalOpen(true);
    };

    const handleSaveEdit = async () => {
        if (!editingSale) return;

        const res = await fetch(`/api/sales/${editingSale.id}`, {
            method: "PUT",
            body: JSON.stringify({ ...editingSale, userId }),
        });

        if (res.ok) {
            addToast("Sale updated!", "success");
            await fetchSales();     // 🔥 FIX
            await fetchProducts();
            setIsEditModalOpen(false);
        } else {
            addToast("Failed to update sale.", "error");
        }
    };

    /* ---------------- RENDER ---------------- */

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/sales" />
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Sales</h1>
                            <p className="text-sm text-gray-500">Track and manage your product sales. Select a product, enter quantity, and record a sale.</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    <form onSubmit={(e) => {
                        e.preventDefault();
                        handleCreateSale(new FormData(e.currentTarget));
                    }} className="bg-white rounded-lg border-gray-200 p-6">
                        <div className="grid grid-cols-6 gap-4 items-end">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                {isLoadingCustomers ? (
                                    <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                                        <svg className="animate-spin h-5 w-5 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading customers...
                                    </div>
                                ) : (
                                    <select
                                        name="customerId"
                                        value={selectedCustomerId}
                                        onChange={(e) => setSelectedCustomerId(e.target.value)}
                                        className="w-full px-2 py-2 border border-gray-600 rounded-lg focus:border-transparent"
                                        required
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map(customer => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                                <select
                                    name="locationId"
                                    value={selectedLocation}
                                    onChange={(e) => setSelectedLocation(e.target.value)}
                                    className="w-full px-2 py-2 border border-gray-600 rounded-lg focus:border-transparent"
                                    required
                                >
                                    <option value="">Select Location</option>
                                    {uniqueLocations.map((loc) => (
                                        <option key={loc.id} value={loc.id}>
                                            {loc.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                {isLoadingProducts ? (
                                    <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                                        <svg className="animate-spin h-5 w-5 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Loading Products...
                                    </div>
                                ) : (<select
                                    name="productId"
                                    value={selectedProductId}
                                    onChange={(e) => {
                                        const id = e.target.value;
                                        setSelectedProductId(id);
                                        const product = products.find(p => p.id === id);
                                        setSalePrice(product ? product.price : null);
                                    }}
                                    className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                    required
                                >
                                    <option value="">Select Product</option>
                                    {products.length ? (
                                        products.map(p => (
                                            <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                                {p.name} | K{p.price} | ({p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'})
                                            </option>
                                        ))
                                    ) : (
                                        <option disabled>No products available</option>
                                    )}
                                </select>)}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                <input
                                    type="number"
                                    name="quantity"
                                    value={quantity}
                                    onChange={(e) => setQuantity(e.target.value)}
                                    onBlur={() => {
                                        // Convert to number only on blur (or submit)
                                        setQuantity(prev => Number(prev) || 0);
                                    }}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full px-2 py-2 border border-gray-600 rounded-lg focus:border-transparent"
                                    placeholder="Enter quantity"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Price (K)</label>
                                <input
                                    type="number"
                                    name="salePrice"
                                    value={salePrice || ''}
                                    onChange={(e) => setSalePrice(Number(e.target.value))}
                                    min="0"
                                    step="0.01"
                                    required
                                    className="w-full px-2 py-2 border border-gray-600 rounded-lg focus:border-transparent"
                                    placeholder="K100.00"
                                />
                            </div>
                            <div>
                                <SubmitButton isSubmitting={isSubmitting} />
                            </div>
                        </div>
                    </form>

                    <table className="min-w-full table-auto mt-4 border-collapse border border-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-left text-xs font-semibold text-gray-600 uppercase">Customer Name</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-left text-xs font-semibold text-gray-600 uppercase">Product Name</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Price (K)</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Revenue (K)</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Date Created</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loadingSales ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-3 text-center text-sm text-gray-500">
                                        <div className="flex flex-col items-center justify-center gap-5 mt-10 mb-10">
                                            <svg className="animate-spin h-10 w-10 text-purple-600 items-center" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Loading sales...
                                        </div>
                                    </td>
                                </tr>
                            ) : !Array.isArray(sales) || sales.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="px-6 py-3 text-center text-sm text-gray-500">No sales recorded yet.</td>
                                </tr>
                            ) : (
                                sales.map((sale, key) => (
                                    <tr key={sale.id} className={`hover:bg-gray-50 ${key % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-left text-sm text-gray-500">
                                            {sale.customer?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-left text-sm text-gray-500">
                                            {sale.product?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-left text-sm text-gray-500">
                                            {sale.location?.name || 'N/A'}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-center text-sm text-gray-500">
                                            {sale.quantity}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-center text-sm text-gray-500">
                                            K{sale.salePrice}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-center text-sm text-gray-500">
                                            K{sale.totalAmount}
                                        </td>
                                        <td className="px-6 py-3 border-b border-r border-gray-400 text-center text-sm text-gray-500">
                                            {new Date(sale.createdAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-3 border-b border-gray-400 text-center text-sm text-gray-500">
                                            <button
                                                onClick={() => handleEditSale(sale)}
                                                className="text-blue-600 hover:text-blue-800 mr-3"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDeleteSale(sale.id)}
                                                className="text-red-600 hover:text-red-800"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>


                </div>
                {isEditModalOpen && editingSale && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-96">
                            <h2 className="text-lg font-semibold mb-4">Edit Sale</h2>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                                    <select
                                        name="customerId"
                                        value={editForm.customerId}
                                        onChange={handleEditChange}
                                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                        required
                                    >
                                        <option value="">Select Customer</option>
                                        {customers.map((customer) => (
                                            <option key={customer.id} value={customer.id}>
                                                {customer.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                                    <select
                                        name="productId"
                                        value={editForm.productId}
                                        onChange={handleEditChange}
                                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                        required
                                    >
                                        <option value="">Select Product</option>
                                        {products.map((p) => (
                                            <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                                {p.name} | K{p.price} | ({p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock'})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                                    <input
                                        type="number"
                                        name="quantity"
                                        value={editForm.quantity}
                                        onChange={handleEditChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (K)</label>
                                    <input
                                        type="number"
                                        name="salePrice"
                                        value={editForm.salePrice}
                                        onChange={handleEditChange}
                                        min="0"
                                        step="0.01"
                                        required
                                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-2 mt-4">
                                <button
                                    onClick={() => setIsEditModalOpen(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleSaveEdit}
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                )}
                {/* PAGINATION */}
                {sales.length > 0 && (
                    <div className="bg-white rounded-lg border p-6 mt-6">
                        <Pagination
                            currentPage={pagination.page}
                            totalPages={pagination.totalPages}
                            baseUrl="/sales"
                            SearchParams={{ q }}
                        />
                    </div>
                )}
            </main >
        </div >
    );
}

function SubmitButton({ isSubmitting }: { isSubmitting: boolean }) {
    return (
        <button
            type="submit"
            className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
            disabled={isSubmitting}
        >
            {isSubmitting ? 'Creating Sale...' : 'Create Sale'}
        </button>
    );
}