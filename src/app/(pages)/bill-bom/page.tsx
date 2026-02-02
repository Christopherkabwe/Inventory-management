"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

type Product = {
    id: string;
    name: string;
};

type ComponentItem = {
    componentId: string;
    quantity: number;
    unit: string;
};

export default function CreateBOMPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [productId, setProductId] = useState("");
    const [components, setComponents] = useState<ComponentItem[]>([]);

    // 🔹 Fetch products
    const { data: products } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/options/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });

    // 🔹 Create BOM mutation
    const createBOM = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/bom/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    status: "DRAFT",
                    items: components,
                }),
            });

            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boms"] });
            router.push("/bom");
        },
    });

    const addComponent = () =>
        setComponents([...components, { componentId: "", quantity: 1, unit: "pcs" }]);

    return (
        <div className="p-6 max-w-3xl">
            <h1 className="text-2xl font-bold mb-6">Create Bill of Materials</h1>

            {/* Product selector */}
            <div className="mb-4">
                <label className="block mb-1 font-medium">Product</label>
                <select
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    className="border p-2 w-full rounded"
                >
                    <option value="">Select a product</option>
                    {products?.map((p) => (
                        <option key={p.id} value={p.id}>
                            {p.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Components */}
            <div className="mb-6">
                <h2 className="font-semibold mb-2">Components</h2>

                {components.map((c, idx) => (
                    <div key={idx} className="flex gap-2 mb-2">
                        <input
                            placeholder="Component ID"
                            className="border p-2 rounded w-1/3"
                            value={c.componentId}
                            onChange={(e) => {
                                const copy = [...components];
                                copy[idx].componentId = e.target.value;
                                setComponents(copy);
                            }}
                        />
                        <input
                            type="number"
                            className="border p-2 rounded w-1/4"
                            value={c.quantity}
                            min={0.0001}
                            step="0.0001"
                            onChange={(e) => {
                                const copy = [...components];
                                copy[idx].quantity = parseFloat(e.target.value);
                                setComponents(copy);
                            }}
                        />
                        <input
                            className="border p-2 rounded w-1/4"
                            value={c.unit}
                            onChange={(e) => {
                                const copy = [...components];
                                copy[idx].unit = e.target.value;
                                setComponents(copy);
                            }}
                        />
                    </div>
                ))}

                <button
                    onClick={addComponent}
                    className="mt-2 px-4 py-2 bg-green-600 text-white rounded"
                >
                    + Add Component
                </button>
            </div>

            <button
                disabled={!productId || createBOM.isPending}
                onClick={() => createBOM.mutate()}
                className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
            >
                Create BOM
            </button>
        </div>
    );
}
