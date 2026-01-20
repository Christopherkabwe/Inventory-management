"use client";

import { useEffect, useState } from "react";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import { UserCombobox } from "@/components/SingleSelectComboBox/UserCombobox";
import { useRouter } from "next/navigation";
import { useToaster } from "@/app/context/Toaster";

type Location = { id: string; name: string };
type User = { id: string; name: string };

export default function CreateCustomerPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const router = useRouter();
    const { addToast } = useToaster();
    const [form, setForm] = useState({
        name: "",
        tpinNumber: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        locationId: "",
        assignedUserId: "",
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locRes, userRes] = await Promise.all([
                    fetch("/api/options/locations"),
                    fetch("/api/options/users"),
                ]);
                const locData = await locRes.json();
                setLocations(locData || []);
                const userData = await userRes.json();
                setUsers(userData || []);
            } catch (err) {
                console.error(err);
            }
        };
        fetchData();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to create customer");

            addToast(`Customer "${data.customer.name}" created successfully!`);
            // Redirect to customer management page
            router.push("/customers/customer-management");

        } catch (err) {
            console.error(err);
            addToast("Failed to create customer");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-6">Create Customer</h1>

            <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 bg-white p-6 rounded shadow">

                <div>
                    <label className="block font-medium mb-1">Name</label>
                    <input
                        required
                        placeholder="Name"
                        value={form.name}
                        onChange={e => setForm({ ...form, name: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">TPIN Number</label>
                    <input
                        placeholder="TPIN Number"
                        value={form.tpinNumber}
                        onChange={e => setForm({ ...form, tpinNumber: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Email</label>
                    <input
                        required
                        placeholder="Email"
                        type="email"
                        value={form.email}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Phone</label>
                    <input
                        required
                        placeholder="Phone"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Country</label>
                    <input
                        required
                        placeholder="Country"
                        value={form.country}
                        onChange={e => setForm({ ...form, country: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">City</label>
                    <input
                        required
                        placeholder="City"
                        value={form.city}
                        onChange={e => setForm({ ...form, city: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Address</label>
                    <input
                        placeholder="Address"
                        value={form.address}
                        onChange={e => setForm({ ...form, address: e.target.value })}
                        className="border p-2 rounded w-full"
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Location</label>
                    <LocationCombobox
                        locations={locations}
                        value={form.locationId}
                        onChange={id => setForm({ ...form, locationId: id })}
                    />
                </div>

                <div>
                    <label className="block font-medium mb-1">Assigned User</label>
                    <UserCombobox
                        users={users}
                        value={form.assignedUserId || ""}
                        onChange={id => setForm({ ...form, assignedUserId: id })}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mt-2"
                >
                    {loading ? "Creating..." : "Create Customer"}
                </button>
            </form>
        </div>
    );
}
