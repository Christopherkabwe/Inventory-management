"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToaster } from "@/app/context/Toaster";
import { useUser } from "@/app/context/UserContext";
import UnauthorizedPage from "@/app/unauthorized/page";

export default function CreateTransporterPage() {
    const user = useUser();
    const router = useRouter();
    const { addToast } = useToaster();

    const [form, setForm] = useState({
        name: "",
        vehicleNumber: "",
        driverName: "",
        driverPhoneNumber: "",
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("/api/transporters", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create transporter");

            addToast(`Transporter "${data.transporter.name}" created successfully!`);

            // Redirect to transporter management page
            router.push("/transporters/transporter-management");

        } catch (err) {
            console.error(err);
            addToast("Failed to create transporter");
        } finally {
            setLoading(false);
        }
    };

    if (!user || user.role !== "ADMIN") {
        return (
            <UnauthorizedPage />
        );
    }

    return (
        <div className="bg-white p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Create Transporter</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded shadow">

                <div>
                    <label className="block font-medium mb-1">Transporter Name</label>
                    <input
                        required
                        placeholder="Transporter Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Vehicle Number</label>
                    <input
                        placeholder="Vehicle Number"
                        value={form.vehicleNumber}
                        onChange={e => setForm({ ...form, vehicleNumber: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Driver Name</label>
                    <input
                        placeholder="Driver Name"
                        value={form.driverName}
                        onChange={e => setForm({ ...form, driverName: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Driver Phone Number</label>
                    <input
                        placeholder="Driver Phone Number"
                        value={form.driverPhoneNumber}
                        onChange={e => setForm({ ...form, driverPhoneNumber: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                >
                    {loading ? "Creating..." : "Create Transporter"}
                </button>
            </form>
        </div>
    );
}
