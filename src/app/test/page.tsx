"use client";
import { useState, useEffect, use } from "react";
import { useStackApp } from "@stackframe/stack";
import Sidebar from "@/components/sidebar";
import { useToaster } from '@/components/Toaster';
import { motion } from 'framer-motion';
import Pagination from "@/components/pagination";

interface Sale {
    id: string;
    product: { name: string };
    customer: { name: string };
    quantity: number;
    salePrice: number;
    totalAmount: number;
    location: string;
    createdAt: string;
}

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}

export default function SalesPage({ searchParams }: { searchParams: Promise<{ q?: string, page?: string }> }) {
    const stackApp = useStackApp();
    const user = stackApp.useUser();
    const userId = user?.id;
    const { addToast } = useToaster();

    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [customers, setCustomers] = useState<{ id: string; name: string }[]>([]);
    const [uniqueLocations, setUniqueLocations] = useState<string[]>([]);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [selectedLocation, setSelectedLocation] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const params = use(searchParams);
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;
    const [pagination, setPagination] = useState({ totalPages: 1, page: 1, totalSales: 0, limit: pageSize });
    const [loadingSales, setLoadingSales] = useState(true);

    // Fetch data (no userId check here, assume user is logged in via Stack)
    const fetchProducts = async () => {
        if (!userId) return; // Optional check, handle as needed
        const res = await fetch(`/api/products?userId=${userId}`);
        const data = await res.json();
        setProducts(data.products || []);
    };

    // Fetch customers
    const fetchCustomers = async () => {
        if (!userId) return;
        const res = await fetch(`/api/customers?userId=${userId}`);
        const data = await res.json();
        setCustomers(data.customers || []);
    };

    // Fetch locations
    const fetchLocations = async () => {
        if (!userId) return;
        const res = await fetch(`/api/locations?userId=${userId}`);
        const data = await res.json();
        setUniqueLocations(data.locations || []);
    };

    // Fetch sales
    const fetchSales = async () => {
        if (!userId) return;
        setLoadingSales(true);
        const res = await fetch(`/api/sales?userId=${userId}&page=${page}&limit=${pageSize}`);
        const data = await res.json();
        setSales(data.data || []);
        setPagination(data.pagination || { totalPages: 1, page: 1, totalSales: 0, limit: pageSize });
        setLoadingSales(false);
    };

    useEffect(() => {
        if (!user) {
            // Optionally redirect to login or show a message
            addToast("Please log in to access sales.", "error");
            return;
        }
        fetchProducts();
        fetchCustomers();
        fetchLocations();
        fetchSales();
    }, [user, page, addToast]);

    useEffect(() => {
        const product = products.find(p => p.id === selectedProductId);
        setSalePrice(product ? product.price : null);
    }, [selectedProductId, products]);

    const handleCreateSale = async (formData: FormData) => {
        const productId = formData.get('productId');
        const quantity = Number(formData.get('quantity'));
        const salePrice = Number(formData.get('salePrice'));
        const customerId = selectedCustomerId;
        const location = selectedLocation;
        const totalAmount = quantity * salePrice;
        const userId = user?.id;

        if (!productId || quantity <= 0 || !salePrice || salePrice <= 0 || !customerId || !location || !userId) {
            addToast("Please select a product, customer, location, and enter valid quantity and price.", "error");
            return;
        }

        const selectedProduct = products.find(p => p.id === productId);
        if (!selectedProduct || selectedProduct.quantity < quantity) {
            addToast(`Not enough stock for "${selectedProduct?.name}". Available: ${selectedProduct?.quantity || 0}.`, "error");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Reduce inventory in the selected location
            const inventoryRes = await fetch(`/api/inventory/${productId}/reduce`, {
                method: "POST",
                body: JSON.stringify({ location, quantity, userId }),
            });
            if (!inventoryRes.ok) {
                const error = await inventoryRes.json();
                addToast(error.error || "Failed to update inventory.", "error");
                setIsSubmitting(false);
                return;
            }

            // 2. Create the sale
            const saleRes = await fetch("/api/sales", {
                method: "POST",
                body: JSON.stringify({
                    productId,
                    quantity,
                    salePrice,
                    totalAmount,
                    userId,
                    customerId,
                    location,
                }),
            });
            if (saleRes.ok) {
                const newSale = await saleRes.json();
                setSales([{ ...newSale, product: { name: selectedProduct.name }, customer: { name: customers.find(c => c.id === customerId)?.name || 'N/A' }, }, ...sales]);
                addToast('Sale created!', 'success');
                fetchProducts(); // Refresh product stock
                // Reset form
                setSelectedProductId("");
                setQuantity(1);
                setSalePrice(null);
                setSelectedLocation("");
            } else {
                const errorData = await saleRes.json();
                addToast(errorData.error || 'Failed to create sale.', 'error');
            }
        } catch (e) {
            console.error(e);
            addToast("Something went wrong.", "error");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/sales" />
            <main className="ml-64 p-8">
                <h1 className="text-2xl font-semibold text-gray-900 mb-4">Sales</h1>

                <form onSubmit={handleCreateSale} className="bg-white rounded-lg border-gray-200 p-6 mb-6">
                    <div className="grid grid-cols-5 gap-4 items-end">
                        {/* Customer */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                            <select
                                name="customerId"
                                value={selectedCustomerId}
                                onChange={(e) => setSelectedCustomerId(e.target.value)}
                                className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                            </select>
                        </div>

                        {/* Product */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                            <select
                                name="productId"
                                value={selectedProductId}
                                onChange={(e) => setSelectedProductId(e.target.value)}
                                className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                                required
                            >
                                <option value="">Select Product</option>
                                {products.map(p => (
                                    <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                        {p.name} | K{p.price} | ({p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={quantity}
                                onChange={(e) => setQuantity(Number(e.target.value))}
                                min={1}
                                step={1}
                                required
                                className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                            />
                        </div>

                        {/* Price */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Price (K)</label>
                            <input
                                type="number"
                                name="salePrice"
                                value={salePrice || ""}
                                onChange={(e) => setSalePrice(Number(e.target.value))}
                                min={0}
                                step={0.01}
                                required
                                className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                            />
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                            <select
                                name="location"
                                value={selectedLocation}
                                onChange={(e) => setSelectedLocation(e.target.value)}
                                className="w-full px-2 py-2 border border-gray-600 rounded-lg focus:border-transparent"
                                required
                            >
                                <option value="">Select Location</option>
                                {uniqueLocations.map((loc) => (
                                    <option key={loc} value={loc}>
                                        {loc}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="mt-4">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? "Creating Sale..." : "Create Sale"}
                        </button>
                    </div>
                </form>

                {/* Sales Table */}
                <table className="min-w-full table-auto border-collapse border border-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-left text-xs font-semibold text-gray-600 uppercase">Product</th>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Price (K)</th>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Revenue (K)</th>
                            <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Location</th>
                            <th className="px-6 py-3 border-b border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Date Created</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {loadingSales ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-3 text-center text-sm text-gray-500">Loading sales...</td>
                            </tr>
                        ) : sales.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="px-6 py-3 text-center text-sm text-gray-500">No sales recorded yet.</td>
                            </tr>
                        ) : (
                            sales.map(sale => (
                                <tr key={sale.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-3 text-sm text-gray-500">{sale.customer.name}</td>
                                    <td className="px-6 py-3 text-sm text-gray-500">{sale.product.name}</td>
                                    <td className="px-6 py-3 text-center text-sm text-gray-500">{sale.quantity}</td>
                                    <td className="px-6 py-3 text-center text-sm text-gray-500">K{sale.salePrice}</td>
                                    <td className="px-6 py-3 text-center text-sm text-gray-500">K{sale.totalAmount}</td>
                                    <td className="px-6 py-3 text-center text-sm text-gray-500">{sale.location}</td>
                                    <td className="px-6 py-3 text-center text-sm text-gray-500">{new Date(sale.createdAt).toLocaleDateString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Pagination */}
                {sales.length > 0 && (
                    <div className="bg-white rounded-lg border border-gray-200 p-6 mt-4">
                        <Pagination currentPage={pagination.page} totalPages={pagination.totalPages} baseUrl="/sales" SearchParams={{ pageSize: String(pageSize) }} />
                    </div>
                )}
            </main>
        </div>
    );
}
