"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect, useCallback } from "react";
import { Clock, X } from "lucide-react";

type Product = {
    id: string;
    name: string;
    sku: string;
    packSize: string;
    weightValue: string;
    weightUnit: string;
};

type Location = { id: string; name: string };

type Adjustment = {
    id: string;
    type: string;
    product?: Product;
    gainProduct?: Product;  // For REBAG
    lossProduct?: Product;  // For REBAG
    location: Location;
    quantity: number;
    reason?: string;
    createdAt: string;
};

export default function AdjustmentsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [adjustments, setAdjustments] = useState<Adjustment[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<Adjustment | null>(null);

    const [form, setForm] = useState({
        adjustmentType: "",
        productId: "",
        rebagGainProductId: "",
        rebagLossProductId: "",
        locationId: "",
        quantity: 0,
        reason: "",
    });

    // Load initial data
    useEffect(() => {
        async function loadData() {
            try {
                const [productsRes, locationsRes, adjustmentsRes] = await Promise.all([
                    fetch("/api/products").then(r => r.json()),
                    fetch("/api/locations").then(r => r.json()),
                    fetch("/api/adjustments?limit=10").then(r => r.json()),
                ]);

                setProducts(Array.isArray(productsRes) ? productsRes : productsRes.products || []);
                setLocations(Array.isArray(locationsRes) ? locationsRes : locationsRes.locations || []);
                setAdjustments(Array.isArray(adjustmentsRes) ? adjustmentsRes : adjustmentsRes.adjustments || []);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    const selectedProduct = products.find(p => p.id === form.productId);
    const selectedGainProduct = products.find(p => p.id === form.rebagGainProductId);
    const selectedLossProduct = products.find(p => p.id === form.rebagLossProductId);

    // Submit form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!form.locationId || !form.quantity || form.quantity <= 0 || !form.adjustmentType) {
            alert("Please fill all required fields.");
            return;
        }

        let payload: any = {
            type: form.adjustmentType,
            locationId: form.locationId,
            quantity: form.quantity,
            reason: form.reason,
        };

        if (form.adjustmentType === "REBAG") {
            if (!form.rebagGainProductId || !form.rebagLossProductId) {
                alert("Please select both gain and loss products for REBAG.");
                return;
            }
            payload.gainProductId = form.rebagGainProductId;
            payload.lossProductId = form.rebagLossProductId;
        } else {
            if (!form.productId) {
                alert("Please select a product.");
                return;
            }
            payload.productId = form.productId;
        }

        try {
            const res = await fetch(editing ? `/api/adjustments/${editing.id}` : "/api/adjustments", {
                method: editing ? "PUT" : "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Failed to save adjustment");

            const data = await res.json();
            alert(editing ? "Adjustment updated!" : "Adjustment created!");

            if (editing) {
                setAdjustments(prev => prev.map(a => a.id === editing.id ? data.adjustment : a));
                setEditing(null);
            } else {
                setAdjustments(prev => [data.adjustment, ...prev.slice(0, 9)]);
            }

            setForm({
                adjustmentType: "",
                productId: "",
                rebagGainProductId: "",
                rebagLossProductId: "",
                locationId: "",
                quantity: 0,
                reason: "",
            });
        } catch (err) {
            console.error(err);
            alert("Failed to save adjustment");
        }
    };

    const openEditModal = (adj: Adjustment) => {
        setEditing(adj);
        setForm({
            adjustmentType: adj.type,
            productId: adj.product?.id || "",
            rebagGainProductId: adj.gainProduct?.id || "",
            rebagLossProductId: adj.lossProduct?.id || "",
            locationId: adj.location?.id || "",
            quantity: adj.quantity,
            reason: adj.reason || "",
        });
    };

    const closeEditModal = () => {
        setEditing(null);
        setForm({
            adjustmentType: "",
            productId: "",
            rebagGainProductId: "",
            rebagLossProductId: "",
            locationId: "",
            quantity: 0,
            reason: "",
        });
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this adjustment?")) return;
        try {
            const res = await fetch(`/api/adjustments/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete adjustment");
            setAdjustments(prev => prev.filter(a => a.id !== id));
            alert("Adjustment deleted!");
        } catch (err) {
            console.error(err);
            alert("Failed to delete adjustment");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 overflow-x-auto">
            <DashboardLayout>
                <div className="mb-5">
                    <h1 className="text-2xl font-semibold mb-1">Create Stock Adjustment</h1>
                    <p className="text-gray-500">Adjust stock within the organisation</p>
                </div>

                {/* Form */}
                <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                        {/* Adjustment Type */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Adjustment Type</label>
                            <select
                                required
                                value={form.adjustmentType}
                                onChange={e => setForm({ ...form, adjustmentType: e.target.value })}
                                className="border p-2 w-60 xl:w-full rounded-md"
                            >
                                <option value="">Select Type</option>
                                <option value="REBAG">Rebag</option>
                                <option value="DAMAGED">Damaged</option>
                                <option value="EXPIRED">Expired</option>
                                <option value="OTHER">Other</option>
                            </select>
                        </div>

                        {/* Location */}
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Location</label>
                            <select
                                required
                                value={form.locationId}
                                onChange={e => setForm({ ...form, locationId: e.target.value })}
                                className="border p-2 w-60 xl:w-full rounded-md"
                            >
                                <option value="">Select Location</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>

                        {/* Regular Product (if not REBAG) */}
                        {form.adjustmentType !== "REBAG" && (
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
                        )}

                        {/* REBAG Products */}
                        {form.adjustmentType === "REBAG" && (
                            <>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Rebag Gain Product</label>
                                    <select
                                        required
                                        value={form.rebagGainProductId}
                                        onChange={e => setForm({ ...form, rebagGainProductId: e.target.value })}
                                        className="border p-2 w-60 xl:w-full rounded-md"
                                    >
                                        <option value="">Select Gain Product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-700 mb-2">Rebag Loss Product</label>
                                    <select
                                        required
                                        value={form.rebagLossProductId}
                                        onChange={e => setForm({ ...form, rebagLossProductId: e.target.value })}
                                        className="border p-2 w-60 xl:w-full rounded-md"
                                    >
                                        <option value="">Select Loss Product</option>
                                        {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                                    </select>
                                </div>
                            </>
                        )}

                        {/* Quantity */}
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

                        {/* Reason */}
                        <div className="xl:col-span-2">
                            <label className="block text-sm text-gray-700 mb-2">Reason</label>
                            <input
                                type="text"
                                value={form.reason}
                                onChange={e => setForm({ ...form, reason: e.target.value })}
                                placeholder="Optional note"
                                className="border p-2 w-60 xl:w-full rounded-md"
                            />
                        </div>

                        {/* Actions */}
                        <div className="xl:col-span-2 flex flex-col xl:flex-row gap-4 mt-2">
                            {editing && (
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="px-4 py-2 rounded-md border bg-red-400 text-white hover:bg-red-500"
                                >
                                    Cancel
                                </button>
                            )}
                            <button
                                type="submit"
                                className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                            >
                                {editing ? "Update Adjustment" : "Create Adjustment"}
                            </button>
                        </div>
                    </form>
                </div>

                {/* Recent Adjustments Table */}
                <div className="bg-white p-6 mt-6 rounded-lg shadow-sm overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Recent Adjustments</h2>
                    <div className="max-h-[420px] overflow-y-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Type</th>
                                    <th className="p-3 border">Product</th>
                                    <th className="p-3 border">Location</th>
                                    <th className="p-3 border">Quantity</th>
                                    <th className="p-3 border">Reason</th>
                                    <th className="p-3 border">Date</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center text-gray-500">
                                            Loading adjustments...
                                        </td>
                                    </tr>
                                ) : adjustments.length === 0 ? (
                                    <tr>
                                        <td colSpan={8} className="p-3 text-center">
                                            No recent adjustments.
                                        </td>
                                    </tr>
                                ) : (
                                    adjustments.map((a, i) => (
                                        <tr key={a.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-yellow-50"}>
                                            <td className="p-3">{i + 1}</td>
                                            <td className="p-3">{a.type}</td>
                                            <td className="p-3">
                                                {a.type === "REBAG"
                                                    ? `Gain: ${a.gainProduct?.name || "-"} / Loss: ${a.lossProduct?.name || "-"}`
                                                    : a.product?.name || "-"}
                                            </td>
                                            <td className="p-3">{a.location?.name || "-"}</td>
                                            <td className="p-3">{a.quantity}</td>
                                            <td className="p-3">{a.reason || "-"}</td>
                                            <td className="p-3">{new Date(a.createdAt).toLocaleString()}</td>
                                            <td className="p-3 flex flex-col xl:flex-row gap-2">
                                                <button onClick={() => openEditModal(a)} className="text-blue-500 hover:underline">Edit</button>
                                                <button onClick={() => handleDelete(a.id)} className="text-red-500 hover:underline">Delete</button>
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
