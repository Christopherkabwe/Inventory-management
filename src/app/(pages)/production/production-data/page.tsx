"use client";

import DashboardLayout from "@/components/DashboardLayout";
import Loading from "@/components/Loading";
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
    const [loading, setLoading] = useState(true);
    const [viewingProduction, setViewingProduction] = useState<Production | null>(null);

    const [isFetchingSequence, setIsFetchingSequence] = useState(false);

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
        fetchData().finally(() => setLoading(false));
    }, []);

    // ---------------- Fetch next ProductionNo & BatchNumber ----------------
    const fetchNextSequence = async () => {
        if (isFetchingSequence) return;
        setIsFetchingSequence(true);
        try {
            const res = await fetch("/api/rbac/productionSequence");
            const json = await res.json();
            setProductionNo(json.data.productionNo);
            setBatchNumber(json.data.batchNumber);
        } catch (error) {
            console.error("Failed to fetch production sequence:", error);
        } finally {
            setIsFetchingSequence(false);
        }
    };

    // ---------------- Item management ----------------
    const addItem = () => setItems([...items, { productId: "", quantity: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index: number, field: keyof ProductionItem, value: any) => {
        const newItems = [...items];
        if (field === "quantity") value = Number(value) || 0;
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
            // Prepare items safely
            const safeItems = items.map(i => ({
                productId: i.productId,
                quantity: Number(i.quantity) || 0, // cast to number
            }));

            const payload = {
                productionNo,
                batchNumber,
                locationId,
                notes,
                items: safeItems,
                createdById: "cmk40hu1n00013ooqrcrur0ny", // replace with actual logged-in user ID
            };

            if (editingId) {
                const response = await fetch(`/api/rbac/productions/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes, items: safeItems }),
                });
                if (!response.ok) {
                    throw new Error('Failed to update production');
                }
            } else {
                const response = await fetch("/api/rbac/productions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error('Failed to create production');
                }
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
        setItems(prod.items.map(i => ({ productId: i.product.id, quantity: i.quantity || 0 })));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this production?")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/rbac/productions/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            await fetchData();
        } catch (error) {
            console.error("Error deleting production:", error);
            alert("Failed to delete production");
        }

        setLoading(false);
    };

    // ---------------- Render ----------------
    return (
        <div>
            <div className="p-6">
                <h1 className="text-2xl font-bold">Production Management</h1>
                <p className="mb-2 text-gray-500">Record and manage Production transactions</p>

                {/* Production Table */}
                <div className="bg-white overflow-auto border shadow p-2 rounded-lg hover:shadow-lg transition-shadow">
                    <table className="min-w-full border-collapse border border-black">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">#</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Production No</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Batch</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Location</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Created By</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Updated At</th>
                                <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 border border-black border-t-2">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-x divide-black">
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        <Loading
                                            message="Loading Production Data"
                                        />
                                    </td>
                                </tr>
                            ) : productions.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        No productions found.
                                    </td>
                                </tr>
                            ) : (
                                productions.map((p, index) => (
                                    <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100">
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{index + 1}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{p.productionNo}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{p.batchNumber}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{p.location.name}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{p.createdById}</td>
                                        <td className="px-4 py-2 text-sm text-gray-800 border-r border-black">{new Date(p.updatedAt).toLocaleString()}</td>
                                        <td className="px-4 py-2 flex gap-2">
                                            <button className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white" onClick={() => setViewingProduction(p)}>View</button>
                                            <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white" onClick={() => handleEdit(p)}>Edit</button>
                                            <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white" onClick={() => handleDelete(p.id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* View Modal */}
                {viewingProduction && (
                    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-11/12 max-w-3xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-xl font-bold mb-4">Production Details: {viewingProduction.productionNo}</h2>
                            <p className="mb-2"><strong>Batch:</strong> {viewingProduction.batchNumber}</p>
                            <p className="mb-2"><strong>Location:</strong> {viewingProduction.location.name}</p>
                            <p className="mb-2"><strong>Created By:</strong> {viewingProduction.createdById}</p>
                            <p className="mb-2"><strong>Notes:</strong> {viewingProduction.notes || "-"}</p>
                            <table className="w-full border-collapse border mb-4">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-2 py-1 border">Product</th>
                                        <th className="px-2 py-1 border">SKU</th>
                                        <th className="px-2 py-1 border">Price</th>
                                        <th className="px-2 py-1 border">Pack Size</th>
                                        <th className="px-2 py-1 border">Quantity</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {viewingProduction.items.map(i => (
                                        <tr key={i.product.id} className="border-b">
                                            <td className="px-2 py-1 border">{i.product.name}</td>
                                            <td className="px-2 py-1 border">{i.product.sku}</td>
                                            <td className="px-2 py-1 border">{i.product.price}</td>
                                            <td className="px-2 py-1 border">{i.product.packSize}</td>
                                            <td className="px-2 py-1 border">{i.quantity}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setViewingProduction(null)}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
