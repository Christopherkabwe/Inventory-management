"use client";
import Sidebar from "@/components/sidebar2";
import { useEffect, useState, useCallback } from "react";
import { Clock, X } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

type Product = {
    id: string;
    name: string;
    sku: string;
    packSize: string;
    weightValue: string;
    weightUnit: string;
};
type Location = { id: string; name: string };
type Transfer = {
    id: string;
    product: Product;
    fromLocation: Location | null;
    toLocation: Location | null;
    quantity: number;
    transferDate: string;
};

export const metadata = {
    title: "Stock Transfer",
};

export default function TransfersPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [loadingTransfers, setLoadingTransfers] = useState<boolean>(true);
    const [editingTransfer, setEditingTransfer] = useState<Transfer | null>(null);
    const [form, setForm] = useState({
        productId: "",
        fromLocationId: "",
        toLocationId: "",
        quantity: 0,
    });
    const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);
    const [availableLoading, setAvailableLoading] = useState(false);
    const [bulkTransfers, setBulkTransfers] = useState<
        { productId: string; fromLocationId: string; toLocationId: string; quantity: number }[]
    >([]);


    // Load products, locations, and recent transfers
    useEffect(() => {
        async function loadData() {
            try {
                const [productsRes, locationsRes, transfersRes] = await Promise.all([
                    fetch("/api/products").then(r => r.json()),
                    fetch("/api/locations").then(r => r.json()),
                    fetch("/api/transfers?limit=10").then(r => r.json()),
                ]);

                setProducts(Array.isArray(productsRes) ? productsRes : productsRes.products || []);
                setLocations(Array.isArray(locationsRes) ? locationsRes : locationsRes.locations || []);
                setTransfers(Array.isArray(transfersRes) ? transfersRes : transfersRes.transfers || []);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoadingTransfers(false);
            }
        }
        loadData();
    }, []);

    const selectedProduct = products.find(p => p.id === form.productId);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (availableLoading) {
            alert("Checking available stock, please wait...");
            return;
        }

        if (form.quantity > (availableQuantity ?? 0)) {
            alert("Quantity exceeds available stock");
            return;
        }

        try {
            let res;
            if (editingTransfer) {
                // Update transfer
                res = await fetch(`/api/transfers/${editingTransfer.id}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: form.productId,
                        fromLocationId: form.fromLocationId || null,
                        toLocationId: form.toLocationId || null,
                        quantity: form.quantity,
                    }),
                });
            } else {
                // Create transfer
                res = await fetch("/api/transfers", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        productId: form.productId,
                        fromLocationId: form.fromLocationId || null,
                        toLocationId: form.toLocationId || null,
                        quantity: form.quantity,
                    }),
                });
            }

            if (!res.ok) throw new Error("Failed to save transfer");

            const data = await res.json();
            alert(editingTransfer ? "Transfer updated!" : "Transfer created!");

            if (editingTransfer) {
                setTransfers(prev => prev.map(t => t.id === editingTransfer.id ? data.transfer : t));
                setEditingTransfer(null);
            } else {
                setTransfers(prev => [data.transfer, ...prev.slice(0, 9)]);
            }

            setForm({ productId: "", fromLocationId: "", toLocationId: "", quantity: 0 });
        } catch (err) {
            console.error(err);
            alert("Failed to save transfer");
        }
    };

    // Fetch available Quantity
    const fetchAvailableQuantity = useCallback(async (productId: string, locationId: string) => {
        setAvailableLoading(true);
        try {
            const res = await fetch(`/api/inventory/available?productId=${productId}&locationId=${locationId}`);
            const data = await res.json();
            setAvailableQuantity(data.availableQuantity);
        } catch (err) {
            console.error(err);
            setAvailableQuantity(null);
        } finally {
            setAvailableLoading(false);
        }
    }, []);


    useEffect(() => {
        if (form.productId && form.fromLocationId) {
            fetchAvailableQuantity(form.productId, form.fromLocationId);
        } else {
            setAvailableQuantity(null);
        }
    }, [form.productId, form.fromLocationId]); // removed fetchAvailableQuantity from deps

    useEffect(() => {
        if (editingTransfer?.fromLocation?.id) {
            fetchAvailableQuantity(editingTransfer.product.id, editingTransfer.fromLocation.id);
        }
    }, [editingTransfer]);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this transfer?")) return;
        try {
            const res = await fetch(`/api/transfers/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete transfer");
            setTransfers(prev => prev.filter(t => t.id !== id));
            alert("Transfer deleted!");
        } catch (err) {
            console.error(err);
            alert("Failed to delete transfer");
        }
    };

    const openEditModal = (transfer?: Transfer) => {
        if (!transfer) return;

        setEditingTransfer(transfer);
        setForm({
            productId: transfer.product?.id || "",
            fromLocationId: transfer.fromLocation?.id || "",
            toLocationId: transfer.toLocation?.id || "",
            quantity: transfer.quantity,
        });

        if (transfer.fromLocation?.id) {
            fetchAvailableQuantity(transfer.product.id, transfer.fromLocation.id);
        }
    };

    const closeEditModal = () => {
        setEditingTransfer(null);
        setForm({ productId: "", fromLocationId: "", toLocationId: "", quantity: 0 });
    };

    const addToBulkTransfers = () => {
        if (!form.productId || !form.fromLocationId || !form.toLocationId || form.quantity <= 0) {
            alert("Please fill in all fields with valid data");
            return;
        }
        if (form.quantity > (availableQuantity ?? 0)) {
            alert("Quantity exceeds available stock");
            return;
        }
        setBulkTransfers(prev => [...prev, {
            productId: form.productId,
            fromLocationId: form.fromLocationId,
            toLocationId: form.toLocationId,
            quantity: form.quantity
        }]);
        setForm({
            productId: "",
            fromLocationId: "",
            toLocationId: "",
            quantity: 0
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 overflow-x-auto">

            <DashboardLayout>
                <div className="mb-5">
                    <h1 className="text-2xl font-semibold mb-1">Create Stock Transfer</h1>
                    <p className="text-gray-500">Transfer stock within the organisation</p>
                </div>

                <div className="bg-white p-6 rounded-lg hover:shadow-lg transition-shadow">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 w-60 xl:grid-cols-2 gap-4 xl:w-full">
                        <div >
                            <label className="block text-sm text-gray-700 mb-2">Select Sender's Location</label>
                            <select
                                required
                                value={form.fromLocationId}
                                onChange={e => setForm({ ...form, fromLocationId: e.target.value })}
                                className="border p-2 w-60 rounded-md xl:w-full"
                            >
                                <option value="">From Location</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Select Receiver's Location</label>
                            <select
                                required
                                value={form.toLocationId}
                                onChange={e => setForm({ ...form, toLocationId: e.target.value })}
                                className="border p-2 w-60 rounded-md xl:w-full"
                            >
                                <option value="">To Location</option>
                                {locations.map(l => <option key={l.id} value={l.id}>{l.name}</option>)}
                            </select>
                        </div>
                        <div className="grid grid-cols-1 space-y-1">
                            <label className="block text-sm text-gray-700 mb-2">Select Product Name</label>
                            <select
                                required
                                value={form.productId}
                                onChange={e => setForm({ ...form, productId: e.target.value })}
                                className="border p-2 w-60 rounded-md xl:w-full"
                            >
                                <option value="">Select Product</option>
                                {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                            </select>
                            <span className="text-xs text-gray-700">
                                Available Stock:{" "}
                                {availableLoading ? (
                                    <span className="text-gray-400 italic">Loading...</span>
                                ) : (
                                    <input type="number" readOnly value={availableQuantity ?? ""} className="px-2" />
                                )}
                            </span>
                            {selectedProduct && editingTransfer && (
                                <div className="text-sm text-gray-600 space-y-1">
                                    <div><strong>SKU:</strong> {selectedProduct.sku}</div>
                                    <div><strong>Pack Size:</strong> {selectedProduct.packSize}</div>
                                    <div><strong>Weight:</strong> {selectedProduct.weightValue}</div>
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm text-gray-700 mb-2">Enter Transfer Quantity</label>
                            <input
                                type="number"
                                min={1}
                                required
                                value={form.quantity}
                                onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                                placeholder="Quantity"
                                className="border p-2 w-60 xl:w-full h-10 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            />
                        </div>
                        <div>
                            <button type="submit" className="w-60 xl:w-full h-10 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors duration-200" >
                                {editingTransfer ? "Update Transfer" : "Create Stock Transfer"}
                            </button>
                        </div>
                        <div>
                            <button type="button" onClick={addToBulkTransfers} className="w-60 xl:w-full h-10 bg-purple-500 text-white px-4 py-2 rounded-md hover:bg-purple-600 transition-colors duration-200" >
                                Add to Bulk Transfers
                            </button>
                        </div>
                    </form>
                </div>
                <div className="bg-white p-6 mt-6 rounded-lg shadow-sm overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Bulk Stock Transfers</h2>
                    <table className="min-w-[700px] w-full border-collapse border mb-4">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="p-2 text-sm xl:text-base border">Product</th>
                                <th className="p-2 text-sm xl:text-base border">From</th>
                                <th className="p-2 text-sm xl:text-base border">To</th>
                                <th className="p-2 text-sm xl:text-base border">Quantity</th>
                                <th className="p-2 text-sm xl:text-base border">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bulkTransfers.map((t, i) => (
                                <tr key={i}>
                                    <td className="p-2 text-sm xl:text-base border">{products.find(p => p.id === t.productId)?.name || "-"}</td>
                                    <td className="p-2 text-sm xl:text-base border">{locations.find(l => l.id === t.fromLocationId)?.name || "-"}</td>
                                    <td className="p-2 text-sm xl:text-base border">{locations.find(l => l.id === t.toLocationId)?.name || "-"}</td>
                                    <td className="p-2 text-sm xl:text-base border">{t.quantity}</td>
                                    <td className="p-2 text-sm xl:text-base border">
                                        <button
                                            onClick={() => setBulkTransfers(prev => prev.filter((_, idx) => idx !== i))}
                                            className="text-red-500 hover:underline"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <button
                        onClick={async () => {
                            try {
                                for (const t of bulkTransfers) {
                                    const res = await fetch("/api/transfers", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify(t),
                                    });
                                    if (!res.ok) throw new Error("Failed to create transfer");
                                }
                                alert("Bulk transfers created!");
                                setBulkTransfers([]);
                                // Optionally refresh your transfers list
                            } catch (err) {
                                console.error(err);
                                alert("Failed to create bulk transfers");
                            }
                        }}
                        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                        Submit Bulk Transfers
                    </button>
                </div>
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow mt-5">
                    <h3 className="flex items-center font-semibold mb-4">
                        <Clock className="h-5 w-5 mr-2 text-blue-500" /> Recent Transfers
                    </h3>
                    <div className="max-h-[420px] overflow-y-auto ">
                        <table className="min-w-full">
                            <thead className="sticky top-0 bg-gray-200">
                                <tr>
                                    <th className="p-3 text-left">#</th>
                                    <th className="p-3 text-left">Product</th>
                                    <th className="p-3 text-left">From</th>
                                    <th className="p-3 text-left">To</th>
                                    <th className="p-3 text-left">Quantity</th>
                                    <th className="hidden xl:table-cell p-3 text-left">Date</th>
                                    <th className="p-3 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loadingTransfers ? (
                                    <tr>
                                        <td colSpan={7} className="p-3 text-center text-gray-500">
                                            Loading transfer data...
                                        </td>
                                    </tr>
                                ) : transfers.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="p-3 text-center">No recent transfers.</td>
                                    </tr>
                                ) : (
                                    transfers.map((t, i) => (
                                        <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50 hover:bg-yellow-50"}>
                                            <td className="p-3">{i + 1}</td>
                                            <td className="p-3">{t.product?.name || "-"}</td>
                                            <td className="p-3">{t.fromLocation?.name || "-"}</td>
                                            <td className="p-3">{t.toLocation?.name || "-"}</td>
                                            <td className="p-3">{t.quantity}</td>
                                            <td className="hidden xl:table-cell p-3">
                                                {new Date(t.transferDate).toLocaleString()}
                                            </td>
                                            <td className="p-3 flex flex-col xl:flex-row gap-2">
                                                <button
                                                    onClick={() => openEditModal(t)}
                                                    className="text-blue-500 hover:underline"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(t.id)}
                                                    className="text-red-500 hover:underline"
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
                </div>

                {/* Full-screen edit modal */}
                {editingTransfer && (
                    <div className="fixed inset-0 z-50 bg-black/50">
                        <div className="absolute inset-0 bg-gray-50 overflow-y-auto overflow-x-hidden">
                            <div className="max-w-5xl mx-auto py-10 px-6">
                                {/* Header */}
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-2xl font-semibold text-gray-800">
                                        Edit Stock Transfer
                                    </h2>
                                    <button
                                        onClick={closeEditModal}
                                        className="text-gray-500 hover:text-gray-800"
                                    >
                                        ✕
                                    </button>
                                </div>

                                {/* Card */}
                                <div className="bg-white rounded-xl border shadow-sm p-8">
                                    <form
                                        onSubmit={handleSubmit}
                                        className="grid grid-cols-1 xl:grid-cols-2 gap-6"
                                    >
                                        {/* Product */}
                                        <div className="xl:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product Name *
                                            </label>
                                            <select
                                                value={form.productId}
                                                onChange={(e) =>
                                                    setForm({ ...form, productId: e.target.value })
                                                }
                                                className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-purple-400"
                                                required
                                            >
                                                <option value="">Select Product</option>
                                                {products.map((p) => (
                                                    <option key={p.id} value={p.id}>
                                                        {p.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        {/* ID */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Product Id
                                            </label>
                                            <input
                                                readOnly
                                                value={selectedProduct?.id || ""}
                                                className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                            />
                                        </div>

                                        {/* SKU */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                SKU
                                            </label>
                                            <input
                                                readOnly
                                                value={selectedProduct?.sku || ""}
                                                className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                            />
                                        </div>

                                        {/* Pack Size */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Pack Size
                                            </label>
                                            <input
                                                readOnly
                                                value={selectedProduct?.packSize || ""}
                                                className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                            />
                                        </div>

                                        {/* Weight Value*/}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weight Value
                                            </label>
                                            <input
                                                readOnly
                                                value={selectedProduct?.weightValue || ""}
                                                className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                            />
                                        </div>
                                        {/* Weight Unit */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Weight Unit
                                            </label>
                                            <input
                                                readOnly
                                                value={selectedProduct?.weightUnit || ""}
                                                className="w-full rounded-md border bg-gray-100 px-4 py-2"
                                            />
                                        </div>
                                        {/* Quantity */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Quantity *
                                            </label>
                                            <input
                                                type="number"
                                                min={1}
                                                value={form.quantity}
                                                onChange={(e) =>
                                                    setForm({ ...form, quantity: Number(e.target.value) })
                                                }
                                                className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-purple-400"
                                                required
                                            />
                                        </div>
                                        {/* From Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                From Location *
                                            </label>
                                            <select
                                                value={form.fromLocationId}
                                                onChange={(e) =>
                                                    setForm({ ...form, fromLocationId: e.target.value })
                                                }
                                                className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-purple-400"
                                                required
                                            >
                                                <option value="">Select Location</option>
                                                {locations.map((l) => (
                                                    <option key={l.id} value={l.id}>
                                                        {l.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>


                                        {/* To Location */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                To Location *
                                            </label>
                                            <select
                                                value={form.toLocationId}
                                                onChange={(e) =>
                                                    setForm({ ...form, toLocationId: e.target.value })
                                                }
                                                className="w-full rounded-md border px-4 py-2 focus:ring-2 focus:ring-purple-400"
                                                required
                                            >
                                                <option value="">Select Location</option>
                                                {locations.map((l) => (
                                                    <option key={l.id} value={l.id}>
                                                        {l.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>



                                        {/* Actions */}
                                        <div className="xl:col-span-2 flex flex-col xl:flex-row justify-center gap-4 mt-6">
                                            <button
                                                type="button"
                                                onClick={closeEditModal}
                                                className="px-6 py-2 rounded-md border bg-red-400 text-white hover:bg-red-500"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                className="px-6 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                                            >
                                                Update Transfer
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </div>
    );
}
