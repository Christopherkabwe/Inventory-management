"use client";
import { useState, useEffect, use } from "react";
import { useStackApp } from "@stackframe/stack";
import Sidebar from "@/components/sidebar";
import { useToaster } from '@/components/Toaster';
import { prisma } from "@/lib/prisma"
import { motion } from 'framer-motion';
import Pagination from "@/components/pagination"

interface Sale {
    id: string;
    product: { name: string };
    customer: { name: string };
    quantity: number;
    salePrice: number;
    totalAmount: number;
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
    const [products, setProducts] = useState<Product[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loadingSales, setLoadingSales] = useState(true);
    const [selectedProductId, setSelectedProductId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState<number | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { addToast } = useToaster();

    const userId = user?.id;
    const params = use(searchParams);
    const q = (params.q ?? "").trim();
    const page = Math.max(1, Number(params.page ?? 1));
    const pageSize = 10;

    const [pagination, setPagination] = useState({
        totalPages: 1,
        page: 1,
        totalSales: 0,
        limit: 10,
    });

    const fetchProducts = async () => {
        if (!userId) return;
        const res = await fetch(`/api/products?userId=${userId}`);
        const data = await res.json();
        console.log("Fetched products:", data);
        if (data?.products) {
            setProducts(data.products);
        } else {
            setProducts([]); // fallback to empty array
            addToast("No products found.", "info");
        }
    };

    useEffect(() => {
        fetchProducts().catch((err) => {
            console.error(err);
            addToast("Error loading products.", "error");
        });

        // Fetch sales (user-specific)
        if (!userId) return;
        setLoadingSales(true);
        fetch(`/api/sales?userId=${userId}&page=${page}&limit=${pageSize}`)
            .then(res => res.json())
            .then(data => {
                setSales(data.data || []);
                setPagination(data.pagination || { totalPages: 1, page: 1, totalSales: 0, limit: pageSize });
                setLoadingSales(false);
            })
            .catch((err) => {
                if (err.name === 'AbortError') return; // Ignore aborted fetch
                setLoadingSales(false);
                addToast("Error loading sales.", "error");
            });
    }, [userId, page, pageSize, addToast]);

    useEffect(() => {
        if (selectedProductId) {
            const selectedProduct = products.find(p => p.id === selectedProductId);
            if (selectedProduct) {
                setSalePrice(selectedProduct.price);
            }
        } else {
            setSalePrice(null);
        }
    }, [selectedProductId, products]);

    useEffect(() => {
        products.forEach(p => {
            const status = p.quantity > 0 ? `${p.quantity} in stock` : 'Out of stock';
        });
    }, [products]);

    const [customers, setCustomers] = useState<{ id: string; name: string; email: string }[]>([]);
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [isLoadingCustomers, setIsLoadingCustomers] = useState(true);

    const [customersFetched, setCustomersFetched] = useState(false);
    useEffect(() => {
        if (!userId || customersFetched) return;
        setIsLoadingCustomers(true);
        fetch(`/api/customers?userId=${userId}`)
            .then(res => res.json())
            .then(data => {
                setCustomers(data.customers || []);
                setCustomersFetched(true);
                setIsLoadingCustomers(false);
            })
            .catch(() => {
                setIsLoadingCustomers(false);
                addToast("Error loading customers.", "error");
            });
    }, [userId, addToast, customersFetched]);

    const handleCreateSale = async (formData: FormData) => {
        const productId = formData.get('productId');
        const quantity = Number(formData.get('quantity'));
        const salePrice = Number(formData.get('salePrice'));
        const customerId = selectedCustomerId;
        const totalAmount = quantity * salePrice;




        if (!productId || quantity <= 0 || !salePrice || salePrice <= 0 || !customerId) {
            addToast("Please select a product, customer, enter valid quantity and price.", "error");
            return;
        }

        const selectedProduct = products.find(p => p.id === productId);
        const selectedCustomer = customers.find(c => c.id === customerId);
        if (!selectedProduct || selectedProduct.quantity < quantity) {
            addToast(`Not enough stock for "${selectedProduct?.name}". Available: ${selectedProduct?.quantity || 0}.`, "error");
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
                    userId: user?.id,
                    customerId,
                }),
            });

            if (res.ok) {
                const newSale = await res.json();
                setSales([{
                    ...newSale,
                    product: { name: selectedProduct.name },
                    customer: { name: customers.find(c => c.id === customerId)?.name || 'N/A' },
                }, ...sales]);
                addToast('Sale created!', 'success');
                // Update product quantity in state
                fetchProducts();


                // Reset form
                setSelectedProductId("");
                setQuantity(1);
                setSalePrice(null);
            } else {
                const errorData = await res.json();
                addToast(errorData.error || 'Failed to create sale, please check stock level', 'error');
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
                        <div className="grid grid-cols-5 gap-4 items-end">
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
                                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                                <select name="productId" value={selectedProductId}
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
                                </select>
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
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Price (K)</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Revenue (K)</th>
                                <th className="px-6 py-3 border-b border-r border-gray-400 text-center text-xs font-semibold text-gray-600 uppercase">Date Created</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loadingSales ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-3 text-center text-sm text-gray-500">
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
                                    <td colSpan={6} className="px-6 py-3 text-center text-sm text-gray-500">No sales recorded yet.</td>
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
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {Array.isArray(sales) && sales.length > 0 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                baseUrl="/sales"
                                SearchParams={{ q }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
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