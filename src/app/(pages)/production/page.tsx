"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import { Dropdown } from "@/components/SingleSelectComboBox/GenericDropdown";
import { NumberInput } from "@/components/Inputs/NumberInput";
import { TextArea } from "@/components/Inputs/TextArea";
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";
import SearchInput from "@/components/search/SearchInput";
import Pagination from "@/components/pagination/pagination";

import ProductionReportsPage from "./production-reports/page";
import QualityChartsPage from "@/components/quality-control/QualityReports";
import ProductionBatchTracking from "@/components/production/batchTracking";
import BOMListPage from "./bom/page";

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
    recordedByName: string;
    createdAt: string;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    status: ProductionStatus;
    location: { id: string; name: string };
    locationName: string;
    createdBy: { id: string; fullName: string };
    createdByName: string;
    recordedBy: { id: string; fullName: string };
    recordedByName: string;
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

export default function ProductionPage() {
    const user = useUser();
    const canEdit = user?.role === "ADMIN" || user?.role === "OPERATOR";
    const canSubmit = user?.role === "ADMIN";
    const router = useRouter();

    const [productions, setProductions] = useState<Production[]>([]);
    const [selected, setSelected] = useState<Production | null>(null);
    const [defects, setDefects] = useState<Record<string, DefectForm>>({});
    const [loading, setLoading] = useState(true);

    const [searchQuery, setSearchQuery] = useState("");
    const [searchDefectsQuery, setSearchDefectsQuery] = useState("");
    const [view, setView] = useState<"list" | "defects" | "Production charts" | 'bom' | "Quality charts">("list");

    const ITEMS_PER_PAGE = 20;
    const [currentPage, setCurrentPage] = useState(1);
    const [currentPageProd, setCurrentPageProd] = useState(1);

    /* ================= FETCH DATA ================= */

    async function fetchProductions() {
        setLoading(true);
        const res = await fetch("/api/rbac/productions");
        const json = await res.json();
        const productionsUpdated = json.data.map((p: Production) => ({
            ...p,
            locationName: p.location?.name,
            createdByName: p.createdBy?.fullName,
        }));
        setProductions(productionsUpdated);
        setLoading(false);
    }

    useEffect(() => {
        fetchProductions();
    }, []);

    /* ================= ACTIONS ================= */

    async function confirmProduction(id: string) {
        if (!confirm("Confirm this production? Inventory will be posted.")) return;
        await fetch(`/api/rbac/productions/${id}/confirm`, { method: "POST" });
        window.location.reload();
    }

    async function lockProduction(id: string) {
        if (
            !confirm(
                "Locking Production means no more changes can be made to this batch!!! This action cannot be undone. Do you wish to Continue?"
            )
        )
            return;
        await fetch(`/api/rbac/productions/${id}/lock`, { method: "POST" });
        setSelected(null);
        window.location.reload();
    }

    function updateDefect(productId: string, field: keyof DefectForm, value: any) {
        setDefects((prev) => ({
            ...prev,
            [productId]: {
                ...(prev[productId] ?? { quantity: 0, defectType: "", disposition: "", reason: "" }),
                [field]: value,
            },
        }));
    }

    async function submitBatchDefects() {
        if (!selected) return;

        const payload = Object.entries(defects)
            .map(([productId, d]) => ({
                productId,
                quantity: d.quantity,
                defectType: d.defectType,
                disposition: d.disposition,
                reason: d.reason,
            }))
            .filter((d) => d.quantity > 0 && d.defectType && d.disposition);

        if (!payload.length) return alert("No valid defects entered");

        if (!confirm("Submit ALL entered defects?")) return;

        await fetch(`/api/rbac/productions/${selected.id}/defects/batch`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ defects: payload }),
        });

        setDefects({});
        window.location.reload();
    }

    /* ================= FILTERED DATA ================= */

    const filteredProductions = productions.filter(
        (p) =>
            p.productionNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const allDefects = productions.flatMap((p) =>
        p.defects.map((d) => ({
            ...d,
            productionNo: p.productionNo,
            batchNumber: p.batchNumber,
            recordedByName: d.recordedBy?.fullName,
            productName: p.items.find((i) => i.product.id === d.productId)?.product.name || "-",
        }))
    );

    const filteredAllDefects = allDefects.filter(
        (p) =>
            p.productionNo.toLowerCase().includes(searchDefectsQuery.toLowerCase()) ||
            p.batchNumber.toLowerCase().includes(searchDefectsQuery.toLowerCase())
    );

    const totalPages = Math.ceil(filteredAllDefects.length / ITEMS_PER_PAGE);
    const paginatedfilteredAllDefects = filteredAllDefects.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const totalPagesProductions = Math.ceil(filteredProductions.length / ITEMS_PER_PAGE);
    const paginatedfilteredProductions = filteredProductions.slice(
        (currentPageProd - 1) * ITEMS_PER_PAGE,
        currentPageProd * ITEMS_PER_PAGE
    );

    if (loading) return <Loading message="Loading productions..." />;

    /* ================= EXPORT HEADERS ================= */

    const productionExportHeaders: ExportHeader<Production>[] = [
        { key: "productionNo", label: "Production No" },
        { key: "batchNumber", label: "Batch No" },
        { key: "status", label: "Status" },
        { key: "locationName", label: "Location" },
        { key: "createdByName", label: "Recorded By" },
        { key: "createdAt", label: "Created At" },
    ];

    const defectExportHeaders: ExportHeader<
        ProductionDefect & { productionNo: string; batchNumber: string; productName: string }
    >[] = [
            { key: "productionNo", label: "Production No" },
            { key: "batchNumber", label: "Batch" },
            { key: "productName", label: "Product" },
            { key: "quantity", label: "Quantity" },
            { key: "defectType", label: "Defect Type" },
            { key: "disposition", label: "Disposition" },
            { key: "reason", label: "Reason" },
            { key: "recordedByName", label: "Recorded By" },
            { key: "createdAt", label: "Date" },
        ];

    /* ================= REPORT DATA ================= */

    const defectTypes = ["PACKAGING", "CONTAMINATION", "DAMAGED", "OTHER"];
    const defectTypeData = defectTypes.map((type) => ({
        name: type,
        value: allDefects.filter((d) => d.defectType === type).reduce((sum, d) => sum + d.quantity, 0),
    }));

    const batchDefectData = productions.map((p) => {
        const totalDefects = p.defects?.reduce((s, d) => s + d.quantity, 0);
        const totalProduced = p.items?.reduce((s, i) => s + i.quantity, 0);
        return {
            batchNumber: p.batchNumber,
            productionNo: p.productionNo,
            totalDefects,
            defectRate: totalProduced ? parseFloat(((totalDefects / totalProduced) * 100).toFixed(2)) : 0,
        };
    });

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

    /* ================= VIEWS ================= */

    if (selected) {
        /* ================= DETAILS VIEW ================= */
        return (
            <div className="p-5 space-y-2 rounded-md">
                <button onClick={() => setSelected(null)} className="text-blue-600 font-medium">
                    ← Back to list
                </button>
                <div className="bg-white p-5 space-y-2 rounded-md">
                    <div className="grid grid-cols-1 mb-5">
                        <div className="text-2xl font-semibold text-gray-800">
                            Production No: <span className="text-sm">{selected.productionNo}</span>
                        </div>
                        <div className="text-2xl font-semibold text-gray-800">
                            Batch No: <span className="text-sm">{selected.batchNumber}</span>
                        </div>
                    </div>

                    {selected.items.map((item) => {
                        const defectTotal = selected.defects
                            .filter((d) => d.productId === item.product.id)
                            .reduce((s, d) => s + d.quantity, 0);

                        return (
                            <div key={item.product.id} className="border rounded-lg p-4 shadow-sm space-y-2 mb-5">
                                <strong>{item.product.name}</strong>
                                <div className="text-sm text-gray-500">
                                    Produced: {item.quantity} · Defects: {defectTotal}
                                </div>

                                {selected.status !== "LOCKED" && canEdit && (
                                    <div className="grid md:grid-cols-4 gap-2">
                                        <NumberInput
                                            label="Quantity Defective"
                                            value={defects[item.product.id]?.quantity || 0}
                                            onChange={(value) => updateDefect(item.product.id, "quantity", value)}
                                        />
                                        <Dropdown
                                            label="Defect Type"
                                            value={defects[item.product.id]?.defectType || ""}
                                            onChange={(id) => updateDefect(item.product.id, "defectType", id)}
                                            items={defectTypes.map((d) => ({ id: d, label: d }))}
                                        />
                                        <Dropdown
                                            label="Select Disposition"
                                            value={defects[item.product.id]?.disposition || ""}
                                            onChange={(id) => updateDefect(item.product.id, "disposition", id)}
                                            items={[
                                                { id: "SCRAPPED", label: "Scrapped" },
                                                { id: "REWORKED", label: "Reworked" },
                                                { id: "HELD", label: "Held" },
                                            ]}
                                        />
                                        <TextArea
                                            label="Reason"
                                            placeholder="Enter reason or comment"
                                            className="border rounded px-2 py-1"
                                            value={defects[item.product.id]?.reason || ""}
                                            onChange={(value) => updateDefect(item.product.id, "reason", value)}
                                        />
                                    </div>
                                )}
                            </div>
                        );
                    })}

                    {selected.status !== "LOCKED" && canSubmit && (
                        <button
                            onClick={submitBatchDefects}
                            className="bg-red-600 text-white px-5 py-1 rounded-md hover:bg-red-700"
                        >
                            Submit Defects
                        </button>
                    )}

                    <div className="flex gap-5 py-2">
                        {selected.status === "DRAFT" && canSubmit && (
                            <button
                                onClick={() => confirmProduction(selected.id)}
                                className="bg-green-600 text-white px-5 py-1 rounded-md hover:bg-green-700"
                            >
                                Confirm Production
                            </button>
                        )}
                        {selected.status === "CONFIRMED" && canSubmit && (
                            <button
                                onClick={() => lockProduction(selected.id)}
                                className="bg-purple-700 text-white px-5 py-1 rounded-md hover:bg-purple-700"
                            >
                                Lock Production
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    /* ================= MAIN LIST / DEFECTS / REPORTS ================= */
    return (
        <div className="space-y-5 p-5">
            {/* ===== VIEW TOGGLE ===== */}
            <div className="bg-white rounded-sm flex gap-5 mb-5 p-3">
                <button
                    onClick={() => setView("list")}
                    className={view === "list" ? "font-bold underline" : ""}
                >
                    Productions
                </button>
                <button
                    onClick={() => setView("defects")}
                    className={view === "defects" ? "font-bold underline" : ""}
                >
                    Defects Register
                </button>
                <button
                    onClick={() => setView("Production charts")}
                    className={view === "Production charts" ? "font-bold underline" : ""}
                >
                    Production Report
                </button>
                <button
                    onClick={() => setView("Quality charts")}
                    className={view === "Quality charts" ? "font-bold underline" : ""}
                >
                    Quality Control Report
                </button>
                <button
                    onClick={() => setView("bom")}
                    className={view === "bom" ? "font-bold underline" : ""}
                >
                    Bill of Materials
                </button>
            </div>

            {view === "list" && (

                <div className="bg-white overflow-x-auto border rounded-md px-5 py-2 shadow-sm">
                    <div><h2 className="text-xl font-bold mb-3">Production Management</h2></div>
                    <div className="flex flex-cols-2 justify-between gap-5 mb-2">
                        <SearchInput
                            value={searchQuery}
                            onChange={setSearchQuery}
                            placeholder="Search by Production No or Batch No"
                            className="w-full"
                        />
                        <ExportButton
                            type="csv"
                            headers={productionExportHeaders}
                            data={productions}
                            filename="productions.csv"
                            label="Export CSV"
                        />
                        <ExportButton
                            type="pdf"
                            headers={productionExportHeaders}
                            data={productions}
                            filename="productions.pdf"
                            label="Export PDF"
                            title="Productions Report"
                        />
                    </div>
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-gray-100 sticky top-0 text-left border border-black">
                            <tr>
                                <th className="border px-2 py-1">#</th>
                                <th className="border px-2 py-1">Production No</th>
                                <th className="border px-2 py-1">Batch No</th>
                                <th className="border px-2 py-1">Status</th>
                                <th className="border px-2 py-1">Location</th>
                                <th className="border px-2 py-1">Recorded By</th>
                                <th className="border px-2 py-1">Created At</th>
                                <th className="border px-2 py-1">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedfilteredProductions.length === 0 ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-4 text-gray-500">
                                        No productions found
                                    </td>
                                </tr>
                            ) : (
                                paginatedfilteredProductions.map((p, i) => (
                                    <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100 transition">
                                        <td className="border px-2 py-1">{i + 1}</td>
                                        <td className="border px-2 py-1">{p.productionNo}</td>
                                        <td className="border px-2 py-1">{p.batchNumber}</td>
                                        <td className="border px-2 py-1">
                                            <span
                                                className={`px-2 py-1 rounded text-white text-xs ${p.status === "DRAFT" ? "bg-gray-500" : p.status === "CONFIRMED" ? "bg-green-600" : "bg-purple-700"
                                                    }`}
                                            >
                                                {p.status}
                                            </span>
                                        </td>
                                        <td className="border px-2 py-1">{p.location.name}</td>
                                        <td className="border px-2 py-1">{p.createdBy.fullName}</td>
                                        <td className="border px-2 py-1">{new Date(p.createdAt).toLocaleString()}</td>
                                        <td className="flex justify-start border px-2 py-1 gap-5">
                                            <button
                                                className="text-orange-600 font-medium hover:underline"
                                                onClick={() => router.push(`/production/${p.id}`)}
                                            >
                                                View
                                            </button>
                                            <button
                                                onClick={() => setSelected(p)}
                                                className="text-blue-600 font-medium hover:underline"
                                            >
                                                Update
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                    <div className="mt-5">
                        <Pagination currentPage={currentPageProd} totalPages={totalPagesProductions} onPageChange={setCurrentPageProd} />
                    </div>
                    <div className="mt-5">
                        <ProductionBatchTracking />
                    </div>
                </div>
            )}

            {view === "defects" && paginatedfilteredAllDefects.length > 0 && (
                <div className="bg-white border rounded-sm shadow-sm p-5 overflow-x-auto">
                    <div><h2 className="text-xl font-bold mb-3">Defects Register</h2></div>
                    <div className="flex justify-end gap-5 mb-2">
                        <SearchInput
                            value={searchDefectsQuery}
                            onChange={setSearchDefectsQuery}
                            placeholder="Search by Production No or Batch No"
                        />
                        <ExportButton
                            type="csv"
                            headers={defectExportHeaders}
                            data={allDefects}
                            filename="defects.csv"
                            label="Export CSV"
                        />
                        <ExportButton
                            type="pdf"
                            headers={defectExportHeaders}
                            data={allDefects}
                            filename="defects.pdf"
                            label="Export PDF"
                            title="Defects Report"
                            mode="landscape"
                        />
                    </div>
                    <table className="w-full text-sm table-auto border-collapse">
                        <thead className="bg-gray-100 sticky top-0 text-left border border-black">
                            <tr>
                                <th className="border px-2 py-1">Production No</th>
                                <th className="border px-2 py-1">Batch</th>
                                <th className="border px-2 py-1">Product</th>
                                <th className="border px-2 py-1">Quantity</th>
                                <th className="border px-2 py-1">Defect Type</th>
                                <th className="border px-2 py-1">Disposition</th>
                                <th className="border px-2 py-1">Reason</th>
                                <th className="border px-2 py-1">Recorded By</th>
                                <th className="border px-2 py-1">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedfilteredAllDefects.map((d) => (
                                <tr key={d.id} className="hover:bg-gray-50">
                                    <td className="border px-2 py-1">{d.productionNo}</td>
                                    <td className="border px-2 py-1">{d.batchNumber}</td>
                                    <td className="border px-2 py-1">{d.productName}</td>
                                    <td className="border px-2 py-1 text-center font-semibold">{d.quantity}</td>
                                    <td className="border px-2 py-1">{d.defectType}</td>
                                    <td className="border px-2 py-1">{d.disposition}</td>
                                    <td className="border px-2 py-1">{d.reason || "-"}</td>
                                    <td className="border px-2 py-1">{d.recordedBy?.fullName}</td>
                                    <td className="border px-2 py-1">{new Date(d.createdAt).toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-5">
                        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                    </div>
                </div>
            )}

            {view === "Production charts" && (
                <div className="">
                    <ProductionReportsPage />
                </div>
            )}
            {view === "Quality charts" && (
                <div className="">
                    <QualityChartsPage />
                </div>
            )}
            {view === "bom" && (
                <div className="">
                    <BOMListPage />
                </div>
            )}
        </div>
    );
}
