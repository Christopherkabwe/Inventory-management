"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

/* ================= TYPES ================= */

type ProductionStatus = "DRAFT" | "CONFIRMED" | "LOCKED";

interface Product {
    id: string;
    name: string;
    sku: string;
}

interface ProductionItem {
    product: Product;
    quantity: number;
}

interface ProductionDefect {
    id: string;
    productId: string;
    quantity: number;
    defectType: string;
    disposition: string;
    reason?: string;
    recordedBy: { fullName: string };
    createdAt: string;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    status: ProductionStatus;
    location: { id: string; name: string };
    createdBy: { id: string; fullName: string };
    createdAt: string;
    items: ProductionItem[];
    defects: ProductionDefect[];
}

interface DefectForm {
    quantity: number;
    defectType: string;
    disposition: string;
    reason: string;
}
/* ================= PAGE ================= */

export default function ProductionsPage() {
    const [productions, setProductions] = useState<Production[]>([]);
    const [selected, setSelected] = useState<Production | null>(null);
    const [defects, setDefects] = useState<Record<string, DefectForm>>({});
    const [loading, setLoading] = useState(true);

    // Fetch productions
    async function fetchProductions() {
        setLoading(true);
        const res = await fetch("/api/rbac/productions");
        const json = await res.json();
        setProductions(json.data || []);
        setLoading(false);
    }

    useEffect(() => {
        fetchProductions();
    }, []);

    // Actions
    async function confirmProduction(id: string) {
        if (!confirm("Confirm this production? Inventory will be posted.")) return;
        await fetch(`/api/rbac/productions/${id}/confirm`, { method: "POST" });
        window.location.reload();
    }

    async function lockProduction(id: string) {
        if (!confirm("LOCKING IS FINAL. Continue?")) return;
        await fetch(`/api/rbac/productions/${id}/lock`, { method: "POST" });
        setSelected(null);
        window.location.reload();
    }

    async function recordDefect(
        productionId: string,
        productId: string,
        maxQty: number
    ) {
        const form = defects[productId];
        if (!form) return alert("Fill defect form");

        if (form.quantity <= 0 || form.quantity > maxQty)
            return alert("Invalid defect quantity");

        if (!form.defectType || !form.disposition)
            return alert("Defect type & disposition required");

        await fetch(`/api/rbac/productions/${productionId}/defects`, {
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

        setDefects(prev => ({
            ...prev,
            [productId]: { quantity: 0, defectType: "", disposition: "", reason: "" },
        }));

        window.location.reload();
    }

    function updateDefect(productId: string, field: keyof DefectForm, value: any) {
        setDefects(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    }

    // Flatten all defects for general table
    const allDefects = productions.flatMap(p =>
        p.defects.map(d => ({
            ...d,
            productionNo: p.productionNo,
            batchNumber: p.batchNumber,
            productName:
                p.items.find(i => i.product.id === d.productId)?.product.name || "-",
        }))
    );

    if (loading) return <Loading message="Loading productions..." />;

    /* ================= DETAILS VIEW ================= */
    if (selected)
        return (
            <div className="bg-white p-6 space-y-6">
                <button
                    onClick={() => setSelected(null)}
                    className="text-blue-600 font-medium hover:cursor-pointer"
                >
                    ← Back to list
                </button>

                <h2 className="text-2xl font-bold text-gray-800">
                    {selected.productionNo} ·{" "}
                    <span
                        className={`px-2 py-1 rounded text-white text-sm ${selected.status === "DRAFT"
                            ? "bg-gray-500"
                            : selected.status === "CONFIRMED"
                                ? "bg-green-600"
                                : "bg-purple-700"
                            }`}
                    >
                        {selected.status}
                    </span>
                </h2>

                {/* Items & Defects */}
                {selected.items.map(item => {
                    const defectTotal = selected.defects
                        .filter(d => d.productId === item.product.id)
                        .reduce((s, d) => s + d.quantity, 0);

                    return (
                        <div
                            key={item.product.id}
                            className="border rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow space-y-2"
                        >
                            <div className="gap-2">
                                <strong className="text-gray-800">{item.product.name}</strong>
                                <div className="flex flex-cols-2 px-2 gap-5">
                                    <div className="text-sm text-gray-500">
                                        Produced: {item.quantity}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Defects: {defectTotal}
                                    </div>
                                </div>
                            </div>

                            {selected.status !== "LOCKED" && (
                                <>
                                    <div className="grid md:grid-cols-4 gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={item.quantity}
                                            placeholder="Defect Qty"
                                            className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                            value={defects[item.product.id]?.quantity || ""}
                                            onChange={e =>
                                                updateDefect(item.product.id, "quantity", Number(e.target.value))
                                            }
                                        />

                                        <select
                                            className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                            value={defects[item.product.id]?.defectType || ""}
                                            onChange={e =>
                                                updateDefect(item.product.id, "defectType", e.target.value)
                                            }
                                        >
                                            <option value="">Defect Type</option>
                                            <option value="PACKAGING">Packaging</option>
                                            <option value="CONTAMINATION">Contamination</option>
                                            <option value="WEIGHT_VARIANCE">Weight Variance</option>
                                            <option value="DAMAGED">Damaged</option>
                                            <option value="EXPIRED">Expired</option>
                                            <option value="OTHER">Other</option>
                                        </select>

                                        <select
                                            className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                            value={defects[item.product.id]?.disposition || ""}
                                            onChange={e =>
                                                updateDefect(item.product.id, "disposition", e.target.value)
                                            }
                                        >
                                            <option value="">Disposition</option>
                                            <option value="SCRAPPED">Scrapped</option>
                                            <option value="REWORKED">Reworked</option>
                                            <option value="HELD">Held</option>
                                        </select>

                                        <input
                                            placeholder="Reason"
                                            className="border rounded px-2 py-1 focus:ring-1 focus:ring-blue-500"
                                            value={defects[item.product.id]?.reason || ""}
                                            onChange={e =>
                                                updateDefect(item.product.id, "reason", e.target.value)
                                            }
                                        />
                                    </div>

                                    <button
                                        className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                                        onClick={() =>
                                            recordDefect(selected.id, item.product.id, item.quantity)
                                        }
                                    >
                                        Record Defect
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* Production Defects Table */}
                {selected.defects.length > 0 && (
                    <div className="mt-6 border rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-lg mb-3">Recorded Defects</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm table-auto border-collapse">
                                <thead className="bg-gray-100 sticky top-0">
                                    <tr>
                                        <th className="border px-2 py-1">Product</th>
                                        <th className="border px-2 py-1">Qty</th>
                                        <th className="border px-2 py-1">Type</th>
                                        <th className="border px-2 py-1">Disposition</th>
                                        <th className="border px-2 py-1">Reason</th>
                                        <th className="border px-2 py-1">Recorded By</th>
                                        <th className="border px-2 py-1">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selected.defects.map(d => {
                                        const productName =
                                            selected.items.find(i => i.product.id === d.productId)
                                                ?.product.name || "-";
                                        return (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="border px-2 py-1">{productName}</td>
                                                <td className="border px-2 py-1 text-center">{d.quantity}</td>
                                                <td className="border px-2 py-1">{d.defectType}</td>
                                                <td className="border px-2 py-1">{d.disposition}</td>
                                                <td className="border px-2 py-1">{d.reason || "-"}</td>
                                                <td className="border px-2 py-1">{d.recordedBy.fullName}</td>
                                                <td className="border px-2 py-1">
                                                    {new Date(d.createdAt).toLocaleDateString()}
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 mt-4">
                    {selected.status === "DRAFT" && (
                        <button
                            onClick={() => confirmProduction(selected.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                        >
                            Confirm Production
                        </button>
                    )}

                    {selected.status === "CONFIRMED" && (
                        <button
                            onClick={() => lockProduction(selected.id)}
                            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 transition"
                        >
                            Lock Production
                        </button>
                    )}
                </div>
            </div>
        );

    /* ================= LIST VIEW ================= */
    return (
        <div className="bg-white p-6 space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">
                Production Management
            </h1>

            {/* Productions Table */}
            <div className="overflow-x-auto border rounded-lg shadow-sm">
                <table className="w-full text-sm table-auto border-collapse">
                    <thead className="bg-gray-100 sticky top-0 text-left">
                        <tr>
                            <th className="border px-2 py-1">#</th>
                            <th className="border px-2 py-1">No</th>
                            <th className="border px-2 py-1">Batch</th>
                            <th className="border px-2 py-1">Status</th>
                            <th className="border px-2 py-1">Location</th>
                            <th className="border px-2 py-1">Created By</th>
                            <th className="border px-2 py-1">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productions.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-4 text-gray-500">
                                    No productions found
                                </td>
                            </tr>
                        ) : (
                            productions.map((p, i) => (
                                <tr
                                    key={p.id}
                                    className="even:bg-gray-50 hover:bg-gray-100 transition"
                                >
                                    <td className="border px-2 py-1">{i + 1}</td>
                                    <td className="border px-2 py-1">{p.productionNo}</td>
                                    <td className="border px-2 py-1">{p.batchNumber}</td>
                                    <td className="border px-2 py-1">
                                        <span
                                            className={`px-2 py-1 rounded text-white text-xs ${p.status === "DRAFT"
                                                ? "bg-gray-500"
                                                : p.status === "CONFIRMED"
                                                    ? "bg-green-600"
                                                    : "bg-purple-700"
                                                }`}
                                        >
                                            {p.status}
                                        </span>
                                    </td>
                                    <td className="border px-2 py-1">{p.location.name}</td>
                                    <td className="border px-2 py-1">{p.createdBy.fullName}</td>
                                    <td className="border px-2 py-1">
                                        <button
                                            onClick={() => setSelected(p)}
                                            className="text-blue-600 font-medium hover:underline"
                                        >
                                            Open
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Global Defects Table */}
            {allDefects.length > 0 && (
                <div className="mt-10 border rounded-lg shadow-sm p-4">
                    <h2 className="text-xl font-semibold mb-3">All Production Defects</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm table-auto border-collapse">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="border px-2 py-1">Production No</th>
                                    <th className="border px-2 py-1">Batch</th>
                                    <th className="border px-2 py-1">Product</th>
                                    <th className="border px-2 py-1">Qty</th>
                                    <th className="border px-2 py-1">Type</th>
                                    <th className="border px-2 py-1">Disposition</th>
                                    <th className="border px-2 py-1">Reason</th>
                                    <th className="border px-2 py-1">Recorded By</th>
                                    <th className="border px-2 py-1">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allDefects.map(d => (
                                    <tr key={d.id} className="hover:bg-gray-50">
                                        <td className="border px-2 py-1">{d.productionNo}</td>
                                        <td className="border px-2 py-1">{d.batchNumber}</td>
                                        <td className="border px-2 py-1">{d.productName}</td>
                                        <td className="border px-2 py-1 text-center font-semibold">{d.quantity}</td>
                                        <td className="border px-2 py-1">{d.defectType}</td>
                                        <td className="border px-2 py-1">{d.disposition}</td>
                                        <td className="border px-2 py-1">{d.reason || "-"}</td>
                                        <td className="border px-2 py-1">{d.recordedBy.fullName}</td>
                                        <td className="border px-2 py-1">{new Date(d.createdAt).toLocaleDateString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
