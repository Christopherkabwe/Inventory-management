"use client";

import DashboardLayout from "@/components/DashboardLayout";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Loading from "@/components/Loading";
import ProductionCharts from "@/components/charts/ProductionCharts";
import InventorySummary from "@/components/InventorySummary";


interface ProductSummary {
    productId: string;
    name: string;
    sku: string;
    category: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    price: number;
    totalQty: number;
    tonnage: number;
    totalValue: number;
}

interface LocationSummary {
    locationId: string;
    location: string;
    productions: number;
    totalQty: number;
    totalTonnage: number;
}

interface BatchRow {
    productionNo: string;
    batchNumber: string;
    product: string;
    sku: string;
    category: string;
    quantity: number;
    location: string;
    date: string;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    price: number;
    totalValue: number;
    tonnage: number;
}

export default function ProductionReportsPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [locationId, setLocationId] = useState("");
    const [batch, setBatch] = useState("");

    const [byProduct, setByProduct] = useState<ProductSummary[]>([]);
    const [byLocation, setByLocation] = useState<LocationSummary[]>([]);
    const [batchRows, setBatchRows] = useState<BatchRow[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchReports = async () => {
        setLoading(true);
        try {
            const productParams = new URLSearchParams();
            if (from) productParams.append("from", from);
            if (to) productParams.append("to", to);
            if (locationId) productParams.append("locationId", locationId);

            const locationParams = new URLSearchParams();
            if (from) locationParams.append("from", from);
            if (to) locationParams.append("to", to);

            const batchParams = new URLSearchParams();
            if (batch) batchParams.append("batch", batch);
            if (from) batchParams.append("from", from);
            if (to) batchParams.append("to", to);

            const [p, l, b] = await Promise.all([
                fetch(`/api/rbac/reports/production/by-product?${productParams}`).then(r => r.json()),
                fetch(`/api/rbac/reports/production/by-location?${locationParams}`).then(r => r.json()),
                fetch(`/api/rbac/reports/production/by-batch?${batchParams}`).then(r => r.json()),
            ]);

            setByProduct(p.data || []);
            setByLocation(l.data || []);
            setBatchRows(b.data || []);
        } catch (error) {
            console.error("Error fetching reports:", error);
        } finally {
            setLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchReports().finally(() => setLoading(false));
    }, []);

    // ----- CSV Export -----
    const exportCSV = (filename: string, data: any[], headers: string[]) => {
        const rows = data.map(row =>
            headers.map(h => {
                const value = row[h as keyof typeof row];
                // Format numbers with 2 decimal places
                if (typeof value === "number") return value.toFixed(2);
                return value;
            })
        );

        const csvContent =
            "data:text/csv;charset=utf-8," +
            [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", filename);
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    // ----- PDF Export -----
    const exportPDF = (title: string, headers: string[], data: any[]) => {
        const doc = new jsPDF('landscape');
        doc.setFontSize(14);
        doc.text(title, 14, 15);

        autoTable(doc, {
            head: [headers],
            body: data.map(row =>
                headers.map(h => {
                    const value = row[h as keyof typeof row];
                    // Format numbers with 2 decimal places
                    if (typeof value === "number") return value.toFixed(2);
                    return value;
                })
            ),
            startY: 20,
            styles: { fontSize: 12, cellWidth: 'auto', overflow: 'linebreak' },
            headStyles: { fillColor: [100, 150, 250], textColor: 255, fontStyle: 'bold' },
            // fillColor: [37, 99, 235] blue-600
            // fillColor: [220, 220, 220] gray
            theme: 'grid',
        });

        doc.save(`${title}.pdf`);
    };

    return (
        <DashboardLayout>
            <div className="p-6 space-y-6">
                <h1 className="text-2xl font-bold">Production Reports</h1>

                {/* --- Charts --- */}
                {loading ? (
                    <div className=" border border-gray-300 rounded-lg overflow-hidden">
                        <Loading message="Loading Charts..." colSpan={20}
                            className="w-full flex justify-center items-center bg-white"
                        />
                    </div>
                ) : (
                    <>
                        <ProductionCharts
                            byProduct={byProduct}
                            byLocation={byLocation}
                        />
                    </>
                )}
                <InventorySummary
                    title="Inventory Levels"
                    iconColor="text-blue-600"
                />

                {/* --- Product Summary --- */}
                <div className="bg-white p-4 rounded border space-y-2">
                    <h2 className="font-semibold mb-2">Production Summary by Product</h2>
                    <div className="flex gap-2 mb-2 justify-end">
                        <button
                            className="px-4 py-1 border rounded-md text-white bg-green-600 hover:bg-green-700 whitespace-nowrap"
                            onClick={() =>
                                exportCSV(
                                    "product_summary.csv",
                                    byProduct,
                                    ["name", "sku", "category", "packSize", "weightValue", "weightUnit", "totalQty", "tonnage", "totalValue"]
                                )
                            }
                        >
                            Export CSV
                        </button>
                        <button
                            className="px-4 py-1 border rounded-md text-white bg-blue-600 hover:bg-blue-700 whitespace-nowrap"
                            onClick={() =>
                                exportPDF(
                                    "Product Summary",
                                    ["name", "sku", "category", "packSize", "weightValue", "weightUnit", "totalQty", "tonnage", "totalValue"],
                                    byProduct
                                )
                            }
                        >
                            Export PDF
                        </button>
                    </div>
                    {/* Table */}
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="border p-2 border-black border-t-2">Product Name</th>
                                <th className="border p-2 border-black border-t-2">SKU</th>
                                <th className="border p-2 border-black border-t-2">Category</th>
                                <th className="border p-2 border-black border-t-2">Pack Size</th>
                                <th className="border p-2 border-black border-t-2">Weight Value</th>
                                <th className="border p-2 border-black border-t-2">Weight Unit</th>
                                <th className="border p-2 border-black border-t-2">Total Qty</th>
                                <th className="border p-2 border-black border-t-2">Total Tonnage</th>
                                <th className="border p-2 border-black border-t-2">Total Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        <Loading message="Loading Product Data" />
                                    </td>
                                </tr>
                            ) : byProduct.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {byProduct.map(p => (
                                        <tr key={p.productId}>
                                            <td className="border p-2 border-black">{p.name}</td>
                                            <td className="border p-2 border-black">{p.sku}</td>
                                            <td className="border p-2 border-black">{p.category}</td>
                                            <td className="border p-2 border-black">{p.packSize}</td>
                                            <td className="border p-2 border-black">{p.weightValue.toFixed(2)}</td>
                                            <td className="border p-2 border-black">{p.weightUnit}</td>
                                            <td className="border p-2 border-black">{p.totalQty}</td>
                                            <td className="border p-2 border-black">{p.tonnage.toFixed(2)}</td>
                                            <td className="border p-2 border-black">{`K${p.totalValue.toFixed(2)}`}</td>
                                        </tr>
                                    ))}

                                    {/* Total Row */}
                                    <tr className="bg-gray-200 font-semibold">
                                        <td className="border border-black border-t-2 p-2 text-center" colSpan={3}>Total</td>
                                        <td className="border border-black border-t-2 p-2 text-center">-</td>
                                        <td className="border border-black border-t-2 p-2 text-center">-</td>
                                        <td className="border border-black border-t-2 p-2 text-center">-</td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byProduct.reduce((sum, p) => sum + p.totalQty, 0)}
                                        </td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byProduct.reduce((sum, p) => sum + p.tonnage, 0).toFixed(2)}
                                        </td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byProduct.reduce((sum, p) => sum + p.totalValue, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Location Summary --- */}
                <div className="bg-white p-4 rounded border space-y-2">
                    <h2 className="font-semibold mb-2">Production Summary by Location</h2>
                    <div className="flex gap-2 mb-2 justify-end">
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded"
                            onClick={() =>
                                exportCSV(
                                    "location_summary.csv",
                                    byLocation,
                                    ["location", "productions", "totalQty", "totalTonnage"]
                                )
                            }
                        >
                            Export CSV
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-1 rounded"
                            onClick={() =>
                                exportPDF(
                                    "Location Summary",
                                    ["location", "productions", "totalQty", "totalTonnage"],
                                    byLocation
                                )
                            }
                        >
                            Export PDF
                        </button>
                    </div>
                    {/* Table */}
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-100 text-left">
                            <tr>
                                <th className="border border-black border-t-2 px-5 py-2">Location</th>
                                <th className="border border-black border-t-2 px-5 py-2">Productions</th>
                                <th className="border border-black border-t-2 px-5 py-2">Total Qty</th>
                                <th className="border border-black border-t-2 px-5 py-2">Total Tonnage</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={20} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        <Loading message="Loading Production Data" />
                                    </td>
                                </tr>
                            ) : byLocation.length === 0 ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-2 text-sm text-gray-800 text-center">
                                        No productions found.
                                    </td>
                                </tr>
                            ) : (
                                <>
                                    {byLocation.map(l => (
                                        <tr key={l.locationId}>
                                            <td className="border border-black px-5 py-2">{l.location}</td>
                                            <td className="border border-black px-5 py-2">{l.productions}</td>
                                            <td className="border border-black px-5 py-2">{l.totalQty}</td>
                                            <td className="border border-black px-5 py-2">{l.totalTonnage.toFixed(2)}</td>
                                        </tr>
                                    ))}

                                    {/* Total Row */}
                                    <tr className="bg-gray-200 font-semibold">
                                        <td className="border border-black border-t-2 p-2 text-center">Total</td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byLocation.reduce((sum, l) => sum + l.productions, 0)}
                                        </td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byLocation.reduce((sum, l) => sum + l.totalQty, 0).toFixed(2)}
                                        </td>
                                        <td className="border border-black border-t-2 px-5 py-2">
                                            {byLocation.reduce((sum, l) => sum + l.totalTonnage, 0).toFixed(2)}
                                        </td>
                                    </tr>
                                </>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* --- Batch Tracking --- */}
                <div className="bg-white p-4 rounded border space-y-2">
                    <h2 className="font-semibold mb-2">Batch Tracking Report</h2>
                    <div className="flex gap-2 mb-2 justify-end">
                        <button
                            className="bg-green-600 text-white px-4 py-1 rounded"
                            onClick={() =>
                                exportCSV(
                                    "batch_tracking.csv",
                                    batchRows,
                                    [
                                        "batchNumber", "productionNo", "product", "sku", "category",
                                        "quantity", "location", "date", "packSize", "weightValue",
                                        "weightUnit", "price", "totalValue", "tonnage"
                                    ]
                                )
                            }
                        >
                            Export CSV
                        </button>
                        <button
                            className="bg-blue-600 text-white px-4 py-1 rounded"
                            onClick={() =>
                                exportPDF(
                                    "Batch Tracking",
                                    [
                                        "batchNumber", "productionNo", "product", "sku", "category",
                                        "quantity", "location", "date", "packSize", "weightValue",
                                        "weightUnit", "price", "totalValue", "tonnage"
                                    ],
                                    batchRows
                                )
                            }
                        >
                            Export PDF
                        </button>
                    </div>
                    <div className="max-h-[500px] overflow-auto">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100 text-left sticky top-0">
                                <tr className="">
                                    <th className="border border-black border-t-2 p-2">Batch No.</th>
                                    <th className="border border-black border-t-2 p-2">Production No</th>
                                    <th className="border border-black border-t-2 p-2">Product Name</th>
                                    <th className="border border-black border-t-2 p-2">SKU</th>
                                    <th className="border border-black border-t-2 p-2">Pack Size</th>
                                    <th className="border border-black border-t-2 p-2">Weight Value</th>
                                    <th className="border border-black border-t-2 p-2">Weight Unit</th>
                                    <th className="border border-black border-t-2 p-2">Quantity</th>
                                    <th className="border border-black border-t-2 p-2">Tonnage</th>
                                    <th className="border border-black border-t-2 p-2">Cost Per Bag</th>
                                    <th className="border border-black border-t-2 p-2">Total Cost</th>
                                    <th className="border border-black border-t-2 p-2">Selling Price</th>
                                    <th className="border border-black border-t-2 p-2">Total Value</th>
                                    <th className="border border-black border-t-2 p-2">Profit Margin</th>
                                    <th className="border border-black border-t-2 p-2">Location</th>
                                    <th className="border border-black border-t-2 p-2">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={20} className="px-4 py-2 text-sm text-gray-800 text-center">
                                            <Loading
                                                message="Loading Production Data"
                                            />
                                        </td>
                                    </tr>
                                ) : batchRows.length === 0 ? (
                                    <tr>
                                        <td colSpan={20} className="px-4 py-2 text-sm text-gray-800 text-center">
                                            No productions found.
                                        </td>
                                    </tr>
                                ) : (
                                    <>
                                        {batchRows.map((b, i) => (
                                            <tr key={i} className="whitespace-nowrap">
                                                <td className="border border-black p-2">{b.batchNumber}</td>
                                                <td className="border border-black p-2">{b.productionNo}</td>
                                                <td className="border border-black p-2">{b.product}</td>
                                                <td className="border border-black p-2">{b.sku}</td>
                                                <td className="border border-black p-2">{b.packSize}</td>
                                                <td className="border border-black p-2">{(b.weightValue).toFixed(2)}</td>
                                                <td className="border border-black p-2">{b.weightUnit}</td>
                                                <td className="border border-black p-2">{b.quantity}</td>
                                                <td className="border border-black p-2">{(b.tonnage).toFixed(2)}</td>
                                                <td className="border p-2 border-black">{`K${b.price.toFixed(2)}`}</td>
                                                <td className="border p-2 border-black">{`K${b.totalValue.toFixed(2)}`}</td>
                                                <td className="border p-2 border-black">{`K${b.price.toFixed(2)}`}</td>
                                                <td className="border p-2 border-black">{`K${b.totalValue.toFixed(2)}`}</td>
                                                <td className="border p-2 border-black">{`K${b.totalValue.toFixed(2)}`}</td>
                                                <td className="border border-black p-2">{b.location}</td>
                                                <td className="border border-black p-2">{new Date(b.date).toLocaleDateString()}</td>
                                            </tr>
                                        ))}

                                        {/* Total Row */}
                                        <tr className="bg-gray-200 font-semibold">
                                            <td className="border border-black p-2 text-center" colSpan={7}>Total</td>
                                            <td className="border border-black p-2 ">
                                                {batchRows.reduce((sum, b) => sum + b.quantity, 0)}
                                            </td>
                                            <td className="border border-black p-2">
                                                {batchRows.reduce((sum, b) => sum + b.tonnage, 0).toFixed(2)}
                                            </td>
                                            <td className="border border-black p-2 text-center">-</td>
                                            <td className="border border-black p-2">
                                                {batchRows.reduce((sum, b) => sum + b.totalValue, 0).toFixed(2)}
                                            </td>
                                            <td className="border border-black p-2 text-center">-</td>
                                            <td className="border border-black p-2">
                                                {batchRows.reduce((sum, b) => sum + b.totalValue, 0).toFixed(2)}
                                            </td>
                                            <td className="border border-black p-2">
                                                {batchRows.reduce((sum, b) => sum + b.totalValue, 0).toFixed(2)}
                                            </td>
                                            <td className="border border-black p-2 text-center">-</td>
                                            <td className="border border-black p-2 text-center">-</td>
                                        </tr>
                                    </>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </DashboardLayout>
    );
}
