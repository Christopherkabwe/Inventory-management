"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

type BOM = {
    id: string;
    product: { name: string };
    version: number;
    status: string;
    createdAt: string;
    updatedAt: string;
};

async function fetchBOMs(): Promise<BOM[]> {
    const res = await fetch("/api/bom");

    if (!res.ok) {
        throw new Error("Failed to fetch BOMs");
    }

    return res.json();
}

export default function BOMListPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["boms"],
        queryFn: fetchBOMs,
    });

    if (isLoading) return <div>Loading BOMs...</div>;
    if (error instanceof Error) return <div>{error.message}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Bill of Materials</h1>
                <Link
                    href="/bom/create"
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    + New BOM
                </Link>
            </div>

            <table className="min-w-full border border-gray-200 rounded">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Product</th>
                        <th className="p-2 border">Version</th>
                        <th className="p-2 border">Status</th>
                        <th className="p-2 border">Created At</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data?.map((bom) => (
                        <tr key={bom.id} className="hover:bg-gray-50">
                            <td className="p-2 border">{bom.product.name}</td>
                            <td className="p-2 border">{bom.version}</td>
                            <td className="p-2 border">{bom.status}</td>
                            <td className="p-2 border">
                                {new Date(bom.createdAt).toLocaleDateString()}
                            </td>
                            <td className="p-2 border">
                                <Link
                                    href={`/bom/${bom.id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    View / Edit
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
