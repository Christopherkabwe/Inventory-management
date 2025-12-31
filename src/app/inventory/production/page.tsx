"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";
import { Clock, X } from "lucide-react";

type Product = {
    id: string;
    name: string;
    sku: string;
    packSize: string;
    weightValue: string;
    weightUnit: string;
};

type Production = {
    id: string;
    product: Product;
    quantity: number;
    createdBy: string;
    createdAt: string;
};

export default function ProductionsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productions, setProductions] = useState<Production[]>([]);
    const [form, setForm] = useState({ productId: "", quantity: 0 });
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Production | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [productsRes, productionsRes] = await Promise.all([
                    fetch("/api/products").then(r => r.json()),
                    fetch("/api/productions?limit=10").then(r => r.json()),
                ]);

                setProducts(Array.isArray(productsRes) ? productsRes : productsRes.products || []);
                setProductions(Array.isArray(productionsRes) ? productionsRes : productionsRes.productions || []);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const selectedProduct = products.find(p => p.id === form.productId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.productId || form.quantity <= 0) {
            alert("Please select a product and enter a valid quantity.");
            return;
        }

        const payload = { productId: form.productId, quantity: form.quantity };

        try {
            const res = await fetch(editing ? `/api/productions/${editing.id}` : "/api/productions", {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to save production");

            const data = await res.json();
            alert(editing ? "Production updated!" : "Production created!");

            if (editing) {
                setProductions(prev => prev.map(p => p.id === editing.id ? data.production : p));
                setEditing(null);
            } else {
                setProductions(prev => [data.production, ...prev.slice(0, 9)]);
            }

            setForm({ productId: "", quantity: 0 });
        } catch (err) {
            console.error(err);
            alert("Failed to save production");
        }
    };

    const openEdit = (prod: Production) => {
        setEditing(prod);
        setForm({ productId: prod.product.id, quantity: prod.quantity });
    };

    const closeEdit = () => {
        setEditing(null);
        setForm({ productId: "", quantity: 0 });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this production?")) return;
        try {
            const res = await fetch(`/api/productions/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete production");
            setProductions(prev => prev.filter(p => p.id !== id));
            alert("Production deleted!");
        } catch (err) {
            console.error(err);
            alert("Failed to delete production");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 overflow-x-auto">
            <DashboardLayout>
                <div className="mb-5">
                    <h1 className="text-2xl font-semibold mb-1">Add Production</h1>
                    <p className="text-gray-500">Log production quantities for products</p>
                </div>

                <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Product</label>
                            <select
                                required
                                value={form.productId}
                                onChange={e => setForm({ ...form, productId: e.target.value })}
                                className="border p-2 w-60 xl:w-full rounded-md"
                            >
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Quantity</label>
                            <input
                                type="number"
                                min={1}
                                required
                                value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                                className="border p-2 w-60 xl:w-full rounded-md"
                            />
                        </div>

                        <div className="xl:col-span-2 flex gap-4 mt-2">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={closeEdit}
                                    className="px-4 py-2 rounded-md border bg-red-400 text-white hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                            >
                                {editing ? "Update Production" : "Add Production"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Productions Table */}
                <div className="bg-white p-6 mt-6 rounded-lg shadow-sm overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Recent Productions</h2>
                    <div className="max-h-[420px] overflow-y-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Product</th>
                                    <th className="p-3 border">Quantity</th>
                                    <th className="p-3 border">Created By</th>
                                    <th className="p-3 border">Date</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-center text-gray-500">
                                            Loading productions...
                                        </td>
                                    </tr>
                                ) : productions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-center">
                                            No recent productions.
                                        </td>
                                    </tr>
                                ) : (
                                    productions.map((p, i) => (
                                        <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-yellow-50"}>
                                            <td className="p-3">{i + 1}</td>
                                            <td className="p-3">{p.product?.name || "-"}</td>
                                            <td className="p-3">{p.quantity}</td>
                                            <td className="p-3">{p.createdBy}</td>
                                            <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
                                            <td className="p-3 flex flex-col xl:flex-row gap-2">
                                                <button onClick={() => openEdit(p)} className="text-blue-500 hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(p.id)} className="text-red-500 hover:underline">Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </DashboardLayout>
        </div>
    );
}
