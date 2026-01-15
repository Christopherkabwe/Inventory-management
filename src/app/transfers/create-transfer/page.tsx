"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import DashboardLayout from "@/components/DashboardLayout";
import toast, { Toaster } from 'react-hot-toast';
import withRole from "@/components/withRole";
import UnauthorizedAccess from "@/components/UnauthorizedAccess";

interface Location {
    id: string;
    name: string;
}

interface Transporter {
    id: string;
    name: string;
}

interface Product {
    id: string;
    name: string;
}

interface TransferItem {
    productId: string;
    quantity: number;
}

const CreateTransferPage: React.FC = () => {

    const [fromLocationId, setFromLocationId] = useState("");
    const [toLocationId, setToLocationId] = useState("");
    const [transporterId, setTransporterId] = useState("");
    const [items, setItems] = useState<TransferItem[]>([
        { productId: "", quantity: 1 },
    ]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [transporters, setTransporters] = useState<Transporter[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const [isCreating, setIsCreating] = useState(false);
    const [user, setUser] = useState(null);

    // Fetch User Info
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await fetch('/api/users/me');
                const data = await response.json();
                if (data.success) {
                    setUser(data.user);
                } else {
                    console.error(data.error);
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, []);

    // Fetch Locations, Transporters, and Products
    useEffect(() => {
        async function fetchData() {
            try {
                const [l, t, p] = await Promise.all([
                    fetch("/api/locations").then((r) => r.json()),
                    fetch("/api/transporters").then((r) => r.json()),
                    fetch("/api/products").then((r) => r.json()),
                ]);
                setLocations(Array.isArray(l) ? l : l.locations ?? []);
                setTransporters(t.data ?? []);
                setProducts(Array.isArray(p) ? p : p.products ?? []);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            // Check stock levels before creating transfer
            const insufficientStockProducts = await Promise.all(items.map(async (item) => {
                const res = await fetch(`/api/products/${item.productId}/stock?locationId=${fromLocationId}`);
                const stock = await res.json();
                return { productId: item.productId, hasInsufficientStock: stock < item.quantity };
            }));
            const insufficientStockProductNames = insufficientStockProducts
                .filter((x) => x.hasInsufficientStock)
                .map((x) => products.find((p) => p.id === x.productId)?.name);
            if (insufficientStockProductNames.length > 0) {
                toast.error(`Insufficient stock for: ${insufficientStockProductNames.join(', ')}`);
                setIsCreating(false);
                return;
            }
            const res = await fetch("/api/transfers", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    fromLocationId,
                    toLocationId,
                    transporterId,
                    items,
                }),
            });
            const data = await res.json();
            if (!res.ok) {
                toast.error(data.error);
            } else {
                setSuccess(true);
                router.push(`/transfers/${data.id}`);
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setIsCreating(false);
        }
    };

    const addItem = () => setItems([...items, { productId: "", quantity: 1 }]);
    const removeItem = (index: number) =>
        setItems(items.filter((_, i) => i !== index));

    if (loading)
        return (
            <DashboardLayout>
                <div className="min-h-screen rounded-lg border border-gray-500 bg-white flex items-center justify-center">
                    <Loading
                        message="Loading..."
                    />
                </div>
            </DashboardLayout>
        );

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-6">
                <h1 className="text-2xl font-semibold mb-6">Create Stock Transfer</h1>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Locations */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                From Location
                            </label>
                            <select
                                value={fromLocationId}
                                onChange={(e) => setFromLocationId(e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                                required
                            >
                                <option value="">Select location</option>
                                {locations.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                To Location
                            </label>
                            <select
                                value={toLocationId}
                                onChange={(e) => setToLocationId(e.target.value)}
                                className="w-full border rounded-md px-3 py-2"
                                required
                            >
                                <option value="">Select location</option>
                                {locations.map((l) => (
                                    <option key={l.id} value={l.id}>
                                        {l.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {/* Transporter */}
                    <div>
                        <label className="block text-sm font-medium mb-1">
                            Transporter
                        </label>
                        <select
                            value={transporterId}
                            onChange={(e) => setTransporterId(e.target.value)}
                            className="w-full border rounded-md px-3 py-2"
                            required
                        >
                            <option value="">Select transporter</option>
                            {transporters.map((t) => (
                                <option key={t.id} value={t.id}>
                                    {t.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    {/* Items */}
                    <div>
                        <h2 className="font-semibold mb-2">Transfer Items</h2>
                        {items.map((item, index) => (
                            <div
                                key={index}
                                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3"
                            >
                                <select
                                    value={item.productId}
                                    onChange={(e) => {
                                        const copy = [...items];
                                        copy[index].productId = e.target.value;
                                        setItems(copy);
                                    }}
                                    className="border rounded-md px-3 py-2"
                                    required
                                >
                                    <option value="">Select product</option>
                                    {products.map((p) => (
                                        <option key={p.id} value={p.id}>
                                            {p.name}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    min={1}
                                    value={item.quantity}
                                    onChange={(e) => {
                                        const copy = [...items];
                                        copy[index].quantity = Number(e.target.value);
                                        setItems(copy);
                                    }}
                                    className="border rounded-md px-3 py-2"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => removeItem(index)}
                                    className="text-red-500 hover:underline text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addItem}
                            className="text-purple-600 hover:underline text-sm"
                        >
                            + Add another item
                        </button>
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4">
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-4 py-2 border rounded-md"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                            disabled={isCreating}
                        >
                            {isCreating ? 'Creating Transfer...' : 'Create Transfer'}
                        </button>
                    </div>
                </form>
            </div>
            <Toaster />
        </div>
    );
};

export default withRole(CreateTransferPage, ['ADMIN']);