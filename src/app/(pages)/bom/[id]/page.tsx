"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

type BOMItem = { id: string; component: { name: string }; quantity: number; unit: string };
type BOM = { id: string; product: { name: string }; version: number; status: string; description: string; components: BOMItem[] };

export default function ViewBOMPage() {
    const { id } = useParams();
    const router = useRouter();
    const [bom, setBOM] = useState<BOM | null>(null);

    useEffect(() => {
        fetch(`/api/bom/${id}`)
            .then((res) => res.json())
            .then(setBOM);
    }, [id]);

    if (!bom) return <div>Loading...</div>;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">BOM for {bom.product?.name}</h1>
            <p className="mb-2">Version: {bom.version}</p>
            <p className="mb-4">Status: {bom.status}</p>
            <p className="mb-4">Description: {bom.description}</p>

            <h2 className="font-semibold mb-2">Components</h2>
            <table className="min-w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Component</th>
                        <th className="p-2 border">Quantity</th>
                        <th className="p-2 border">Unit</th>
                    </tr>
                </thead>
                <tbody>
                    {bom.components?.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50">
                            <td className="p-2 border">{c.component.name}</td>
                            <td className="p-2 border">{c.quantity}</td>
                            <td className="p-2 border">{c.unit}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
