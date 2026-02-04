"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import Loading from "@/components/Loading";

interface Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    createdAt?: string;
    updatedAt?: string;
}

export default function SuppliersPage() {
    const router = useRouter();
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSuppliers() {
            try {
                const res = await fetch("/api/suppliers");
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Failed to fetch suppliers");
                setSuppliers(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchSuppliers();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this supplier?")) return;

        setDeletingId(id);

        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Failed to delete supplier");

            setSuppliers((prev) => prev.filter((s) => s.id !== id));
        } catch (err: any) {
            alert(err.message);
        } finally {
            setDeletingId(null);
        }
    };
    if (loading) return (
        <Loading
            message="Loading Suppliers"
            className="items-center"
        />
    )

    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="bg-white p-5 mx-auto rounded-md">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Suppliers</h1>
                <button
                    onClick={() => router.push("/suppliers/create")}
                    className="ml-auto inline-flex items-center gap-2 rounded-md bg-blue-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-blue-600 cursor-pointer"
                >
                    <Plus size={16} />
                    New Supplier
                </button>
            </div>

            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left">#</th>
                        <th className="border p-2 text-left">Name</th>
                        <th className="border p-2 text-left">Email</th>
                        <th className="border p-2 text-left">Phone</th>
                        <th className="border p-2 text-left">Address</th>
                        <th className="border p-2 text-left">Created At</th>
                        <th className="border p-2 text-left">Updated At</th>
                        <th className="border p-2 text-left">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {suppliers.map((supplier, index) => (
                        <tr key={supplier.id}>
                            <td className="border p-2">{index + 1}</td>
                            <td className="border p-2">{supplier.name}</td>
                            <td className="border p-2">{supplier.email || "-"}</td>
                            <td className="border p-2">{supplier.phone || "-"}</td>
                            <td className="border p-2">{supplier.address || "-"}</td>
                            <td className="border p-2">{supplier.createdAt ? new Date(supplier.createdAt).toLocaleString() : "-"}</td>
                            <td className="border p-2">{supplier.updatedAt ? new Date(supplier.updatedAt).toLocaleString() : "-"}</td>
                            <td className="flex justify-between p-2 gap-3">
                                <button
                                    className="bg-green-600 text-white px-2 py-1 rounded cursor-pointer"
                                    onClick={() => router.push(`/suppliers/${supplier.id}`)}
                                >
                                    Edit
                                </button>
                                <button
                                    className="bg-red-600 text-white px-2 py-1 rounded cursor-pointer"
                                    onClick={() => handleDelete(supplier.id)}
                                    disabled={deletingId === supplier.id}
                                >
                                    {deletingId === supplier.id ? "Deleting..." : "Delete"}
                                </button>
                            </td>
                        </tr>
                    ))}
                    {suppliers.length === 0 && (
                        <tr>
                            <td colSpan={5} className="text-center p-4">
                                No suppliers found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
