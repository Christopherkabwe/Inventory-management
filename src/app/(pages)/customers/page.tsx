"use client";

import { useEffect, useState } from "react";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import SearchInput from "@/components/search/SearchInput";
import { ExportButton } from "@/components/Exports/ExportButton";

type Customer = {
    id: string;
    name: string;
    tpinNumber?: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    address?: string;
    locationId: string;
    locationName?: string;
    createdByName?: string;
    salesCount?: number;
    ordersCount?: number;
    quotationsCount?: number;
};

type Location = {
    id: string;
    name: string;
};

export default function CustomerManagementPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [search, setSearch] = useState("");
    const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
    const [form, setForm] = useState<Customer>({
        id: "",
        name: "",
        tpinNumber: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        address: "",
        locationId: "",
    });
    const [loading, setLoading] = useState(false);

    // Fetch customers
    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/customers");
            const data = await res.json();
            if (data.success) {
                setCustomers(data.customers);
            }
        } catch (err) {
            console.error(err);
        }
    };

    // Fetch locations
    const fetchLocations = async () => {
        try {
            const res = await fetch("/api/locations");
            const data = await res.json();
            setLocations(data.locations || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCustomers();
        fetchLocations();
    }, []);

    const handleEdit = (customer: Customer) => {
        setEditingCustomer(customer);
        setForm(customer);
    };

    const handleDelete = async (customerId: string) => {
        if (!confirm("Are you sure you want to delete this customer?")) return;
        try {
            const res = await fetch(`/api/customers/${customerId}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok) {
                alert("Customer deleted successfully");
                setCustomers((prev) => prev.filter((c) => c.id !== customerId));
            } else {
                alert(data.error || "Failed to delete customer");
            }
        } catch (err) {
            console.error(err);
            alert("Failed to delete customer");
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await fetch(`/api/customers/${form.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update customer");

            alert("Customer updated successfully!");
            setEditingCustomer(null);
            setForm({
                id: "",
                name: "",
                tpinNumber: "",
                email: "",
                phone: "",
                country: "",
                city: "",
                address: "",
                locationId: "",
            });
            fetchCustomers();
        } catch (err) {
            console.error(err);
            alert("Failed to update customer");
        } finally {
            setLoading(false);
        }
    };

    // Filtered customers
    const filteredCustomers = customers.filter((c) =>
        [c.name, c.tpinNumber, c.email, c.phone, c.country, c.city, c.address, c.locationName, c.createdByName]
            .some((field) => field?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Customer Management</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
                <SearchInput value={search} onChange={setSearch} placeholder="Search customers..." />
                <ExportButton
                    type="csv"
                    headers={[
                        { key: "name", label: "Name" },
                        { key: "tpinNumber", label: "TPIN" },
                        { key: "email", label: "Email" },
                        { key: "phone", label: "Phone" },
                        { key: "country", label: "Country" },
                        { key: "city", label: "City" },
                        { key: "address", label: "Address" },
                        { key: "locationName", label: "Location" },
                        { key: "createdByName", label: "Created By" },
                        { key: "salesCount", label: "Sales" },
                        { key: "ordersCount", label: "Orders" },
                        { key: "quotationsCount", label: "Quotations" },
                    ]}
                    data={filteredCustomers}
                    filename="customers.csv"
                    label="Export CSV"
                />
            </div>

            {/* Customer Table */}
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">TPIN</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Country</th>
                        <th className="p-2 border">City</th>
                        <th className="p-2 border">Address</th>
                        <th className="p-2 border">Location</th>
                        <th className="p-2 border">Created By</th>
                        <th className="p-2 border">Sales</th>
                        <th className="p-2 border">Orders</th>
                        <th className="p-2 border">Quotations</th>
                        <th className="p-2 border">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map((c) => (
                        <tr key={c.id}>
                            <td className="p-2 border">{c.name}</td>
                            <td className="p-2 border">{c.tpinNumber || "-"}</td>
                            <td className="p-2 border">{c.email}</td>
                            <td className="p-2 border">{c.phone}</td>
                            <td className="p-2 border">{c.country}</td>
                            <td className="p-2 border">{c.city}</td>
                            <td className="p-2 border">{c.address || "-"}</td>
                            <td className="p-2 border">{c.locationName}</td>
                            <td className="p-2 border">{c.createdByName}</td>
                            <td className="p-2 border">{c.salesCount}</td>
                            <td className="p-2 border">{c.ordersCount}</td>
                            <td className="p-2 border">{c.quotationsCount}</td>
                            <td className="p-2 border flex gap-2">
                                <button
                                    onClick={() => handleEdit(c)}
                                    className="px-2 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDelete(c.id)}
                                    className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Edit Modal */}
            {editingCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Customer</h2>
                            <button
                                onClick={() => setEditingCustomer(null)}
                                className="text-red-500 font-bold"
                            >
                                ✕
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
                            <input
                                required
                                placeholder="Name"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                placeholder="TPIN"
                                value={form.tpinNumber || ""}
                                onChange={(e) => setForm({ ...form, tpinNumber: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                required
                                placeholder="Email"
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                required
                                placeholder="Phone"
                                value={form.phone}
                                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                required
                                placeholder="Country"
                                value={form.country}
                                onChange={(e) => setForm({ ...form, country: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                required
                                placeholder="City"
                                value={form.city}
                                onChange={(e) => setForm({ ...form, city: e.target.value })}
                                className="border p-2 rounded"
                            />
                            <input
                                placeholder="Address"
                                value={form.address || ""}
                                onChange={(e) => setForm({ ...form, address: e.target.value })}
                                className="border p-2 rounded"
                            />

                            <LocationCombobox
                                locations={locations}
                                value={form.locationId}
                                onChange={(id) => setForm({ ...form, locationId: id })}
                            />

                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                {loading ? "Updating..." : "Update Customer"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
