"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { Loader2, Pencil } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// --------------------
// Types
// --------------------
type BOM = {
    id: string;
    version: number;
    status: string;
    product: {
        id: string;
        name: string;
    };
    components: {
        id: string;
        quantity: number;
        unit: string;
        notes?: string;
        component: {
            id: string;
            name: string;
            sku?: string;
        };
    }[];
};

// --------------------
// Page
// --------------------
export default function ViewBOMPage() {
    const { id } = useParams<{ id: string }>();
    const router = useRouter();

    // --------------------
    // Fetch BOM
    // --------------------
    const { data: bom, isLoading, error } = useQuery<BOM>({
        queryKey: ["bom", id],
        queryFn: async () => {
            const res = await fetch(`/api/bom/${id}`);
            if (!res.ok) throw new Error("Failed to load BOM");
            return res.json();
        },
    });

    // --------------------
    // Loading / Error handling
    // --------------------
    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-64">
                <Loader2 className="w-6 h-6 animate-spin" />
            </div>
        );
    }

    if (error instanceof Error) {
        return <div className="p-6 text-red-600">{error.message}</div>;
    }

    if (!bom) return <div className="p-6 text-red-600">BOM not found</div>;

    // --------------------
    // Render
    // --------------------
    return (
        <div className="bg-white rounded-lg max-w-5xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-semibold">Bill of Materials</h1>
                <Button onClick={() => router.push(`/production/bom/${id}/edit`)}>
                    <Pencil className="w-4 h-4 mr-2" /> Edit BOM
                </Button>
            </div>

            {/* BOM Info */}
            <Card className="mb-6">
                <CardContent className="p-6 grid grid-cols-3 gap-4">
                    <div>
                        <p className="text-sm text-muted-foreground">Product</p>
                        <p className="font-medium">{bom.product.name}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Version</p>
                        <p className="font-medium">{bom.version}</p>
                    </div>
                    <div>
                        <p className="text-sm text-muted-foreground">Status</p>
                        <p className="font-medium">{bom.status}</p>
                    </div>
                </CardContent>
            </Card>

            {/* Components Table */}
            <Card>
                <CardContent className="p-6">
                    <h2 className="text-lg font-semibold mb-4">Components</h2>

                    <div className="overflow-x-auto">
                        <table className="w-full border rounded table-auto">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-2 border text-left">Component</th>
                                    <th className="p-2 border text-left">SKU</th>
                                    <th className="p-2 border text-left">Quantity</th>
                                    <th className="p-2 border text-left">Unit</th>
                                    <th className="p-2 border text-left w-1/3">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bom.components.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50 align-top">
                                        <td className="p-2 border">{item.component?.name || "Unknown Component"}</td>
                                        <td className="p-2 border">{item.component?.sku || "—"}</td>
                                        <td className="p-2 border">{item.quantity}</td>
                                        <td className="p-2 border">{item.unit}</td>
                                        <td className="p-2 border break-words max-w-xs">{item.notes || "—"}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end mt-6">
                <Button variant="outline" onClick={() => router.push("/production/bom")}>
                    Back to List
                </Button>
            </div>
        </div>
    );
}
