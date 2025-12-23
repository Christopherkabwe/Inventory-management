"use client";

import { useState } from "react";
import { prisma } from "@/lib/prisma";
import { Product, Customer, Location } from "@prisma/client"; // TS types
import { toast } from "react-hot-toast";

interface Props {
    products: Product[];
    customers: Customer[];
    locations: Location[];
    onSaleCreated?: () => void; // Callback after creating sale
}

export default function CreateSale({ products, customers, locations, onSaleCreated }: Props) {
    const [productId, setProductId] = useState("");
    const [customerId, setCustomerId] = useState("");
    const [locationId, setLocationId] = useState("");
    const [quantity, setQuantity] = useState<number>(1);
    const [salePrice, setSalePrice] = useState<number>(0);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!productId || !customerId || !locationId || !quantity || !salePrice) {
            toast.error("Please fill all fields.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/sales", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId, customerId, locationId, quantity, salePrice }),
            });

            if (!res.ok) throw new Error("Failed to create sale");

            toast.success("Sale created successfully!");
            setProductId("");
            setCustomerId("");
            setLocationId("");
            setQuantity(1);
            setSalePrice(0);

            if (onSaleCreated) onSaleCreated();
        } catch (err) {
            console.error(err);
            toast.error("Error creating sale.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white p-6 rounded-xl border shadow-md max-w-md">
            <h2 className="text-xl font-bold mb-4">Create New Sale</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Product</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={productId}
                        onChange={e => setProductId(e.target.value)}
                        required
                    >
                        <option value="">Select Product</option>
                        {products.map(p => (
                            <option key={p.id} value={p.id}>
                                {p.name} (Price: K{p.price})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Customer</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={customerId}
                        onChange={e => setCustomerId(e.target.value)}
                        required
                    >
                        <option value="">Select Customer</option>
                        {customers.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Location</label>
                    <select
                        className="w-full border px-3 py-2 rounded"
                        value={locationId}
                        onChange={e => setLocationId(e.target.value)}
                        required
                    >
                        <option value="">Select Location</option>
                        {locations.map(l => (
                            <option key={l.id} value={l.id}>
                                {l.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Quantity</label>
                    <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        value={quantity}
                        min={1}
                        onChange={e => setQuantity(Number(e.target.value))}
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-1">Sale Price (per unit)</label>
                    <input
                        type="number"
                        className="w-full border px-3 py-2 rounded"
                        value={salePrice}
                        min={0}
                        step={0.01}
                        onChange={e => setSalePrice(Number(e.target.value))}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                    disabled={loading}
                >
                    {loading ? "Creating..." : "Create Sale"}
                </button>
            </form>
        </div>
    );
}


