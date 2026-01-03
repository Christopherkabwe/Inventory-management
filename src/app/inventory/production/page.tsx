"use client";
import DashboardLayout from "@/components/DashboardLayout";
import { useState, useEffect } from "react";

type Product = {
    id: string;
    name: string;
    sku: string;
};

type ProductionItem = {
    id?: string;
    productionId: string;
    product: Product;
    quantity: number;
};

type Production = {
    id: string;
    productionNo: string;
    batchNumber: string;
    createdBy: string;
    createdAt: string;
    items: ProductionItem[];
};

export const metadata = {
    title: "Production",
};

export default function ProductionsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [productions, setProductions] = useState<Production[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal states
    const [openBatch, setOpenBatch] = useState<Production | null>(null);
    const [batchNumber, setBatchNumber] = useState("");
    const [formItems, setFormItems] = useState<ProductionItem[]>([]);

    // Add product form state
    const [newProductId, setNewProductId] = useState("");
    const [newQuantity, setNewQuantity] = useState(1);

    useEffect(() => {
        async function loadData() {
            try {
                const [productsRes, productionsRes] = await Promise.all([
                    fetch("/api/products").then(r => r.json()),
                    fetch("/api/productions?limit=10").then(r => r.json()),
                ]);

                setProducts(Array.isArray(productsRes) ? productsRes : productsRes.products || []);
                setProductions(Array.isArray(productionsRes) ? productionsRes : productionsRes.productions || []);
            } catch (err) {
                console.error("Failed to load data", err);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Open batch modal
    const openBatchModal = (prod: Production) => {
        setOpenBatch(prod);
        setBatchNumber(prod.batchNumber);
        setFormItems(prod.items);
    };

    // Close batch modal
    const closeBatchModal = () => {
        setOpenBatch(null);
        setBatchNumber("");
        setFormItems([]);
        setNewProductId("");
        setNewQuantity(1);
    };

    // Update quantity
    const updateItemQuantity = (id: string | undefined, quantity: number) => {
        setFormItems(prev => prev.map(item => item.id === id ? { ...item, quantity } : item));
    };

    // Remove item
    const removeItem = (id: string | undefined) => {
        setFormItems(prev => prev.filter(item => item.id !== id));
    };

    // Add new item
    const handleAddNewItem = () => {
        if (!newProductId || newQuantity <= 0) return;
        const product = products.find(p => p.id === newProductId);
        if (!product) return;
        const newItemId = `new-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        setFormItems(prev => [...prev, {
            id: newItemId,
            productionId: openBatch.id,
            productId: newProductId,
            product,
            quantity: newQuantity
        }]);
        setNewProductId("");
        setNewQuantity(1);
    };

    // Submit batch update
    // Submit batch update
    const handleSubmitBatch = async () => {
        if (!openBatch) return;

        // Basic validation
        if (!batchNumber.trim()) {
            alert("Batch number is required.");
            return;
        }
        if (formItems.length === 0) {
            alert("At least one product is required.");
            return;
        }

        // Build payload
        const payload = {
            batchNumber: batchNumber.trim(),
            items: formItems
                .filter(item => item.product && item.quantity > 0) // filter invalid entries
                .map(item => ({
                    id: item.id, // may be 'new-*' for new items
                    productId: item.product.id,
                    quantity: Number(item.quantity),
                })),
        };

        console.log("Submitting production payload:", JSON.stringify(payload, null, 2));

        try {
            const res = await fetch(`/api/productions/${openBatch.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) {
                const errText = await res.text();
                console.error("Server error:", errText);
                throw new Error(`Update failed: ${res.status}`);
            }

            const updated = await res.json();

            // Update productions state safely
            if (updated?.production) {
                setProductions(prev =>
                    prev.map(p => (p.id === updated.production.id ? updated.production : p))
                );
            }

            closeBatchModal();
        } catch (err) {
            console.error("Failed to update production:", err);
            alert("Failed to update production. Check console for details.");
        }
    };


    // Export PDF
    const exportPdf = () => {
        if (!openBatch) return;
        import("jspdf").then(jsPDFModule => {
            const jsPDF = jsPDFModule.default;
            require("jspdf-autotable");
            const doc = new jsPDF();
            doc.text(`Production: ${openBatch.productionNo}`, 10, 10);
            doc.text(`Batch Number: ${batchNumber}`, 10, 20);

            const rows = formItems.map(item => [item.product.name, item.quantity.toString()]);
            (doc as any).autoTable({
                head: [["Product", "Quantity"]],
                body: rows,
                startY: 30,
            });

            doc.save(`${openBatch.productionNo}_${batchNumber}.pdf`);
        });
    };

    return (
        <div className="min-h-screen bg-gray-100 overflow-x-auto">
            <DashboardLayout>
                <h1 className="text-2xl font-semibold mb-4">Productions</h1>

                {/* Main Table */}
                <div className="bg-white p-6 rounded-lg shadow-sm overflow-x-auto">
                    <h2 className="text-xl font-semibold mb-4">Recent Productions</h2>
                    <div className="max-h-[420px] overflow-y-auto">
                        <table className="min-w-full border-collapse border">
                            <thead className="bg-gray-100 sticky top-0">
                                <tr>
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Production No</th>
                                    <th className="p-3 border">Batch No</th>
                                    <th className="p-3 border">Created By</th>
                                    <th className="p-3 border">Date</th>
                                    <th className="p-3 border">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-center text-gray-500">
                                            Loading productions...
                                        </td>
                                    </tr>
                                ) : productions.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="p-3 text-center">
                                            No recent productions.
                                        </td>
                                    </tr>
                                ) : (
                                    productions.map((p, i) => (
                                        <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="p-3">{i + 1}</td>
                                            <td className="p-3">{p.productionNo}</td>
                                            <td className="p-3">{p.batchNumber}</td>
                                            <td className="p-3">{p.createdBy}</td>
                                            <td className="p-3">{new Date(p.createdAt).toLocaleString()}</td>
                                            <td className="p-3">
                                                <button
                                                    onClick={() => openBatchModal(p)}
                                                    className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600"
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
                </div>

                {/* Batch Modal */}
                {openBatch && (
                    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded-lg w-full max-w-3xl overflow-y-auto max-h-[90vh]">
                            <h2 className="text-xl font-semibold mb-4">
                                Production: {openBatch.productionNo} (Batch: {batchNumber})
                            </h2>

                            {/* Batch Number */}
                            <div className="mb-4">
                                <label className="block text-sm mb-1">Batch Number</label>
                                <input
                                    type="text"
                                    value={batchNumber}
                                    onChange={e => setBatchNumber(e.target.value)}
                                    className="border p-2 w-full rounded-md"
                                />
                            </div>

                            {/* Products Table */}
                            <table className="min-w-full border-collapse border mb-4">
                                <thead className="bg-gray-100">
                                    <tr>
                                        <th className="p-2 border">Product</th>
                                        <th className="p-2 border">Quantity</th>
                                        <th className="p-2 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {formItems.map((item, idx) => (
                                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                            <td className="p-2">{item.product.name}</td>
                                            <td className="p-2">
                                                <input
                                                    type="number"
                                                    min={1}
                                                    value={item.quantity}
                                                    onChange={e => updateItemQuantity(item.id, Number(e.target.value))}
                                                    className="w-20 border p-1 rounded-md"
                                                />
                                            </td>
                                            <td className="p-2">
                                                <button
                                                    onClick={() => removeItem(item.id)}
                                                    className="px-2 py-1 bg-red-500 text-white rounded-md"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>

                            {/* Add Product Form */}
                            <div className="mb-4 flex gap-2 items-center">
                                <select
                                    onChange={e => setNewProductId(e.target.value)}
                                    value={newProductId}
                                    className="border p-2 rounded-md flex-1"
                                >
                                    <option value="">Select Product</option>
                                    {products
                                        .filter(p => !formItems.some(f => f.product.id === p.id))
                                        .map(p => (
                                            <option key={p.id} value={p.id}>{p.name}</option>
                                        ))}
                                </select>
                                <input
                                    type="number"
                                    min={1}
                                    value={newQuantity}
                                    onChange={e => setNewQuantity(Number(e.target.value))}
                                    placeholder="Quantity"
                                    className="border p-2 w-24 rounded-md"
                                />
                                <button
                                    onClick={handleAddNewItem}
                                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                                >
                                    Add
                                </button>
                            </div>

                            {/* Modal Actions */}
                            <div className="flex justify-between items-center mt-4">
                                <button
                                    onClick={closeBatchModal}
                                    className="px-4 py-2 rounded-md border bg-gray-300 hover:bg-gray-400"
                                >
                                    Close
                                </button>

                                <div className="flex gap-2">
                                    <button
                                        onClick={exportPdf}
                                        className="px-4 py-2 rounded-md bg-indigo-500 text-white hover:bg-indigo-600"
                                    >
                                        Export PDF
                                    </button>

                                    <button
                                        onClick={handleSubmitBatch}
                                        className="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600"
                                    >
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </DashboardLayout>
        </div>
    );
}
