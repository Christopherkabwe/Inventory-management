"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    packSize: number;
}

interface Location {
    id: string;
    name: string;
}

interface ProductionItem {
    productId: string;
    quantity: number;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    location: Location;
    createdById: string;
    updatedAt: string;
    items: { product: Product; quantity: number }[];
    notes?: string;
}

export default function ProductionPage() {
    const [productions, setProductions] = useState<Production[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [productionNo, setProductionNo] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [locationId, setLocationId] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<ProductionItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // ---------------- Fetch all data ----------------
    const fetchData = async () => {
        try {
            const [prodsRes, prodsListRes, locsRes] = await Promise.all([
                fetch("/api/rbac/productions"),
                fetch("/api/rbac/getProducts"),
                fetch("/api/rbac/locations"),
            ]);

            if (!prodsRes.ok || !prodsListRes.ok || !locsRes.ok) throw new Error("Failed to fetch data");

            const [prodsJson, prodsListJson, locsJson] = await Promise.all([
                prodsRes.json(),
                prodsListRes.json(),
                locsRes.json(),
            ]);

            setProductions(prodsJson.data || []);
            setProducts(prodsListJson.data || []);
            setLocations(locsJson.data || []);

            if (!editingId) await fetchNextSequence();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // ---------------- Fetch next ProductionNo & BatchNumber ----------------
    const fetchNextSequence = async () => {
        try {
            const res = await fetch("/api/rbac/productionSequence"); // endpoint calls nextSequence for PROD & BATCH
            const json = await res.json();
            setProductionNo(json.data.productionNo);
            setBatchNumber(json.data.batchNumber);
        } catch (error) {
            console.error("Failed to fetch production sequence:", error);
        }
    };

    // ---------------- Item management ----------------
    const addItem = () => setItems([...items, { productId: "", quantity: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index: number, field: keyof ProductionItem, value: any) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const resetForm = async () => {
        setBatchNumber("");
        setNotes("");
        setLocationId("");
        setItems([]);
        setEditingId(null);
        await fetchNextSequence();
    };

    // ---------------- Create or update ----------------
    const handleSubmit = async () => {
        if (!locationId || !batchNumber || items.length === 0 || items.some(i => !i.productId || i.quantity <= 0)) {
            alert("Please select at least one item and fill all quantities > 0");
            return;
        }

        setLoading(true);

        try {
            if (editingId) {
                await fetch(`/api/rbac/productions/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes, items }),
                });
            } else {
                await fetch("/api/rbac/productions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ productionNo, batchNumber, locationId, notes, items }),
                });
            }

            await resetForm();
            await fetchData();
        } catch (error) {
            console.error("Error saving production:", error);
            alert("Failed to save production");
        }

        setLoading(false);
    };

    // ---------------- Edit / Delete ----------------
    const handleEdit = (prod: Production) => {
        setEditingId(prod.id);
        setProductionNo(prod.productionNo);
        setBatchNumber(prod.batchNumber);
        setNotes(prod.notes || "");
        setLocationId(prod.location.id);
        setItems(prod.items.map(i => ({ productId: i.product.id, quantity: i.quantity })));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this production?")) return;
        setLoading(true);

        try {
            await fetch(`/api/rbac/productions/${id}`, { method: "DELETE" });
            await fetchData();
        } catch (error) {
            console.error("Error deleting production:", error);
            alert("Failed to delete production");
        }

        setLoading(false);
    };

    // ---------------- Render ----------------
    return (
        <DashboardLayout>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Production Management</h1>

                {/* Form */}
                <div className="mb-6 border p-4 rounded-lg shadow">
                    <h2 className="font-semibold mb-2">{editingId ? "Edit Production" : "Create Production"}</h2>

                    {/* ProductionNo, Batch, Location */}
                    <div className="flex gap-4 mb-2">
                        <div className="flex flex-col flex-1">
                            <label className="font-medium">Production No</label>
                            <input className="border p-2" value={productionNo} readOnly />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="font-medium">Batch Number</label>
                            <input
                                className="border p-2"
                                placeholder="Batch Number"
                                value={batchNumber}
                                onChange={e => setBatchNumber(e.target.value)}
                            />
                        </div>
                        <div className="flex flex-col flex-1">
                            <label className="font-medium">Location</label>
                            <select
                                className="border p-2"
                                value={locationId}
                                onChange={e => setLocationId(e.target.value)}
                            >
                                <option value="">Select Location</option>
                                {locations.map(loc => (
                                    <option key={loc.id} value={loc.id}>{loc.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Notes */}
                    <div className="flex flex-col mb-2">
                        <label className="font-medium">Notes</label>
                        <textarea
                            className="border p-2 w-full"
                            placeholder="Notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                        />
                    </div>

                    {/* Items */}
                    {items.map((item, index) => {
                        const selectedProduct = products.find(p => p.id === item.productId);
                        return (
                            <div key={index} className="border p-2 mb-2 rounded flex flex-col gap-2">
                                <div className="flex flex-col">
                                    <label className="font-medium">Product</label>
                                    <select
                                        className="border p-2"
                                        value={item.productId}
                                        onChange={e => handleItemChange(index, "productId", e.target.value)}
                                    >
                                        <option value="">Select Product</option>
                                        {products.map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex gap-2 flex-wrap">
                                    <div className="flex flex-col flex-1">
                                        <label className="font-medium">SKU</label>
                                        <input type="text" className="border p-2" value={selectedProduct?.sku || ""} readOnly />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="font-medium">Price</label>
                                        <input type="number" className="border p-2" value={selectedProduct?.price || 0} readOnly />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="font-medium">Pack Size</label>
                                        <input type="number" className="border p-2" value={selectedProduct?.packSize || 0} readOnly />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="font-medium">Quantity</label>
                                        <input
                                            type="number"
                                            className="border p-2"
                                            value={item.quantity}
                                            onChange={e => handleItemChange(index, "quantity", parseInt(e.target.value))}
                                            min={1}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeItem(index)}>Remove</button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}

                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded mb-2"
                        onClick={addItem}
                        disabled={products.length === 0}
                    >
                        + Add Item
                    </button>

                    <div>
                        <button
                            className={`bg-green-500 text-white px-4 py-2 rounded ${loading ? "opacity-50" : ""}`}
                            onClick={handleSubmit}
                            disabled={loading}
                        >
                            {editingId ? "Update Production" : "Save Production"}
                        </button>
                        {editingId && (
                            <button className="ml-2 px-4 py-2 border rounded" onClick={resetForm}>Cancel</button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto border rounded-lg shadow">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Production No</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Batch</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Location</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Created By</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Items (Name - SKU - Price - Pack - Qty)</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Updated At</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {productions.map((p) => (
                                <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100">
                                    <td className="px-4 py-2 text-sm text-gray-800">{p.productionNo}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{p.batchNumber}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{p.location.name}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{p.createdById}</td>
                                    <td className="px-4 py-2 text-sm text-gray-800">
                                        {p.items.map((i) => (
                                            <div key={i.product.id} className="mb-1">
                                                <span className="font-medium">{i.product.name}</span> | {i.product.sku} | ${i.product.price} | Pack: {i.product.packSize} | Qty: {i.quantity}
                                            </div>
                                        ))}
                                    </td>
                                    <td className="px-4 py-2 text-sm text-gray-800">{new Date(p.updatedAt).toLocaleString()}</td>
                                    <td className="px-4 py-2 flex gap-2">
                                        <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white" onClick={() => handleEdit(p)}>Edit</button>
                                        <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white" onClick={() => handleDelete(p.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </DashboardLayout>
    );
}
