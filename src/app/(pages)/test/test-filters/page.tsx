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

    /* ================= FETCH ================= */

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

    /* ================= ACTIONS ================= */

    async function confirmProduction(id: string) {
        if (!confirm("Confirm this production? Inventory will be posted.")) return;
        await fetch(`/api/rbac/productions/${id}/confirm`, { method: "POST" });
        fetchProductions();
    }

    async function lockProduction(id: string) {
        if (!confirm("LOCKING IS FINAL. Continue?")) return;
        await fetch(`/api/rbac/productions/${id}/lock`, { method: "POST" });
        setSelected(null);
        fetchProductions();
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
            [productId]: {
                quantity: 0,
                defectType: "",
                disposition: "",
                reason: "",
            },
        }));

        fetchProductions();
    }

    function updateDefect(
        productId: string,
        field: keyof DefectForm,
        value: any
    ) {
        setDefects(prev => ({
            ...prev,
            [productId]: { ...prev[productId], [field]: value },
        }));
    }

    const allDefects = productions.flatMap(p =>
        p.defects.map(d => ({
            ...d,
            productionNo: p.productionNo,
            batchNumber: p.batchNumber,
            productName:
                p.items.find(i => i.product.id === d.productId)?.product.name || "-",
        }))
    );

    /* ================= LOADING ================= */

    if (loading) return <Loading message="Loading productions..." />;

    /* ================= DETAILS VIEW ================= */

    if (selected)
        return (
            <div className="p-6 space-y-6">
                <button
                    onClick={() => setSelected(null)}
                    className="text-blue-600 underline"
                >
                    ← Back to list
                </button>

                <h2 className="text-xl font-bold">
                    {selected.productionNo} · {selected.status}
                </h2>

                {/* ================= ITEMS ================= */}

                {selected.items.map(item => {
                    const defectTotal = selected.defects
                        .filter(d => d.productId === item.product.id)
                        .reduce((s, d) => s + d.quantity, 0);

                    return (
                        <div
                            key={item.product.id}
                            className="border rounded p-4 space-y-2"
                        >
                            <div className="flex justify-between">
                                <strong>{item.product.name}</strong>
                                <span className="text-sm">
                                    Produced: {item.quantity} · Defects:{" "}
                                    {defectTotal}
                                </span>
                            </div>

                            {selected.status !== "LOCKED" && (
                                <>
                                    <div className="grid md:grid-cols-4 gap-2">
                                        <input
                                            type="number"
                                            min={1}
                                            max={item.quantity}
                                            placeholder="Defect Qty"
                                            className="border p-2 rounded"
                                            value={
                                                defects[item.product.id]?.quantity ||
                                                ""
                                            }
                                            onChange={e =>
                                                updateDefect(
                                                    item.product.id,
                                                    "quantity",
                                                    Number(e.target.value)
                                                )
                                            }
                                        />

                                        <select
                                            className="border p-2 rounded"
                                            value={
                                                defects[item.product.id]?.defectType ||
                                                ""
                                            }
                                            onChange={e =>
                                                updateDefect(
                                                    item.product.id,
                                                    "defectType",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Defect Type</option>
                                            <option value="PACKAGING">Packaging</option>
                                            <option value="CONTAMINATION">
                                                Contamination
                                            </option>
                                            <option value="WEIGHT_VARIANCE">
                                                Weight Variance
                                            </option>
                                            <option value="DAMAGED">Damaged</option>
                                            <option value="EXPIRED">Expired</option>
                                            <option value="OTHER">Other</option>
                                        </select>

                                        <select
                                            className="border p-2 rounded"
                                            value={
                                                defects[item.product.id]?.disposition ||
                                                ""
                                            }
                                            onChange={e =>
                                                updateDefect(
                                                    item.product.id,
                                                    "disposition",
                                                    e.target.value
                                                )
                                            }
                                        >
                                            <option value="">Disposition</option>
                                            <option value="SCRAPPED">Scrapped</option>
                                            <option value="REWORKED">Reworked</option>
                                            <option value="HELD">Held</option>
                                        </select>

                                        <input
                                            className="border p-2 rounded"
                                            placeholder="Reason"
                                            value={
                                                defects[item.product.id]?.reason || ""
                                            }
                                            onChange={e =>
                                                updateDefect(
                                                    item.product.id,
                                                    "reason",
                                                    e.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <button
                                        className="bg-red-600 text-white px-3 py-1 rounded"
                                        onClick={() =>
                                            recordDefect(
                                                selected.id,
                                                item.product.id,
                                                item.quantity
                                            )
                                        }
                                    >
                                        Record Defect
                                    </button>
                                </>
                            )}
                        </div>
                    );
                })}

                {/* ================= DEFECTS TABLE ================= */}

                {selected.defects.length > 0 && (
                    <div>
                        <h3 className="font-bold text-lg mb-2">
                            Recorded Defects
                        </h3>

                        <table className="w-full border text-sm">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="border p-2">Product</th>
                                    <th className="border p-2">Qty</th>
                                    <th className="border p-2">Type</th>
                                    <th className="border p-2">Disposition</th>
                                    <th className="border p-2">Reason</th>
                                    <th className="border p-2">Recorded By</th>
                                    <th className="border p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {selected.defects.map(d => {
                                    const productName =
                                        selected.items.find(
                                            i => i.product.id === d.productId
                                        )?.product.name || "-";

                                    return (
                                        <tr key={d.id} className="border-b">
                                            <td className="border p-2">
                                                {productName}
                                            </td>
                                            <td className="border p-2 text-center">
                                                {d.quantity}
                                            </td>
                                            <td className="border p-2">
                                                {d.defectType}
                                            </td>
                                            <td className="border p-2">
                                                {d.disposition}
                                            </td>
                                            <td className="border p-2">
                                                {d.reason || "-"}
                                            </td>
                                            <td className="border p-2">
                                                {d.recordedBy.fullName}
                                            </td>
                                            <td className="border p-2">
                                                {new Date(
                                                    d.createdAt
                                                ).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* ================= ACTIONS ================= */}

                <div className="flex gap-3">
                    {selected.status === "DRAFT" && (
                        <button
                            onClick={() => confirmProduction(selected.id)}
                            className="bg-green-600 text-white px-4 py-2 rounded"
                        >
                            Confirm Production
                        </button>
                    )}

                    {selected.status === "CONFIRMED" && (
                        <button
                            onClick={() => lockProduction(selected.id)}
                            className="bg-purple-700 text-white px-4 py-2 rounded"
                        >
                            Lock Production
                        </button>
                    )}
                </div>
            </div>
        );

    /* ================= LIST VIEW ================= */

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">
                Production Management
            </h1>

            <table className="w-full border">
                <thead className="bg-gray-100 text-left">
                    <tr>
                        <th>#</th>
                        <th>No</th>
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
                            <td>
                                <span className="px-2 py-1 text-xs rounded bg-gray-200">
                                    {p.status}
                                </span>
                            </td>
                            <td>{p.location.name}</td>
                            <td>{p.createdBy.fullName}</td>
                            <td>
                                <button
                                    onClick={() => setSelected(p)}
                                    className="text-blue-600 underline"
                                >
                                    Open
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ================= GLOBAL DEFECTS TABLE ================= */}

            {allDefects.length > 0 && (
                <div className="mt-10">
                    <h2 className="text-xl font-bold mb-3">
                        Production Defects
                    </h2>

                    <table className="w-full border text-sm">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="border p-2">Production No</th>
                                <th className="border p-2">Batch</th>
                                <th className="border p-2">Product</th>
                                <th className="border p-2">Qty</th>
                                <th className="border p-2">Type</th>
                                <th className="border p-2">Disposition</th>
                                <th className="border p-2">Reason</th>
                                <th className="border p-2">Recorded By</th>
                                <th className="border p-2">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {allDefects.map(d => (
                                <tr key={d.id} className="border-b">
                                    <td className="border p-2">{d.productionNo}</td>
                                    <td className="border p-2">{d.batchNumber}</td>
                                    <td className="border p-2">{d.productName}</td>
                                    <td className="border p-2 text-center">{d.quantity}</td>
                                    <td className="border p-2">{d.defectType}</td>
                                    <td className="border p-2">{d.disposition}</td>
                                    <td className="border p-2">{d.reason || "-"}</td>
                                    <td className="border p-2">
                                        {d.recordedBy.fullName}
                                    </td>
                                    <td className="border p-2">
                                        {new Date(d.createdAt).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
