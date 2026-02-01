"use client";

import Loading from "@/components/Loading";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ProductDropdown } from "@/components/filters/Dropdowns/ProductDropdown";
import { LocationDropdown } from "@/components/filters/Dropdowns/LocationDropdown";
import Pagination from "@/components/pagination/pagination";
import { ExportButton } from "@/components/Exports/ExportButton";
import { ExportHeader } from "@/lib/ExportUtils";
import SearchInput from "@/components/search/SearchInput";
import ProductionBatchTracking from "@/components/production/batchTracking";

interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    packSize: number;
    weightUnit: string;
    weightValue: number;
}

interface Location {
    id: string;
    name: string;
}

interface ProductionItem {
    productId: string;
    quantity: number;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    location: Location;
    createdById: string;
    createdBy: {
        id: string;
        fullName: string;
        role: string;
    }
    locationName: string;
    createdByName: string,
    recordedBy: { id: string; fullName: string };
    recordedByName: string,
    createdAt: string;
    updatedAt: string;
    items: { product: Product; quantity: number }[];
    notes?: string;
    status: string;
}
interface ProductionDefect {
    id: string;
    quantity: number;
    defectType: string;
    disposition: string;
    reason?: string;
    createdAt: string;
    product: {
        name: string;
        sku: string;
    };
    recordedBy: { fullName: string };
    recordedByName: string;
    production: {
        productionNo: string;
        batchNumber: string;
    };
}

export default function ProductionPage() {
    const [productions, setProductions] = useState<Production[]>([]);
    const router = useRouter();
    const [products, setProducts] = useState<Product[]>([]);
    const [locations, setLocations] = useState<Location[]>([]);
    const [productionNo, setProductionNo] = useState("");
    const [batchNumber, setBatchNumber] = useState("");
    const [locationId, setLocationId] = useState("");
    const [notes, setNotes] = useState("");
    const [items, setItems] = useState<ProductionItem[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [viewingProduction, setViewingProduction] = useState<Production | null>(null);

    const [isFetchingSequence, setIsFetchingSequence] = useState(false);

    // ---------------- Fetch all data ----------------
    const fetchData = async () => {
        try {
            const [prodsRes, prodsListRes, locsRes] = await Promise.all([
                fetch("/api/rbac/productions"),
                fetch("/api/rbac/getProducts"),
                fetch("/api/rbac/locations"),
            ]);

            if (!prodsRes.ok || !prodsListRes.ok || !locsRes.ok) throw new Error("Failed to fetch data");

            const [prodsJson, prodsListJson, locsJson] = await Promise.all([
                prodsRes.json(),
                prodsListRes.json(),
                locsRes.json(),
            ]);
            const productionsUpdated = prodsJson.data.map(p => ({
                ...p,
                locationName: p.location?.name,
                createdByName: p.createdBy?.fullName,
            }));
            setProductions(productionsUpdated || []);
            setProducts(prodsListJson.data || []);
            setLocations(locsJson.data || []);

            if (!editingId) await fetchNextSequence();
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData().finally(() => setLoading(false));
    }, []);

    // ---------------- Fetch next ProductionNo & BatchNumber ----------------
    const fetchNextSequence = async () => {
        if (isFetchingSequence) return;
        setIsFetchingSequence(true);
        try {
            const res = await fetch("/api/rbac/productionSequence");
            const json = await res.json();
            setProductionNo(json.data.productionNo);
            setBatchNumber(json.data.batchNumber);
        } catch (error) {
            console.error("Failed to fetch production sequence:", error);
        } finally {
            setIsFetchingSequence(false);
        }
    };

    // ---------------- Item management ----------------
    const addItem = () => setItems([...items, { productId: "", quantity: 0 }]);
    const removeItem = (index: number) => setItems(items.filter((_, i) => i !== index));
    const handleItemChange = (index: number, field: keyof ProductionItem, value: any) => {
        const newItems = [...items];
        if (field === "quantity") value = Number(value) || 0;
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const resetForm = async () => {
        setBatchNumber("");
        setNotes("");
        setLocationId("");
        setItems([]);
        setEditingId(null);
        await fetchNextSequence();
    };

    // ---------------- Create or update ----------------
    const handleSubmit = async () => {
        if (!locationId || !batchNumber || items.length === 0 || items.some(i => !i.productId || i.quantity <= 0)) {
            alert("Please select at least one item and fill all quantities > 0");
            return;
        }

        setLoading(true);

        try {
            // Prepare items safely
            const safeItems = items.map(i => ({
                productId: i.productId,
                quantity: Number(i.quantity) || 0, // cast to number
            }));

            const payload = {
                productionNo,
                batchNumber,
                locationId,
                notes,
                items: safeItems,
                createdById: "cmk40hu1n00013ooqrcrur0ny", // replace with actual logged-in user ID
            };

            if (editingId) {
                const response = await fetch(`/api/rbac/productions/${editingId}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ notes, items: safeItems }),
                });
                if (!response.ok) {
                    throw new Error('Failed to update production');
                }
            } else {
                const response = await fetch("/api/rbac/productions", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                if (!response.ok) {
                    throw new Error('Failed to create production');
                }
            }

            await resetForm();
            await fetchData();
        } catch (error) {
            console.error("Error saving production:", error);
            alert("Failed to save production");
        }

        setLoading(false);
    };

    // ---------------- Edit / Delete ----------------
    const handleEdit = (prod: Production) => {
        setEditingId(prod.id);
        setProductionNo(prod.productionNo);
        setBatchNumber(prod.batchNumber);
        setNotes(prod.notes || "");
        setLocationId(prod.location.id);
        setItems(prod.items.map(i => ({ productId: i.product.id, quantity: i.quantity || 0 })));
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this production?")) return;
        setLoading(true);

        try {
            const res = await fetch(`/api/rbac/productions/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Delete failed");
            await fetchData();
        } catch (error) {
            console.error("Error deleting production:", error);
            alert("Failed to delete production");
        }

        setLoading(false);
    };

    const allDefects: ProductionDefect[] = productions.flatMap(p =>
        (p as any).defects?.map((d: any) => ({
            ...d,
            production: {
                productionNo: p.productionNo,
                batchNumber: p.batchNumber,
            },
        })) || []
    );


    const ITEMS_PER_PAGE = 10;
    const [currentPageDefects, setCurrentPageDefects] = useState(1);
    const [currentPageProd, setCurrentPageProd] = useState(1);

    const [searchQueryProd, setSearchQueryProd] = useState("");
    const filteredProductions = productions.filter(p =>
        p.productionNo.toLowerCase().includes(searchQueryProd.toLowerCase()) ||
        p.batchNumber.toLowerCase().includes(searchQueryProd.toLowerCase())
    );

    const [searchDefectsQuery, setSearchDefectsQuery] = useState("");
    const filteredAllDefects = allDefects.filter(d =>
        d.production.productionNo.toLowerCase().includes(searchDefectsQuery.toLowerCase()) ||
        d.production.batchNumber.toLowerCase().includes(searchDefectsQuery.toLowerCase())
    );
    const totalPagesProductions = Math.ceil(filteredProductions.length / ITEMS_PER_PAGE);

    const paginatedfilteredProductions = filteredProductions.slice(
        (currentPageProd - 1) * ITEMS_PER_PAGE,
        currentPageProd * ITEMS_PER_PAGE
    );

    const totalPagesDefects = Math.ceil(filteredAllDefects.length / ITEMS_PER_PAGE);
    const paginatedfilteredAllDefects = filteredAllDefects.slice(
        (currentPageDefects - 1) * ITEMS_PER_PAGE,
        currentPageDefects * ITEMS_PER_PAGE
    );

    useEffect(() => setCurrentPageProd(1), [searchQueryProd]);
    useEffect(() => setCurrentPageDefects(1), [searchDefectsQuery]);

    // EXPORTS
    const productionExportHeaders: ExportHeader<Production>[] = [
        { key: "productionNo", label: "Production No" },
        { key: "batchNumber", label: "Batch No" },
        { key: "locationName", label: "Location" },
        { key: "createdByName", label: "Created By" },
        { key: "status", label: "Status" },
        { key: "createdAt", label: "Created At" },
        { key: "updatedAt", label: "Updated At" },
    ];

    const defectExportHeaders: ExportHeader<ProductionDefect & { productionNo: string; batchNumber: string; productName: string; }>[] = [
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

    // ---------------- Render ----------------
    return (
        <div>
            <div className="p-6">
                {editingId && (
                    <>
                        {/* Form */}
                        <div className="bg-white mb-6 border p-2 rounded-lg shadow">
                            <h2 className="text-2xl font-bold">
                                {editingId ? "Edit Production" : "Create Production"}
                            </h2>
                            <p className="mb-2 text-gray-500">Production Number : {productionNo}</p>
                            {/* ProductionNo, Batch, Location */}
                            <div className="border p-2 space-y-1">
                                <div className="grid grid-cols-1 xl:flex gap-4 mb-2">
                                    <div className="w-full flex flex-col flex-1">
                                        <label className="font-medium mb-2">Production No</label>
                                        <input className="border border-gray-200 text-sm rounded-lg p-2"
                                            value={productionNo} readOnly />
                                    </div>
                                    <div className="w-full flex flex-col flex-1">
                                        <label className="font-medium mb-2">Batch Number</label>
                                        <input
                                            className="border border-gray-200 text-sm rounded-lg p-2"
                                            placeholder="Batch Number"
                                            value={batchNumber}
                                            onChange={e => setBatchNumber(e.target.value)}
                                        />
                                    </div>
                                    <div className="w-full flex flex-col flex-1">
                                        <LocationDropdown
                                            locations={locations}
                                            value={locationId}
                                            onChange={setLocationId}
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <div className="flex flex-col mb-2">
                                    <label className="font-medium mb-2">Remarks (Comment)</label>
                                    <textarea
                                        className="border border-gray-300 rounded-md text-gray-500 dark:text-black p-2 w-full"
                                        placeholder="Enter note, comment or remarks here"
                                        value={notes}
                                        onChange={e => setNotes(e.target.value)}
                                    />
                                </div>

                                {/* Items */}
                                {items.map((item, index) => {
                                    const selectedProduct = products.find(p => p.id === item.productId);
                                    console.log(selectedProduct)
                                    return (
                                        <div key={index} className="border p-2 rounded flex flex-col gap-2">
                                            <div className="flex flex-col xl:flex-row gap-1">
                                                <div className="">
                                                    <ProductDropdown
                                                        products={products}
                                                        value={item.productId}
                                                        onChange={(value) => handleItemChange(index, "productId", value)}
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label className="font-medium mb-2">SKU</label>
                                                    <input type="text" className="border border-gray-200 text-sm rounded-lg p-2" value={selectedProduct?.sku || ""} readOnly />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label className="font-medium mb-2">Pack Size</label>
                                                    <input type="number" className="border border-gray-200 text-sm rounded-lg p-2" value={selectedProduct?.packSize || 0} readOnly />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label className="font-medium mb-2">Weight</label>
                                                    <input type="text" className="border border-gray-200 text-sm rounded-lg p-2"
                                                        value={`${selectedProduct?.weightValue ?? 0} ${selectedProduct?.weightUnit ?? ''}`}
                                                        readOnly
                                                    />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label className="font-medium mb-2">Price</label>
                                                    <input type="number" className="border border-gray-200 text-sm rounded-lg p-2" value={(selectedProduct?.price || 0).toFixed(2)} readOnly />
                                                </div>
                                                <div className="flex flex-col flex-1">
                                                    <label className="font-medium mb-2">Quantity</label>
                                                    <input
                                                        type="number"
                                                        className="border border-gray-200 text-sm rounded-lg p-2"
                                                        value={isNaN(item.quantity) ? 0 : item.quantity}
                                                        onChange={e => handleItemChange(index, "quantity", parseInt(e.target.value))}
                                                        min={1}
                                                    />
                                                </div>
                                            </div>
                                            <div className="flex">
                                                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => removeItem(index)}>Remove</button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            <div className="flex flex-row flex-1 justify-center gap-5 mt-5">

                                <button className="bg-blue-500 text-white px-2 py-1 rounded-md mb-2" onClick={addItem} disabled={products.length === 0}>
                                    + Add Item
                                </button>


                                <button
                                    className={`bg-green-500 text-white px-2 py-1 rounded-md mb-2 ${loading ? "opacity-50" : ""}`}
                                    onClick={handleSubmit}
                                    disabled={loading}
                                >
                                    {editingId ? "Update Production" : "Save Production"}
                                </button>
                                {editingId && (
                                    <button className="bg-red-500 text-white px-2 py-1 rounded-md mb-2" onClick={resetForm}>Cancel</button>
                                )}
                            </div>
                        </div>
                    </>
                )}

                {/* Production Table */}
                <div className="bg-white overflow-auto border shadow p-5 rounded-lg hover:shadow-lg transition-shadow">
                    <h1 className="text-2xl font-bold">Production Records</h1>
                    <p className="mb-2 text-gray-500">Record Production transactions</p>
                    <div className="bg-white mb-5">
                        <div className="flex flex-cols-2 justify-between gap-5 mb-2">
                            <SearchInput
                                value={searchQueryProd}
                                onChange={setSearchQueryProd}
                                placeholder="Search by Production No or Batch No"
                                className="w-full"
                            />
                            <ExportButton
                                type="csv"
                                headers={productionExportHeaders}
                                data={filteredProductions}
                                filename="productions.csv"
                                label="Export CSV"
                            />

                            <ExportButton
                                type="pdf"
                                headers={productionExportHeaders}
                                data={filteredProductions}
                                filename="productions.pdf"
                                label="Export PDF"
                                title="Productions Report"
                            />
                        </div>
                        <table className="min-w-full divide-y divide-gray-200 text-sm">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">#</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Production No</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Batch</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Location</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Created By</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Status</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Created At</th>
                                    <th className="px-2 py-1 text-left text-sm font-semibold text-gray-700">Updated At</th>
                                    <th className="px-2 py-1 text-center text-sm font-semibold text-gray-700">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2 text-sm text-gray-800 text-center">
                                            <Loading
                                                message="Loading Production Data"
                                            />
                                        </td>
                                    </tr>
                                ) : paginatedfilteredProductions.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-4 py-2 text-sm text-gray-800 text-center">
                                            No productions found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedfilteredProductions.map((p, index) => (
                                        <tr key={p.id} className="even:bg-gray-50 hover:bg-gray-100">
                                            <td className="px-2 py-1 text-sm text-gray-800">{index + 1}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{p.productionNo}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{p.batchNumber}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{p.location.name}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{p.createdBy?.fullName}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{p.status}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{new Date(p.createdAt).toLocaleString()}</td>
                                            <td className="px-2 py-1 text-sm text-gray-800">{new Date(p.updatedAt).toLocaleString()}</td>
                                            <td className="px-2 py-1 flex gap-2 justify-center">
                                                <button
                                                    className="bg-blue-500 px-3 py-1 rounded hover:bg-blue-600 text-white"
                                                    onClick={() => router.push(`/production/${p.id}`)}
                                                >
                                                    View
                                                </button>
                                                <button className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white"
                                                    onClick={() => handleEdit(p)}>Edit</button>
                                                <button className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 text-white"
                                                    onClick={() => handleDelete(p.id)}>Delete</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Pagination
                        currentPage={currentPageProd}
                        totalPages={totalPagesProductions}
                        onPageChange={setCurrentPageProd}
                    />
                </div>

                {/* ================= GENERAL DEFECTS TABLE ================= */}
                <div className="mt-10 bg-white border shadow p-4 rounded-lg">
                    <h2 className="text-xl font-bold mb-3">Defects Register</h2>
                    <div className="mb-5">
                        <div className="flex flex-cols-2 justify-between gap-5 mb-2">
                            <SearchInput
                                value={searchDefectsQuery}
                                onChange={setSearchDefectsQuery}
                                placeholder="Search by Production No or Batch No"
                                className="w-full"
                            />
                            <ExportButton
                                type="csv"
                                headers={defectExportHeaders}
                                data={filteredAllDefects}
                                filename="productions.csv"
                                label="Export CSV"
                            />

                            <ExportButton
                                type="pdf"
                                headers={defectExportHeaders}
                                data={filteredAllDefects}
                                filename="productions.pdf"
                                label="Export PDF"
                                title="Productions Report"
                            />
                        </div>
                        <div>
                            <table className="min-w-full divide-y divide-gray-200 text-sm border border-gray-200">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="px-2 py-1 text-left">#</th>
                                        <th className="px-2 py-1 text-left">Production No</th>
                                        <th className="px-2 py-1 text-left">Batch No</th>
                                        <th className="px-2 py-1 text-left">Product</th>
                                        <th className="px-2 py-1 text-center">Qty</th>
                                        <th className="px-2 py-1 text-left">Defect Type</th>
                                        <th className="px-2 py-1 text-left">Disposition</th>
                                        <th className="px-2 py-1 text-left">Reason</th>
                                        <th className="px-2 py-1 text-left">Recorded By</th>
                                        <th className="px-2 py-1 text-left">Date</th>
                                    </tr>
                                </thead>

                                <tbody className="divide-y">
                                    {paginatedfilteredAllDefects.length === 0 ? (
                                        <tr>
                                            <td colSpan={10} className="text-center py-4 text-gray-500">
                                                No defects recorded.
                                            </td>
                                        </tr>
                                    ) : (
                                        paginatedfilteredAllDefects.map((d, i) => (
                                            <tr key={d.id} className="hover:bg-gray-50">
                                                <td className="px-2 py-1">{i + 1}</td>
                                                <td className="px-2 py-1">{d.production.productionNo}</td>
                                                <td className="px-2 py-1">{d.production.batchNumber}</td>
                                                <td className="px-2 py-1">
                                                    {d.product.name} ({d.product.sku})
                                                </td>
                                                <td className="px-2 py-1 text-center font-semibold">
                                                    {d.quantity}
                                                </td>
                                                <td className="px-2 py-1">{d.defectType}</td>
                                                <td className="px-2 py-1">{d.disposition}</td>
                                                <td className="px-2 py-1">{d.reason || "-"}</td>
                                                <td className="px-2 py-1">{d.recordedBy.fullName}</td>
                                                <td className="px-2 py-1">
                                                    {new Date(d.createdAt).toLocaleString()}
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <Pagination
                        currentPage={currentPageDefects}
                        totalPages={totalPagesDefects}
                        onPageChange={setCurrentPageDefects}
                    />
                </div>
            </div>
            <div className="p-5">
                <ProductionBatchTracking />
            </div>
        </div>
    );
}
