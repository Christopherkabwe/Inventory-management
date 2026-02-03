"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Plus, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --------------------
// Types
// --------------------
type Product = {
    id: string;
    name: string;
};

type ComponentOption = {
    id: string;
    name: string;
    sku?: string;
    defaultUnit?: string;
};

type ComponentItem = {
    componentId: string;
    quantity: number;
    unit: string;
};

// --------------------
// Page
// --------------------
export default function CreateBOMPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    const [productId, setProductId] = useState("");
    const [components, setComponents] = useState<ComponentItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --------------------
    // Queries
    // --------------------
    const productsQuery = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: async () => {
            const res = await fetch("/api/options/products");
            if (!res.ok) throw new Error("Failed to fetch products");
            return res.json();
        },
    });

    const componentsQuery = useQuery<ComponentOption[]>({
        queryKey: ["component-options"],
        queryFn: async () => {
            const res = await fetch("/api/options/components");
            if (!res.ok) throw new Error("Failed to fetch components");
            return res.json();
        },
    });

    // --------------------
    // Derived state
    // --------------------
    const usedComponentIds = useMemo(
        () => components.map((c) => c.componentId).filter(Boolean),
        [components]
    );

    const isValid = useMemo(() => {
        if (!productId) return false;
        if (components.length === 0) return false;
        return components.every(
            (c) => c.componentId && c.quantity > 0 && c.unit.trim().length > 0
        );
    }, [productId, components]);

    // --------------------
    // Mutations
    // --------------------
    const createBOM = useMutation({
        mutationFn: async () => {
            setError(null);
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
                const msg = await res.text();
                throw new Error(msg || "Failed to create BOM");
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boms"] });
            router.push("/bom");
        },
        onError: (err: any) => {
            setError(err.message || "Unexpected error occurred");
        },
    });

    // --------------------
    // Handlers
    // --------------------
    const addComponent = () => {
        setComponents((prev) => [
            ...prev,
            { componentId: "", quantity: 1, unit: "pcs" },
        ]);
    };

    const removeComponent = (index: number) => {
        setComponents((prev) => prev.filter((_, i) => i !== index));
    };

    // --------------------
    // Render
    // --------------------
    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Create Bill of Materials</h1>

            <Card className="mb-6">
                <CardContent className="p-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Finished Product</label>
                        <select
                            value={productId}
                            onChange={(e) => setProductId(e.target.value)}
                            className="w-full border rounded p-2"
                        >
                            <option value="">Select a product</option>
                            {productsQuery.data?.map((p) => (
                                <option key={p.id} value={p.id}>
                                    {p.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </CardContent>
            </Card>

            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Components</h2>
                        <Button onClick={addComponent} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add Component
                        </Button>
                    </div>

                    {components.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                            No components added yet.
                        </p>
                    )}

                    <div className="space-y-3">
                        {components.map((c, idx) => (
                            <div
                                key={idx}
                                className="grid grid-cols-12 gap-3 items-center"
                            >
                                <select
                                    className="col-span-6 border rounded p-2"
                                    value={c.componentId}
                                    onChange={(e) => {
                                        const copy = [...components];
                                        copy[idx].componentId = e.target.value;
                                        setComponents(copy);
                                    }}
                                >
                                    <option value="">Select component</option>
                                    {componentsQuery.data
                                        ?.filter(
                                            (opt) =>
                                                !usedComponentIds.includes(opt.id) ||
                                                opt.id === c.componentId
                                        )
                                        .map((opt) => (
                                            <option key={opt.id} value={opt.id}>
                                                {opt.name} {opt.sku ? `(${opt.sku})` : ""}
                                            </option>
                                        ))}
                                </select>

                                <input
                                    type="number"
                                    min={0.0001}
                                    step="0.001"
                                    className="col-span-2 border rounded p-2"
                                    value={c.quantity}
                                    onChange={(e) => {
                                        const copy = [...components];
                                        copy[idx].quantity = Number(e.target.value);
                                        setComponents(copy);
                                    }}
                                />

                                <input
                                    className="col-span-2 border rounded p-2"
                                    value={c.unit}
                                    onChange={(e) => {
                                        const copy = [...components];
                                        copy[idx].unit = e.target.value;
                                        setComponents(copy);
                                    }}
                                />

                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="col-span-1"
                                    onClick={() => removeComponent(idx)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {error && (
                <div className="mb-4 text-sm text-red-600">{error}</div>
            )}

            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push("/bom")}>
                    Cancel
                </Button>
                <Button
                    disabled={!isValid || createBOM.isPending}
                    onClick={() => createBOM.mutate()}
                >
                    {createBOM.isPending && (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    )}
                    Create BOM
                </Button>
            </div>
        </div>
    );
}
