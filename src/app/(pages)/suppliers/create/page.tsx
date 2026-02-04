"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NewSupplierPage() {
    const router = useRouter();

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!form.name.trim()) {
            setError("Name is required");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch("/api/suppliers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to create supplier");

            // Optionally reset form
            setForm({ name: "", email: "", phone: "", address: "" });

            // Redirect to suppliers list
            router.push("/suppliers");
        } catch (err: any) {
            console.error(err);
            setError(err.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto p-6 bg-white shadow rounded-md mt-6">
            <h1 className="text-2xl font-bold mb-6 text-center">Create Supplier</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block font-medium mb-1">Name *</label>
                    <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="border p-2 w-full rounded"
                        placeholder="Supplier Name"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        placeholder="supplier@example.com"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Phone</label>
                    <input
                        type="tel"
                        name="phone"
                        value={form.phone}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        placeholder="+260 97XXXXXXX"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Address</label>
                    <textarea
                        name="address"
                        value={form.address}
                        onChange={handleChange}
                        className="border p-2 w-full rounded"
                        placeholder="Supplier Address"
                        rows={3}
                    />
                </div>

                {error && <p className="text-red-500">{error}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full"
                >
                    {loading ? "Saving..." : "Create Supplier"}
                </button>
            </form>
        </div>
    );
}
