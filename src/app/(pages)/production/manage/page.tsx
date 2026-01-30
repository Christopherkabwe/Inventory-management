"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

interface Product {
    id: string;
    name: string;
    sku: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    price: number;
}

interface ProductionItem {
    product: Product;
    quantity: number;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    status: "DRAFT" | "CONFIRMED" | "LOCKED";
    location: { id: string; name: string };
    createdBy: { id: string; fullName: string };
    createdAt: string;
    updatedAt: string;
    items: ProductionItem[];
}

interface DefectForm {
    quantity: number;
    defectType: string;
    disposition: string;
    reason: string;
}

export default function ManageProductionsPage() {
    const [productions, setProductions] = useState<Production[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewingProduction, setViewingProduction] = useState<Production | null>(null);
    const [defectForms, setDefectForms] = useState<Record<string, DefectForm>>({});

    // Fetch all productions
    const fetchProductions = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/rbac/productions");
            const json = await res.json();
            setProductions(json.data || []);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch productions");
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchProductions();
    }, []);

    // Confirm Production
    const handleConfirmProduction = async (id: string) => {
        try {
            const res = await fetch(`/api/rbac/productions/${id}/confirm`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to confirm");
            alert("Production confirmed!");
            fetchProductions();
        } catch (err) {
            console.error(err);
            alert("Failed to confirm production");
        }
    };

    // Lock Production
    const handleLockProduction = async (id: string) => {
        try {
            const res = await fetch(`/api/rbac/productions/${id}/lock`, { method: "POST" });
            if (!res.ok) throw new Error("Failed to lock");
            alert("Production locked!");
            fetchProductions();
        } catch (err) {
            console.error(err);
            alert("Failed to lock production");
        }
    };

    // Record Defect
    const handleRecordDefect = async (productionId: string, productId: string) => {
        const form = defectForms[productId];
        if (!form || form.quantity <= 0 || !form.defectType || !form.disposition) {
            alert("Please fill all defect fields with valid quantity");
            return;
        }

        try {
            const res = await fetch(`/api/rbac/productions/${productionId}/defects`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    productId,
                    quantity: form.quantity,
                    defectType: form.defectType,
                    disposition: form.disposition,
                    reason: form.reason || "",
                }),
            });
            if (!res.ok) throw new Error("Failed to record defect");
            alert("Defect recorded!");
            setDefectForms(prev => ({ ...prev, [productId]: { quantity: 0, defectType: "", disposition: "", reason: "" } }));
            fetchProductions();
        } catch (err) {
            console.error(err);
            alert("Failed to record defect");
        }
    };

    const updateDefectForm = (productId: string, field: keyof DefectForm, value: any) => {
        setDefectForms(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    };

    return (
        <div className="p-5">
            <h1 className="text-2xl font-bold mb-4">Manage Productions</h1>

            {loading ? (
                <Loading message="Loading productions..." />
            ) : (
                <table className="min-w-full border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th>#</th>
                            <th>Production No</th>
                            <th>Batch</th>
                            <th>Status</th>
                            <th>Location</th>
                            <th>Created By</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productions.map((p, i) => (
                            <tr key={p.id} className="border-b">
                                <td>{i + 1}</td>
                                <td>{p.productionNo}</td>
                                <td>{p.batchNumber}</td>
                                <td>{p.status}</td>
                                <td>{p.location.name}</td>
                                <td>{p.createdBy.fullName}</td>
                                <td className="flex gap-2 flex-wrap">
                                    <button className="bg-blue-500 text-white px-2 rounded" onClick={() => setViewingProduction(p)}>View</button>
                                    <button className="bg-green-600 text-white px-2 rounded" onClick={() => handleConfirmProduction(p.id)} disabled={p.status !== "DRAFT"}>Confirm</button>
                                    <button className="bg-purple-600 text-white px-2 rounded" onClick={() => handleLockProduction(p.id)} disabled={p.status !== "CONFIRMED"}>Lock</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {/* View Modal */}
            {viewingProduction && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white p-5 rounded w-11/12 max-w-3xl max-h-[90vh] overflow-y-auto">
                        <h2 className="font-bold mb-3">{viewingProduction.productionNo} Details</h2>
                        {viewingProduction.items.map(item => (
                            <div key={item.product.id} className="mb-4 p-2 border rounded">
                                <p><strong>{item.product.name}</strong> (Qty: {item.quantity})</p>

                                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mt-2">
                                    <input
                                        type="number"
                                        min={1}
                                        placeholder="Defect Qty"
                                        value={defectForms[item.product.id]?.quantity || ""}
                                        onChange={e => updateDefectForm(item.product.id, "quantity", parseInt(e.target.value))}
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Defect Type"
                                        value={defectForms[item.product.id]?.defectType || ""}
                                        onChange={e => updateDefectForm(item.product.id, "defectType", e.target.value)}
                                        className="border p-2 rounded"
                                    />
                                    <select
                                        value={defectForms[item.product.id]?.disposition || ""}
                                        onChange={e => updateDefectForm(item.product.id, "disposition", e.target.value)}
                                        className="border p-2 rounded"
                                    >
                                        <option value="">Disposition</option>
                                        <option value="SCRAPPED">Scrapped</option>
                                        <option value="REWORK">Rework</option>
                                    </select>
                                    <input
                                        type="text"
                                        placeholder="Reason (optional)"
                                        value={defectForms[item.product.id]?.reason || ""}
                                        onChange={e => updateDefectForm(item.product.id, "reason", e.target.value)}
                                        className="border p-2 rounded"
                                    />
                                </div>
                                <button
                                    className="mt-2 bg-red-500 text-white px-3 py-1 rounded"
                                    onClick={() => handleRecordDefect(viewingProduction.id, item.product.id)}
                                >
                                    Record Defect
                                </button>
                            </div>
                        ))}
                        <button className="mt-4 bg-gray-500 text-white px-4 py-2 rounded" onClick={() => setViewingProduction(null)}>Close</button>
                    </div>
                </div>
            )}
        </div>
    );
}
