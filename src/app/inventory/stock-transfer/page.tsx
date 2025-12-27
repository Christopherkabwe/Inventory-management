"use client";

import { useStackApp } from "@stackframe/stack";
import Sidebar from "@/components/sidebar2";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

// Product and Location types
interface Product {
    id: string;
    name: string;
}

interface Location {
    id: string;
    name: string;
}

export default function StockTransferPage() {
    const stackApp = useStackApp();
    const user = stackApp.useUser();
    const userId = user?.id;

    // Products and Locations
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);

    // Form state
    const [productId, setProductId] = useState("");
    const [fromLocationId, setFromLocationId] = useState("");
    const [toLocationId, setToLocationId] = useState("");
    const [quantity, setQuantity] = useState(0);

    // Fetch products & locations when userId is available
    useEffect(() => {
        if (!userId) return;

        const fetchData = async () => {
            try {
                const [productsRes, locationsRes] = await Promise.all([
                    fetch("/api/products"),
                    fetch(`/api/locations?userId=${userId}`),
                ]);

                const productsData = await productsRes.json();
                const locationsData = await locationsRes.json();

                const productsArray: Product[] = Array.isArray(productsData)
                    ? productsData
                    : Array.isArray(productsData.products)
                        ? productsData.products
                        : [];

                const locationsArray: Location[] = Array.isArray(locationsData.locations)
                    ? locationsData.locations
                    : [];

                setProducts(productsArray);
                setLocations(locationsArray);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load products or locations");
            }
        };

        fetchData();
    }, [userId]);

    // Handle stock transfer
    const submitTransfer = async () => {
        if (!productId || !fromLocationId || !toLocationId || quantity <= 0) {
            toast.error("Fill all fields correctly");
            return;
        }

        if (fromLocationId === toLocationId) {
            toast.error("From and To locations cannot be the same");
            return;
        }

        try {
            const res = await fetch("/api/stock-transfer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, fromLocationId, toLocationId, quantity, userId }),
            });
            console.log(res);

            const data = await res.json();

            if (!res.ok) {
                toast.error(data.error || "Transfer failed");
                return;
            }

            toast.success("Stock transferred successfully");

            // Reset form
            setProductId("");
            setFromLocationId("");
            setToLocationId("");
            setQuantity(0);
        } catch (err) {
            console.error(err);
            toast.error("Something went wrong");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/inventory/stock-transfer" />
            <main className="ml-64 p-8">
                <h1 className="text-2xl font-semibold mb-6">Stock Transfer</h1>

                <form
                    className="bg-white p-6 rounded-lg shadow space-y-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        submitTransfer();
                    }}
                >
                    {/* Product */}
                    <div>
                        <label className="block mb-1 font-medium">Product</label>
                        <select
                            className="border p-2 w-full rounded"
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
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

                    {/* From Location */}
                    <div>
                        <label className="block mb-1 font-medium">From Location</label>
                        <select
                            className="border p-2 w-full rounded"
                            value={fromLocationId}
                            onChange={(e) => setFromLocationId(e.target.value)}
                            required
                        >
                            <option value="">From Location</option>
                            {locations.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* To Location */}
                    <div>
                        <label className="block mb-1 font-medium">To Location</label>
                        <select
                            className="border p-2 w-full rounded"
                            value={toLocationId}
                            onChange={(e) => setToLocationId(e.target.value)}
                            required
                        >
                            <option value="">To Location</option>
                            {locations.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Quantity */}
                    <div>
                        <label className="block mb-1 font-medium">Quantity</label>
                        <input
                            type="number"
                            className="border p-2 w-full rounded"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(Number(e.target.value))}
                            required
                        />
                    </div>

                    {/* Submit */}
                    <button type="submit" className="bg-black text-white px-4 py-2 rounded w-full">
                        Transfer Stock
                    </button>
                </form>
            </main>
        </div>
    );
}
