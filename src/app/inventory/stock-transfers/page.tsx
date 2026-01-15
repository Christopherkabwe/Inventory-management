"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Clock } from "lucide-react";
import DashboardLayout from "@/components/DashboardLayout";

/* ===================== TYPES ===================== */

type Product = {
    id: string;
    name: string;
    sku: string;
    packSize: string;
    weightValue: string;
    weightUnit: string;
};

type Location = {
    id: string;
    name: string;
};

type Transfer = {
    id: string;
    productId: string;
    fromLocationId: string | null;
    toLocationId: string | null;
    quantity: number;
    transferDate: string;
};

type BulkTransfer = {
    productId: string;
    fromLocationId: string;
    toLocationId: string;
    quantity: number;
};

/* ===================== PAGE ===================== */

export default function TransfersPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [transfers, setTransfers] = useState<Transfer[]>([]);
    const [loadingTransfers, setLoadingTransfers] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const [form, setForm] = useState({
        productId: "",
        fromLocationId: "",
        toLocationId: "",
        quantity: 0,
    });

    const [availableQuantity, setAvailableQuantity] = useState<number | null>(null);
    const [availableLoading, setAvailableLoading] = useState(false);

    const [bulkTransfers, setBulkTransfers] = useState<BulkTransfer[]>([]);

    /* ===================== LOAD DATA ===================== */

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                const [p, l, t] = await Promise.all([
                    fetch("/api/products").then(r => r.json()),
                    fetch("/api/locations").then(r => r.json()),
                    fetch("/api/transfers?limit=100").then(r => r.json()),
                ]);
                setProducts(p.data ?? []);
                setLocations(l.data ?? []);
                setTransfers(t.data ?? []);
            } catch (err) {
                console.error("Failed to load data", err);
                setError(true);
            } finally {
                setLoadingTransfers(false);
                setLoading(false);
            }
        };
        loadData();

    }, []);


    /* ===================== MEMOS ===================== */

    const selectedProduct = useMemo(
        () => products.find(p => p.id === form.productId),
        [products, form.productId]
    );

    const productMap = useMemo(
        () => Object.fromEntries(products.map(p => [p.id, p])),
        [products]
    );

    const locationMap = useMemo(
        () => Object.fromEntries(locations.map(l => [l.id, l])),
        [locations]
    );

    /* ===================== AVAILABLE STOCK ===================== */

    const fetchAvailableQuantity = useCallback(
        async (productId: string, locationId: string) => {
            setAvailableLoading(true);
            try {
                const res = await fetch(
                    `/api/inventory/available?productId=${productId}&locationId=${locationId}`
                );
                const data = await res.json();
                setAvailableQuantity(data.availableQuantity ?? null);
            } catch {
                setAvailableQuantity(null);
            } finally {
                setAvailableLoading(false);
            }
        },
        []
    );

    useEffect(() => {
        if (form.productId && form.fromLocationId) {
            fetchAvailableQuantity(form.productId, form.fromLocationId);
        } else {
            setAvailableQuantity(null);
        }
    }, [form.productId, form.fromLocationId, fetchAvailableQuantity]);

    /* ===================== FORM ===================== */

    const isFormValid =
        form.productId &&
        form.fromLocationId &&
        form.toLocationId &&
        form.quantity > 0 &&
        !availableLoading &&
        (availableQuantity === null || form.quantity <= availableQuantity);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!isFormValid) return;

        try {
            const res = await fetch("/api/rbac/transfers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId: form.productId,
                    fromLocationId: form.fromLocationId,
                    toLocationId: form.toLocationId,
                    quantity: form.quantity,
                }),
            });

            if (!res.ok) throw new Error();

            const data = await res.json();
            setTransfers(prev => [data.transfer, ...prev.slice(0, 9)]);

            setForm({
                productId: "",
                fromLocationId: "",
                toLocationId: "",
                quantity: 0,
            });
        } catch {
            alert("Failed to create transfer");
        }
    };

    /* ===================== BULK ===================== */

    const addToBulkTransfers = () => {
        if (!isFormValid) {
            alert("Invalid transfer data");
            return;
        }

        setBulkTransfers(prev => [
            ...prev,
            {
                productId: form.productId,
                fromLocationId: form.fromLocationId,
                toLocationId: form.toLocationId,
                quantity: form.quantity,
            },
        ]);

        setForm({
            productId: "",
            fromLocationId: "",
            toLocationId: "",
            quantity: 0,
        });
    };

    const submitBulkTransfers = async () => {
        if (bulkTransfers.length === 0) {
            alert("No bulk transfers to submit");
            return;
        }

        try {
            const res = await fetch("/api/transfers/bulk", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bulkTransfers),
            });

            if (!res.ok) throw new Error();

            alert("Bulk transfers created");
            setBulkTransfers([]);
        } catch {
            alert("Failed to submit bulk transfers");
        }
    };

    /* ===================== DELETE ===================== */

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this transfer?")) return;

        const res = await fetch(`/api/transfers/${id}`, { method: "DELETE" });
        if (!res.ok) {
            alert("Failed to delete transfer");
            return;
        }

        setTransfers(prev => prev.filter(t => t.id !== id));
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error loading data</div>;

    /* ===================== RENDER ===================== */

    return (
        <DashboardLayout>
            <div className="mb-6">
                <h1 className="text-2xl font-semibold">Create Stock Transfer</h1>
                <p className="text-gray-500">Transfer stock within the organisation</p>
            </div>

            {/* FORM */}
            <div className="bg-white p-6 rounded-lg">
                <form onSubmit={handleSubmit} className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                    <select
                        value={form.fromLocationId}
                        onChange={e => setForm({ ...form, fromLocationId: e.target.value })}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">From Location</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>

                    <select
                        value={form.toLocationId}
                        onChange={e => setForm({ ...form, toLocationId: e.target.value })}
                        className="border p-2 rounded"
                        required
                    >
                        <option value="">To Location</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>{l.name}</option>
                        ))}
                    </select>

                    <div>
                        <select
                            value={form.productId}
                            onChange={e => setForm({ ...form, productId: e.target.value })}
                            className="border p-2 rounded w-full"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name}</option>
                            ))}
                        </select>

                        <p className="text-sm text-gray-600 mt-1">
                            Available Stock:{" "}
                            {availableLoading ? "Loading..." : availableQuantity ?? "-"}
                        </p>
                    </div>

                    <input
                        type="number"
                        min={1}
                        value={form.quantity}
                        onChange={e => setForm({ ...form, quantity: Number(e.target.value) })}
                        className="border p-2 rounded"
                        placeholder="Quantity"
                        required
                    />

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="bg-purple-500 text-white rounded h-10 disabled:bg-gray-400"
                    >
                        Create Transfer
                    </button>

                    <button
                        type="button"
                        onClick={addToBulkTransfers}
                        className="bg-purple-600 text-white rounded h-10"
                    >
                        Add to Bulk
                    </button>
                </form>
            </div>

            {/* BULK */}
            {bulkTransfers.length > 0 && (
                <div className="bg-white p-6 mt-6 rounded">
                    <h2 className="text-lg font-semibold mb-3">Bulk Transfers</h2>
                    <button
                        onClick={submitBulkTransfers}
                        className="bg-purple-500 text-white px-4 py-2 rounded"
                    >
                        Submit Bulk Transfers
                    </button>
                </div>
            )}

            {/* RECENT */}
            <div className="bg-white p-6 mt-6 rounded">
                <h3 className="flex items-center font-semibold mb-4">
                    <Clock className="w-5 h-5 mr-2 text-blue-500" />
                    Recent Transfers
                </h3>

                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th>#</th>
                            <th>Product</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Qty</th>
                            <th>Date</th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {loadingTransfers ? (
                            <tr><td colSpan={7} className="text-center">Loading...</td></tr>
                        ) : transfers.length === 0 ? (
                            <tr><td colSpan={7} className="text-center">No transfers</td></tr>
                        ) : (
                            transfers.map((t, i) => (
                                <tr key={t.id}>
                                    <td>{i + 1}</td>
                                    <td>{productMap[t.productId]?.name || 'Unknown Product'}</td>
                                    <td>{locationMap[t.fromLocationId || ""]?.name || 'Unknown Location'}</td>
                                    <td>{locationMap[t.toLocationId || ""]?.name || 'Unknown Location'}</td>
                                    <td>{t.quantity}</td>
                                    <td>{new Date(t.transferDate).toLocaleString()}</td>
                                    <td>
                                        <button onClick={() => handleDelete(t.id)} className="text-red-500">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </DashboardLayout>
    );
}
