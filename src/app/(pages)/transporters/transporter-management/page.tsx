"use client";

import { useEffect, useState } from "react";
import { LocationCombobox } from "@/components/SingleSelectComboBox/LocationComboBox";
import SearchInput from "@/components/search/SearchInput";
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";
import Pagination from "@/components/pagination/pagination";
import Loading from "@/components/Loading";
import Link from "next/link";
import { useUser } from "@/app/context/UserContext";
import AdminOnly from "@/components/rbac/AdminOnly";
import { useToaster } from "@/app/context/Toaster";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { TextInput } from "@/components/Inputs/TextInput";

type Transporter = {
    id: string;
    name: string;
    vehicleNumber?: string;
    driverName: string;
    driverPhoneNumber: string;
    createdAt: string;
    updatedAt: string;
};

type Location = { id: string; name: string };
type User = { id: string; fullName: string };

export default function TransporterManagementPage() {
    const user = useUser();
    const isAdmin = user?.role === "ADMIN";
    const router = useRouter();

    const [transporters, setTransporter] = useState<Transporter[]>([]);
    const [search, setSearch] = useState("");
    const [editingTransporter, setEditingTransporter] = useState<Transporter | null>(null);
    const [form, setForm] = useState<Transporter>({
        id: "",
        name: "",
        vehicleNumber: "",
        driverName: "",
        driverPhoneNumber: "",
        createdAt: "",
        updatedAt: ""
    });
    const [loading, setLoading] = useState(false);
    const { addToast } = useToaster();
    const [currentPage, setCurrentPage] = useState(1);
    const limit = 10;

    // ------------------- FETCH DATA -------------------
    useEffect(() => {
        const fetchAllData = async () => {
            setLoading(true);
            try {
                const [transRes] = await Promise.all([
                    fetch("/api/transporters"),
                ]);

                const TransData = await transRes.json();

                setTransporter(TransData || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);

    // ------------------- EDIT -------------------
    const handleEdit = (transporter: Transporter) => {
        if (!isAdmin) return;
        setEditingTransporter(transporter);
        setForm(transporter);
    };

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTransporter) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/transporters/${form.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to update transporter");

            // Update local state
            setTransporter(prev => prev.map(t => (t.id === data.transporter?.id ? data?.transporter : t)));

            addToast('Transporter updated successfully!', 'success');
            //alert("Transporter updated successfully!");
            setEditingTransporter(null);
            setForm({
                id: "",
                name: "",
                vehicleNumber: "",
                driverName: "",
                driverPhoneNumber: "",
                createdAt: "",
                updatedAt: ""
            });
        } catch (err) {
            console.error(err);
            addToast('Failed to update Transporter', 'error');
            //alert("Failed to update Transporter");
        } finally {
            setLoading(false);
        }
    };

    // ------------------- DELETE -------------------
    const handleDelete = async (transporterId: string) => {
        if (!isAdmin) return;
        if (!confirm("Are you sure you want to delete this transporter?")) return;

        setLoading(true);
        try {
            const res = await fetch(`/api/transporters/${transporterId}`, { method: "DELETE" });
            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Failed to delete transporter");

            // Remove from local state
            setTransporter(prev => prev.filter(t => t?.id !== transporterId));
            addToast('Transporter deleted successfully!', 'success');
            //alert("Transporter deleted successfully!");
        } catch (err) {
            console.error(err);
            addToast('Failed to delete transporter', 'error');
            //alert("Failed to delete transporter");
        } finally {
            setLoading(false);
        }
    };

    // ------------------- FILTER + PAGINATION -------------------
    const filteredTransporters = transporters?.filter(t =>
        [
            t.id,
            t.name,
            t.vehicleNumber,
            t.driverName,
            t.driverPhoneNumber,
            t.createdAt,
            t.updatedAt
        ].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    );

    const totalPages = Math.ceil(filteredTransporters.length / limit);
    const paginatedTransporters = filteredTransporters.slice((currentPage - 1) * limit, currentPage * limit);

    // ------------------- EXPORT -------------------
    const exportHeaders: ExportHeader<Transporter>[] = [
        { key: "name", label: "Name" },
        { key: "vehicleNumber", label: "Vehicle Number" },
        { key: "driverName", label: "Driver Name" },
        { key: "driverPhoneNumber", label: "Driver Contact #" },
        { key: "createdAt", label: "Created At" },
        { key: "updatedAt", label: "Updated At" },
    ];

    const columnCount = isAdmin ? 6 : 7;

    return (
        <div className="bg-white p-5 rounded-md ">
            <h1 className="text-2xl font-semibold mb-4">Transporter Management</h1>

            {/* Controls */}
            <div className="w-full flex flex-col gap-2 mb-4 xl:flex-row xl:items-center">
                {/* Search */}
                <div className="w-full xl:mr-5">
                    <SearchInput value={search} onChange={setSearch} placeholder="Search ..." />
                </div>

                {/* Export Buttons */}
                <div className="w-full flex flex-col gap-2 sm:flex-row sm:gap-5">
                    <ExportButton
                        type="csv"
                        headers={exportHeaders}
                        data={filteredTransporters}
                        filename="transporters.csv"
                        label="Export CSV"
                    />
                    <ExportButton
                        type="pdf"
                        headers={exportHeaders}
                        data={filteredTransporters}
                        filename="transporters.pdf"
                        title="Transport Report"
                        mode="landscape"
                        label="Export PDF"
                    />
                </div>

                {/* Create Customer Button */}
                <button
                    onClick={() => router.push("/transporters/create-transporter")}
                    className="ml-auto h-9 w-100 inline-flex items-center gap-2 rounded-md bg-green-500 px-5 py-2
                        text-sm font-medium text-white hover:bg-green-600 cursor-pointer"
                >
                    <Plus size={16} />
                    New Transporter
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto max-h-[600px] rounded">
                <table className="text-sm min-w-full bg-white border cursor-pointer">
                    <thead className="bg-gray-50 sticky top-0">
                        <tr>
                            <th className="px-2 py-1 border">#</th>
                            <th className="px-2 py-1 border">Name</th>
                            <th className="px-2 py-1 border">Vehicle No</th>
                            <th className="px-2 py-1 border">Driver Name</th>
                            <th className="px-2 py-1 border">Driver Contact</th>
                            <th className="px-2 py-1 border">Created At</th>
                            <th className="px-2 py-1 border">Updated At</th>
                            <AdminOnly>
                                <th className="px-2 py-1 border">Actions</th>
                            </AdminOnly>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={columnCount}>
                                    <Loading message="Loading Transporters..." />
                                </td>
                            </tr>
                        ) : paginatedTransporters.length === 0 ? (
                            <tr>
                                <td colSpan={columnCount} className="p-4 text-center text-gray-500">
                                    No Transporters found.
                                </td>
                            </tr>
                        ) : (
                            paginatedTransporters.map((t, index) => (
                                <tr
                                    key={t.id}
                                    className="whitespace-nowrap odd:bg-white even:bg-gray-50 hover:bg-gray-100"
                                >
                                    <td className="px-2 py-1 border">{index + 1}</td>
                                    <td className="px-2 py-1 border">{t.name}</td>
                                    <td className="px-2 py-1 border">{t.vehicleNumber || "-"}</td>
                                    <td className="px-2 py-1 border">{t.driverName}</td>
                                    <td className="px-2 py-1 border">{t.driverPhoneNumber}</td>
                                    <td className="px-2 py-1 border">{new Date(t.createdAt).toLocaleString()}</td>
                                    <td className="px-2 py-1 border">{new Date(t.updatedAt).toLocaleString()}</td>
                                    <AdminOnly>
                                        <td className="px-2 py-1 border flex gap-2">
                                            <button
                                                onClick={() => handleEdit(t)}
                                                className="px-1 py-1 bg-yellow-400 text-white rounded hover:bg-yellow-500"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t.id)}
                                                className="px-1 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </AdminOnly>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center">
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>

            {/* Edit Modal */}
            {editingTransporter && (
                <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow max-w-lg w-full">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Edit Transporter</h2>
                            <button onClick={() => setEditingTransporter(null)} className="text-red-500 font-bold">✕</button>
                        </div>

                        <form onSubmit={handleUpdate} className="grid grid-cols-1 gap-4">
                            <TextInput
                                required
                                placeholder="Name"
                                value={form.name ?? ''}
                                onChange={(e) => setForm({ ...form, name: e })}
                                className="border p-2 rounded"
                                label="Transporter Name"
                            />
                            <TextInput
                                required
                                placeholder="Vehicle Number"
                                value={form.vehicleNumber || ""}
                                onChange={(e) => setForm({ ...form, vehicleNumber: e })}
                                className="border p-2 rounded"
                                label="Vehicle No."
                            />
                            <TextInput
                                required
                                placeholder="Driver Name"
                                value={form.driverName ?? ''}
                                onChange={(e) => setForm({ ...form, driverName: e })}
                                className="border p-2 rounded"
                                label="Driver Name"
                            />
                            <TextInput
                                placeholder="Driver Contact #"
                                value={form.driverPhoneNumber ?? ''}
                                onChange={(e) => setForm({ ...form, driverPhoneNumber: e })}
                                className="border p-2 rounded"
                                label="Driver Phone No."
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                                {loading ? "Updating..." : "Update Transporter"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
