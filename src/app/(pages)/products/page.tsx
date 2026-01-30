"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import DashboardLayout from "@/components/DashboardLayout";
import { useUser } from "@/app/context/UserContext";
import Loading from "@/components/Loading";
import Pagination from "@/components/pagination/pagination";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface User {
    id: string;
    fullName: string;

}
interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    costPerBag?: number;
    packSize: number;
    category?: string;
    subCategory?: string;
    weightValue: number;
    weightUnit: string;
    createdAt: string;
    updatedAt: string;
    createdBy: User;
    createdById: string;
    isTaxable: string;
    taxRate: number;
}

export default function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();
    const [form, setForm] = useState<Partial<Product>>({});
    const [editingId, setEditingId] = useState<string | null>(null);
    const [updatingId, setUpdatingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const pageSize = 10; // items per page

    const user = useUser();
    const isAdmin = user?.role === "ADMIN";

    // Fetch products & categories
    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res = await axios.get("/api/rbac/product-management");
            setProducts(res.data);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);


    // Handlers
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            setUpdatingId(editingId);
            try {
                await axios.put(`/api/rbac/product-management/${editingId}`, form);
                setEditingId(null);
                setForm({});
            } finally {
                setUpdatingId(null);
            }
        } else {
            await axios.post("/api/rbac/product-management", form);
            setForm({});
        }
        fetchProducts();
    };

    const handleEdit = (product: Product) => {
        if (!isAdmin) return;
        setForm(product);
        setEditingId(product.id);
    };

    const handleDelete = async (id: string) => {
        if (!isAdmin) return;
        if (!confirm("Are you sure you want to delete this product?")) return;
        setDeletingId(id);
        try {
            await axios.delete(`/api/rbac/product-management/${id}`);
        } finally {
            setDeletingId(null);
            fetchProducts();
        }
    };

    const filteredProducts = products.filter((p) => {
        const searchMatch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) || p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category?.toLowerCase().includes(searchTerm.toLowerCase());
        return searchMatch;
    });

    const totalPages = Math.ceil(products.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return (
        <div>
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold py-1">Product List</h1>
                <p className="text-gray-500 py-2">List of all existing products.</p>

                {/* Filters */}
                <div className="flex space-x-4 p-2 bg-white rounded-lg mb-2">
                    <input
                        type="text"
                        placeholder="Search product, sku or name"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                    />
                </div>

                {/* Edit Modal */}
                {isAdmin && editingId && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg w-11/12 md:w-2/3 lg:w-1/2 relative">
                            <h2 className="text-xl font-bold mb-4">Edit Product</h2>
                            <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit}>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                    <input
                                        type="text"
                                        value={form.name || ""}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Cost per Bag</label>
                                    <input
                                        type="number"
                                        value={form.costPerBag || ""}
                                        onChange={(e) => setForm({ ...form, costPerBag: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                                    <input
                                        type="number"
                                        value={form.price || ""}
                                        onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Pack Size</label>
                                    <input
                                        type="number"
                                        value={form.packSize || ""}
                                        onChange={(e) => setForm({ ...form, packSize: parseInt(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={form.category || ""}
                                        onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                    <input
                                        type="text"
                                        value={form.subCategory || ""}
                                        onChange={(e) => setForm({ ...form, subCategory: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Taxable</label>
                                    <input
                                        type="text"
                                        value={form.isTaxable || ""}
                                        onChange={(e) => setForm({ ...form, isTaxable: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Tax Rate</label>
                                    <input
                                        type="number"
                                        value={(form.taxRate || 0)}
                                        step={0.01}
                                        onChange={(e) => setForm({ ...form, taxRate: parseFloat(e.target.value) || 0.00 })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight Value</label>
                                    <input
                                        type="number"
                                        value={form.weightValue || ""}
                                        onChange={(e) => setForm({ ...form, weightValue: parseFloat(e.target.value) })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Weight Unit</label>
                                    <input
                                        type="text"
                                        value={form.weightUnit || ""}
                                        onChange={(e) => setForm({ ...form, weightUnit: e.target.value })}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                                        required
                                    />
                                </div>
                                <div className="col-span-2 flex justify-end space-x-2 mt-4">
                                    <button
                                        type="button"
                                        className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition"
                                        onClick={() => { setEditingId(null); setForm({}); }}
                                        disabled={updatingId === editingId}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className={`px-4 py-2 rounded text-white transition ${updatingId === editingId ? "bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`}
                                        disabled={updatingId === editingId}
                                    >
                                        {updatingId === editingId ? "Updating..." : "Update Product"}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Product Table */}
                <div className="bg-white rounded-md overflow-x-auto p-2 hover:shadow-lg mb-5">
                    <table className="min-w-full bg-white text-sm border rounded shadow">
                        <thead>
                            <tr className="bg-gray-200 text-left px-2 py-1">
                                <th className="border p-2">SKU</th>
                                <th className="border p-2">Product Name</th>
                                <th className="border p-2">Pack Size</th>
                                <th className="border p-2">Weight</th>
                                <th className="border p-2">Category</th>
                                <th className="border p-2">Sub-Category</th>
                                <th className="border p-2 text-right">Unit Cost</th>
                                <th className="border p-2 text-right">Price</th>
                                <th className="border p-2 text-right">Tax Rate</th>
                                <th className="border p-2">Created At</th>
                                <th className="border p-2">Updated At</th>
                                <th className="border p-2">Created By</th>
                                {isAdmin && <th className="border p-2 text-center">Actions</th>}
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={isAdmin ? 9 : 8} className="text-center p-4">
                                        <Loading message="Loading Products..." />
                                    </td>
                                </tr>
                            ) : paginatedProducts.length > 0 ? (
                                paginatedProducts.map((p) => (
                                    <tr key={p.id} className="hover:bg-gray-100 px-2 py-1">
                                        <td className="border p-2">{p.sku}</td>
                                        <td className="border p-2">{p.name}</td>
                                        <td className="border p-2 text-center">{p.packSize}</td>
                                        <td className="border p-2">{`${p.weightValue} ${p.weightUnit}`}</td>
                                        <td className="border p-2">{p.category || "-"}</td>
                                        <td className="border p-2 text-center">{p.subCategory || "-"}</td>
                                        <td className="border p-2 text-right">{p.costPerBag || "-"}</td>
                                        <td className="border p-2 text-right">{p.price}</td>
                                        <td className="border p-2 text-right">{(p.taxRate * 100).toFixed(2)}%</td>
                                        <td className="border p-2">{new Date(p.createdAt).toLocaleDateString()}</td>
                                        <td className="border p-2">{new Date(p.updatedAt).toLocaleDateString()}</td>
                                        <td className="border p-2">{p.createdBy.fullName}</td>
                                        {isAdmin && (
                                            <td className="flex border space-x-2 p-2 gap-2 justify-center">
                                                <button
                                                    className={`px-2 py-1 rounded transition ${updatingId === p.id ? "bg-yellow-700" : "bg-yellow-400 hover:bg-yellow-500"}`}
                                                    onClick={() => handleEdit(p)}
                                                    disabled={updatingId === p.id || deletingId === p.id}
                                                >
                                                    {updatingId === p.id ? "Editing..." : "Edit"}
                                                </button>
                                                <button
                                                    className={`px-2 py-1 rounded text-white transition ${deletingId === p.id ? "bg-red-700" : "bg-red-500 hover:bg-red-600"}`}
                                                    onClick={() => handleDelete(p.id)}
                                                    disabled={updatingId === p.id || deletingId === p.id}
                                                >
                                                    {deletingId === p.id ? "Deleting..." : "Delete"}
                                                </button>
                                            </td>
                                        )}

                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={isAdmin ? 9 : 8} className="text-center p-4 text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="flex items-center mb-5">
                    <Link
                        href="/products/add-product"
                        className="ml-auto inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-green-600 cursor-pointer"
                    >
                        <Plus size={16} />
                        New Product
                    </Link>
                </div>

                {/* Pagination */}
                {!loading && totalPages > 1 && (
                    <div className="mt-4 flex justify-center bg-gray-300 p-2 rounded-lg">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                )}
            </div>
        </div >
    );
}
