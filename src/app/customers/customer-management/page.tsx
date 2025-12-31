"use client";

import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";
import { Parser as Json2csvParser } from "json2csv";

type Customer = {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
};

export default function CustomerManagementPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        country: "",
        city: "",
    });
    const [search, setSearch] = useState("");

    // Load customers
    const fetchCustomers = async () => {
        try {
            const res = await fetch("/api/customers");
            const data = await res.json();
            setCustomers(data.customers || []);
            setFilteredCustomers(data.customers || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchCustomers();
    }, []);

    // Search/filter customers
    useEffect(() => {
        const filtered = customers.filter(
            c =>
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase()) ||
                c.phone.includes(search) ||
                c.country.toLowerCase().includes(search.toLowerCase()) ||
                c.city.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredCustomers(filtered);
    }, [search, customers]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/customers", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, userId: "currentUserId" }),
            });
            if (!res.ok) throw new Error("Failed to create customer");

            const newCustomer = await res.json();
            setCustomers(prev => [newCustomer, ...prev]);
            setForm({ name: "", email: "", phone: "", country: "", city: "" });
            setShowForm(false);
        } catch (err) {
            console.error(err);
            alert("Failed to create customer");
        }
    };

    const exportCSV = () => {
        const parser = new Json2csvParser({ fields: ["name", "email", "phone", "country", "city"] });
        const csv = parser.parse(filteredCustomers);
        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "customers.csv";
        a.click();
    };

    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Customer List", 14, 20);
        filteredCustomers.forEach((c, i) => {
            doc.text(`${i + 1}. ${c.name} | ${c.email} | ${c.phone} | ${c.country} | ${c.city}`, 14, 30 + i * 10);
        });
        doc.save("customers.pdf");
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold mb-4">Customer Management</h1>

            {/* Controls */}
            <div className="flex flex-wrap gap-2 mb-4">
                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Add Customer
                    </button>
                )}
                <button
                    onClick={exportCSV}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                >
                    Export CSV
                </button>
                <button
                    onClick={exportPDF}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                >
                    Export PDF
                </button>
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="border p-2 rounded flex-1 min-w-[200px]"
                />
            </div>

            {/* Create Customer Form */}
            {showForm && (
                <div className="bg-white p-6 rounded shadow mb-4">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">Create Customer</h2>
                        <button
                            onClick={() => setShowForm(false)}
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
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            required
                            placeholder="Email"
                            type="email"
                            value={form.email}
                            onChange={e => setForm({ ...form, email: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            required
                            placeholder="Phone"
                            value={form.phone}
                            onChange={e => setForm({ ...form, phone: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            required
                            placeholder="Country"
                            value={form.country}
                            onChange={e => setForm({ ...form, country: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <input
                            required
                            placeholder="City"
                            value={form.city}
                            onChange={e => setForm({ ...form, city: e.target.value })}
                            className="border p-2 rounded"
                        />
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                        >
                            Create Customer
                        </button>
                    </form>
                </div>
            )}
            {/* Customer Table */}
            <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-2 border">Name</th>
                        <th className="p-2 border">Email</th>
                        <th className="p-2 border">Phone</th>
                        <th className="p-2 border">Country</th>
                        <th className="p-2 border">City</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredCustomers.map(c => (
                        <tr key={c.id}>
                            <td className="p-2 border">{c.name}</td>
                            <td className="p-2 border">{c.email}</td>
                            <td className="p-2 border">{c.phone}</td>
                            <td className="p-2 border">{c.country}</td>
                            <td className="p-2 border">{c.city}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
