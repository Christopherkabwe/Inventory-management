"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";

interface Supplier {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    address?: string;
}

export default function EditSupplierPage() {
    const router = useRouter();
    const { id } = useParams();
    const [supplier, setSupplier] = useState<Supplier | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSupplier() {
            try {
                const res = await fetch(`/api/suppliers/${id}`);
                const data = await res.json();
                if (!res.ok) throw new Error(data.error || "Supplier not found");
                setSupplier(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchSupplier();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supplier) return;
        setSaving(true);
        setError(null);

        try {
            const res = await fetch(`/api/suppliers/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(supplier),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update supplier");

            router.push("/suppliers");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!supplier) return <p>Supplier not found</p>;

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-md mt-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Update Supplier</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium">Name *</label>
                    <input
                        className="border p-2 w-full"
                        value={supplier.name}
                        onChange={(e) => setSupplier({ ...supplier, name: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label className="block font-medium">Email</label>
                    <input
                        className="border p-2 w-full"
                        type="email"
                        value={supplier.email || ""}
                        onChange={(e) => setSupplier({ ...supplier, email: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block font-medium">Phone</label>
                    <input
                        className="border p-2 w-full"
                        value={supplier.phone || ""}
                        onChange={(e) => setSupplier({ ...supplier, phone: e.target.value })}
                    />
                </div>

                <div>
                    <label className="block font-medium">Address</label>
                    <textarea
                        className="border p-2 w-full"
                        value={supplier.address || ""}
                        onChange={(e) => setSupplier({ ...supplier, address: e.target.value })}
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={saving}
                    className="bg-green-600 text-white px-4 py-2 rounded"
                >
                    {saving ? "Saving..." : "Update Supplier"}
                </button>
            </form>
        </div>
    );
}
