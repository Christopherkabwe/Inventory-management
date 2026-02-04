"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2, Loader2, Save } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --------------------
// Types
// --------------------
type BOM = {
    id: string;
    productId: string;
    status: string;
    items: ComponentItem[];
};

type Product = {
    id: string;
    name: string;
};

type ComponentOption = {
    id: string;
    name: string;
    sku?: string;
};

type ComponentItem = {
    componentId: string;
    quantity: number;
    unit: string;
    notes?: string; // <-- added notes field
};

// --------------------
// Page
// --------------------
export default function EditBOMPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();
    const queryClient = useQueryClient();

    const [productId, setProductId] = useState("");
    const [components, setComponents] = useState<ComponentItem[]>([]);
    const [error, setError] = useState<string | null>(null);

    // --------------------
    // Queries
    // --------------------
    const bomQuery = useQuery<BOM>({
        queryKey: ["bom", id],
        queryFn: async () => {
            const res = await fetch(`/api/bom/${id}`);
            if (!res.ok) throw new Error("Failed to load BOM");
            const data = await res.json();
            // Transform API response to match ComponentItem type
            return {
                ...data,
                items: data.components.map((c: any) => ({
                    componentId: c.componentId,
                    quantity: c.quantity,
                    unit: c.unit,
                    notes: c.notes || "",
                })),
            };
        },
    });

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
    // Initialize form
    // --------------------
    useEffect(() => {
        if (bomQuery.data) {
            setProductId(bomQuery.data.productId);
            setComponents(bomQuery.data.items);
        }
    }, [bomQuery.data]);

    // --------------------
    // Derived state
    // --------------------
    const usedComponentIds = useMemo(
        () => components?.map((c) => c.componentId).filter(Boolean),
        [components]
    );

    const isValid = useMemo(() => {
        if (!productId) return false;
        if (components?.length === 0) return false;
        return components.every(
            (c) => c.componentId && c.quantity > 0 && c.unit.trim().length > 0
        );
    }, [productId, components]);

    // --------------------
    // Mutations
    // --------------------
    const updateBOM = useMutation({
        mutationFn: async () => {
            setError(null);
            const res = await fetch(`/api/bom/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    components,
                }),
            });

            if (!res.ok) throw new Error(await res.text());
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["boms"] });
            queryClient.invalidateQueries({ queryKey: ["bom", id] });
            router.push(`/production/bom/${id}/view`);
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
            { componentId: "", quantity: 1, unit: "pcs", notes: "" },
        ]);
    };

    const removeComponent = (index: number) => {
        setComponents((prev) => prev.filter((_, i) => i !== index));
    };

    // --------------------
    // Render
    // --------------------
    if (bomQuery.isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg max-w-5xl mx-auto p-6">
            <h1 className="text-3xl font-semibold mb-6">Edit Bill of Materials</h1>

            {/* Product Selection */}
            <Card className="mb-6">
                <CardContent className="p-6">
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
                </CardContent>
            </Card>

            {/* Components */}
            <Card className="mb-6">
                <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Components</h2>
                        <Button onClick={addComponent} size="sm">
                            <Plus className="w-4 h-4 mr-1" /> Add Component
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {components?.map((c, idx) => (
                            <div key={idx} className="grid grid-cols-12 gap-3 items-start">
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
                                    min={0.01}
                                    step="0.01"
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
                                <input
                                    className="col-span-1 border rounded p-2"
                                    placeholder="Notes"
                                    value={c.notes}
                                    onChange={(e) => {
                                        const copy = [...components];
                                        copy[idx].notes = e.target.value;
                                        setComponents(copy);
                                    }}
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="col-span-1 mt-1"
                                    onClick={() => removeComponent(idx)}
                                >
                                    <Trash2 className="w-4 h-4 text-red-500" />
                                </Button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {error && <div className="mb-4 text-sm text-red-600">{error}</div>}

            {/* Action buttons */}
            <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => router.push(`/production/bom/${id}/view`)}>
                    Cancel
                </Button>
                <Button
                    disabled={!isValid || updateBOM.isPending}
                    onClick={() => updateBOM.mutate()}
                >
                    {updateBOM.isPending ? (
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                        <Save className="w-4 h-4 mr-2" />
                    )}
                    Save Changes
                </Button>
            </div>
        </div>
    );
}
