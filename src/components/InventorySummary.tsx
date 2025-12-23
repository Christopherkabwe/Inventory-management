"use client";

import { useMemo, useState } from "react";
import { Package, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";

type SortKey =
    | "name"
    | "quantity"
    | "stockValue"
    | "tonnage"
    | "price"
    | "lowStockAt";

interface InventoryItem {
    id: string;
    quantity: number;
    lowStockAt: number;
    expiryDate?: Date | null;
    updatedAt: Date;
    product: {
        id: string;
        name: string;
        price: number;
        packSize: number;
        weightValue: number;
        weightUnit: string;
        category?: { name: string } | null;
    };
    location: { name: string };
}

interface Sale {
    productId: string;
    quantity: number;
    saleDate: Date;
}

interface Props {
    inventory: InventoryItem[];
    sales: Sale[];
    title: string;
    iconColor: string;
}

export default function InventorySummary({
    inventory,
    sales = [],
    title,
    iconColor,
}: Props) {
    const [sortKey, setSortKey] = useState<SortKey>("quantity");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);
    const [selectedLocation, setSelectedLocation] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");

    /* ---------------- FILTER OPTIONS ---------------- */
    const locations = useMemo(
        () => Array.from(new Set(inventory.map((i) => i.location.name))),
        [inventory]
    );

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    inventory.map((i) => i.product.category)
                )
            ),
        [inventory]
    );

    /* ---------------- FILTER INVENTORY ---------------- */
    const filteredInventory = useMemo(() => {
        return inventory.filter((i) => {
            if (startDate && i.updatedAt < startDate) return false;
            if (endDate && i.updatedAt > endDate) return false;
            if (selectedLocation !== "all" && i.location.name !== selectedLocation)
                return false;
            if (
                selectedCategory !== "all" &&
                (i.product.category ?? "Uncategorized") !== selectedCategory
            )
                return false;
            return true;
        });
    }, [inventory, startDate, endDate, selectedLocation, selectedCategory]);

    /* ---------------- SALES MAP ---------------- */
    const salesMap = useMemo(() => {
        const map: Record<string, number> = {};
        sales.forEach((s) => {
            map[s.productId] = (map[s.productId] || 0) + s.quantity;
        });
        return map;
    }, [sales]);

    /* ---------------- AGGREGATE ---------------- */
    const data = useMemo(() => {
        const map: Record<string, any> = {};

        filteredInventory.forEach((item) => {
            const p = item.product;
            if (!map[p.id]) {
                map[p.id] = {
                    id: p.id,
                    name: p.name,
                    packSize: p.packSize,
                    weightValue: p.weightValue,
                    weightUnit: p.weightUnit,
                    quantity: 0,
                    price: p.price,
                    value: 0,
                    tonnage: 0,
                    lowStockAt: item.lowStockAt,
                };
            }

            map[p.id].quantity += item.quantity;
            map[p.id].value += item.quantity * p.price;
            map[p.id].tonnage += (item.quantity * p.packSize * unitToKg(item.product.weightValue, item.product.weightUnit)) / 1000;
        });

        return Object.values(map);
    }, [filteredInventory]);

    /* ---------------- SORT ---------------- */
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            return sortDir === "asc" ? aVal - bVal : bVal - aVal;
        });
    }, [data, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    /* ---------------- HEADER CELL ---------------- */
    const Header = ({ label, column }: { label: string; column: SortKey }) => (
        <th
            onClick={() => toggleSort(column)}
            className="py-2 px-3 cursor-pointer border-r hover:text-blue-600"
        >
            <span className="inline-flex items-center gap-1">
                {label}
                <ArrowUpDown className="w-3 h-3 opacity-60" />
            </span>
        </th>
    );

    /* ---------------- EXPORT CSV ---------------- */
    const exportCSV = () => {
        const headers = [
            "Product",
            "Pack Size",
            "Weight Value",
            "Weight Unit",
            "Quantity",
            "Tonnage",
            "Price",
            "Value",
            "Low Stock At",
            "Status",
        ];

        const rows = sortedData.map((p) => {
            const status =
                p.quantity === 0
                    ? "Out of Stock"
                    : p.quantity < p.lowStockAt
                        ? "Low Stock"
                        : "Available";

            return [
                p.name,
                p.packSize,
                p.weightValue,
                p.weightUnit,
                p.quantity,
                p.tonnage.toFixed(2),
                p.price.toFixed(2),
                p.value.toFixed(2),
                p.lowStockAt,
                status,
            ];
        });


        const csv = [headers, ...rows].map((r) => r.join(",")).join("\n");
        const blob = new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);

        const a = document.createElement("a");
        a.href = url;
        a.download = "inventory_summary.csv";
        a.click();
        URL.revokeObjectURL(url);
    };

    /* ---------------- EXPORT PDF ---------------- */
    const exportPDF = () => {
        const doc = new jsPDF();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";

        doc.setFontSize(16);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });

        doc.setFontSize(10);
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, {
            align: "center",
        });

        autoTable(doc, {
            startY: 30,
            head: [
                [
                    "#",
                    "Product",
                    "Pack Size",
                    "Weight Value",
                    "Weight Unit",
                    "Quantity",
                    "Tonnage",
                    "Price",
                    "Value",
                    "Low Stock At",
                    "Status",
                ],
            ],
            body: sortedData.map((p, i) => {
                const status =
                    p.quantity === 0
                        ? "Out of Stock"
                        : p.quantity < p.lowStockAt
                            ? "Low Stock"
                            : "Available";

                return [
                    i + 1,
                    p.name,
                    p.packSize,
                    p.weightValue,
                    p.weightUnit,
                    p.quantity,
                    p.tonnage.toFixed(2),
                    p.price.toFixed(2),
                    p.value.toFixed(2),
                    p.lowStockAt,
                    status,
                ];
            }),
            styles: { fontSize: 9, cellPadding: 4 },
            headStyles: { fillColor: [100, 100, 100], textColor: 255 },
            alternateRowStyles: { fillColor: [245, 245, 245] },
        });

        doc.save("inventory_summary.pdf");
    };

    /* ---------------- RENDER ---------------- */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Package className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            {/* FILTER BAR */}
            <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                <div className="flex gap-5 rounded border px-2 py-1 flex-wrap">
                    <label className="flex items-center gap-2 font-medium">
                        Select Location:
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            <option value="all">All</option>
                            {locations.map((loc) => (
                                <option key={loc} value={loc}>
                                    {loc}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label className="flex items-center gap-2 font-medium">
                        Select Category:
                        <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer"
                        >
                            <option value="all">All</option>
                            {categories.map((cat) => (
                                <option key={cat} value={cat}>
                                    {cat}
                                </option>
                            ))}
                        </select>
                    </label>
                </div>

                <div className="flex gap-2 rounded border px-2 py-1 flex-wrap">
                    <button
                        onClick={exportCSV}
                        className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-100"
                    >
                        Export CSV
                    </button>
                    <button
                        onClick={exportPDF}
                        className="text-sm px-3 py-1 rounded border font-medium hover:bg-gray-100"
                    >
                        Export PDF
                    </button>
                </div>
            </div>

            {/* TABLE */}
            <div className="max-h-[420px] overflow-y-auto mb-6">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r">#</th>
                            <th className="py-2 px-3 border-r text-left">Product Name</th>
                            <th className="py-2 px-3 border-r text-center">Pack Size</th>
                            <th className="py-2 px-3 border-r text-center">Weight Value</th>
                            <th className="py-2 px-3 border-r text-center">Weight Unit</th>
                            <Header label="Quantity" column="quantity" />
                            <Header label="Tonnage" column="tonnage" />
                            <Header label="Price" column="price" />
                            <Header label="Value" column="stockValue" />
                            <Header label="Low Stock At" column="lowStockAt" />
                            <th className="py-2 px-3 text-center">Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.length > 0 ? (
                            <>
                                {sortedData.map((p, i) => {
                                    const status =
                                        p.quantity === 0
                                            ? "Out of Stock"
                                            : p.quantity < p.lowStockAt
                                                ? "Low Stock"
                                                : "Available";

                                    const statusColor =
                                        status === "Out of Stock"
                                            ? "text-red-600 font-bold"
                                            : status === "Low Stock"
                                                ? "text-yellow-600 font-bold"
                                                : "text-green-600 font-bold";

                                    return (
                                        <tr
                                            key={p.id}
                                            className={`${i % 2 ? "bg-gray-50" : ""} ${p.quantity === 0
                                                ? "bg-red-50"
                                                : p.quantity < p.lowStockAt
                                                    ? "bg-yellow-50"
                                                    : ""
                                                }`}
                                        >
                                            <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                            <td className="py-2 px-3 border-r">{p.name}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.packSize}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.weightValue}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.weightUnit || '-'}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.quantity}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.tonnage.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.price.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.value.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.lowStockAt}</td>
                                            <td className={`py-2 px-3 text-center ${statusColor}`}>{status}</td>
                                        </tr>
                                    );
                                })}

                                {/* Total Row */}
                                <tr className="bg-gray-200 font-semibold">
                                    <td className="py-2 px-3 border-r text-center" colSpan={5}>
                                        Total
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData.reduce((acc, p) => acc + p.quantity, 0)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData.reduce((acc, p) => acc + p.tonnage, 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">-</td>
                                    <td className="py-2 px-3 border-r text-center">
                                        {sortedData.reduce((acc, p) => acc + p.value, 0).toFixed(2)}
                                    </td>
                                    <td className="py-2 px-3 border-r text-center">-</td>
                                    <td className="py-2 px-3 border-r text-center">-</td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={11} className="py-2 px-3 text-center text-gray-500">
                                    No data available for the selected location and category
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
