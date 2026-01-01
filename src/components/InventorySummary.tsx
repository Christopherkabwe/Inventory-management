"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { Package, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";
import Link from 'next/link';

type SortKey =
    | "name"
    | "quantity"
    | "value"
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
        sku: string;
        price: number;
        packSize: number;
        weightValue: number;
        weightUnit: string;
        category?: { name: string } | null;
    };
    location: { name: string };
}

interface Sale {
    id: string;
    createdBy: string;
    saleDate: Date;
    items: {
        product: {
            id: string;
            price: number;
        };
        quantity: number;
    }[];
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

    const [showProducts, setShowProducts] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const productRef = useRef<HTMLDivElement>(null);

    const [showFilters, setShowFilters] = useState(true);


    /* ---------------- FILTER OPTIONS ---------------- */
    const locations = useMemo(
        () => Array.from(new Set(inventory.map((i) => i.location.name))),
        [inventory]
    );

    const categories = useMemo(
        () =>
            Array.from(
                new Set(
                    inventory.map((i) => i.product.category?.name || "Uncategorized")
                )
            ),
        [inventory]
    );
    const products = useMemo(
        () =>
            Array.from(
                new Set(
                    inventory.map((i) => i.product.name)
                )
            ),
        [inventory]
    );

    // Close product dropdown

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (productRef.current && !productRef.current.contains(e.target as Node)) {
                setShowProducts(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);


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
            if (
                selectedProducts.length > 0 &&
                !selectedProducts.includes(i.product.name)
            )
                return false;
            return true;
        });
    }, [inventory, startDate, endDate, selectedLocation, selectedCategory, selectedProducts]);

    /* ---------------- SALES MAP ---------------- */
    const salesMap = useMemo(() => {
        const map: Record<string, number> = {};
        sales.forEach((sale) => {
            sale.items.forEach((item) => {
                map[item.product.id] = (map[item.product.id] || 0) + item.quantity;
            });
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
                    sku: p.sku,
                    packSize: p.packSize,
                    weightValue: p.weightValue,
                    weightUnit: p.weightUnit,
                    quantity: 0,
                    price: p.price,
                    value: 0,
                    tonnage: 0,
                    lowStockAt: item.lowStockAt,
                    soldQuantity: 0, // <- new
                };
            }

            map[p.id].quantity += item.quantity;
            map[p.id].value += item.quantity * p.price;
            map[p.id].tonnage += (item.quantity * p.packSize * unitToKg(item.product.weightValue, item.product.weightUnit)) / 1000;
            map[p.id].soldQuantity += salesMap[p.id] || 0; // <- populate from sales
        });

        return Object.values(map);
    }, [filteredInventory, salesMap]);

    /* ---------------- SORT ---------------- */
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            // String sorting
            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc"
                    ? aVal.localeCompare(bVal)
                    : bVal.localeCompare(aVal);
            }

            // Numeric sorting
            return sortDir === "asc"
                ? Number(aVal) - Number(bVal)
                : Number(bVal) - Number(aVal);
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
            "Product ID",
            "SKU",
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
                p.id,
                p.sku,
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
                    "Product ID",
                    "SKU",
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
                    p.id,
                    p.sku,
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
        <div className="bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold flex items-center gap-2">
                <Package className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>
            <div className="flex justify-end items-center mb-2 mt-2">

                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>
            {/* FILTER BAR */}
            {showFilters && (
                <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between">
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 p-2">
                        <div className="grid gap-2 w-full grid-cols-[auto_1fr_1fr_1fr]  sm:flex sm:w-auto">
                            <div>
                                <label className="flex flex-wrap items-center gap-2">
                                    <select value={selectedLocation} onChange={(e) => setSelectedLocation(e.target.value)} className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                                        <option value="all">Select location</option>
                                        {locations.map((loc) => (
                                            <option key={loc} value={loc}>
                                                {loc}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <label className="flex flex-wrap items-center gap-2">
                                    <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)} className="border rounded px-2 py-1 text-sm hover:bg-gray-100 cursor-pointer">
                                        <option value="all">Select Category</option>
                                        {categories.map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                </label>
                            </div>
                            <div>
                                <div ref={productRef} className="relative inline-block whitespace-nowrap">
                                    <button onClick={() => setShowProducts((v) => !v)} className="px-3 h-8 border rounded bg-white hover:bg-gray-100 text-sm">
                                        {selectedProducts.length === 0 ? "Select Products" : `${selectedProducts.length} selected`}
                                    </button>
                                    {showProducts && (
                                        <div className="absolute left-0 mt-2 bg-white border rounded shadow-lg z-50 w-64 max-h-56 overflow-y-auto p-2">
                                            <button onClick={() => setSelectedProducts([])} className="text-xs text-blue-600 hover:underline mb-2 block">
                                                Clear Selection
                                            </button>
                                            {products.map((p) => (
                                                <label key={p} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-gray-100 cursor-pointer text-sm">
                                                    <input type="checkbox" checked={selectedProducts.includes(p)} onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setSelectedProducts([...selectedProducts, p]);
                                                        } else {
                                                            setSelectedProducts(selectedProducts.filter((x) => x !== p));
                                                        }
                                                    }} className="w-4 h-4" />
                                                    {p}
                                                </label>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button onClick={exportCSV} className="text-sm h-8 px-2 py-1 rounded border hover:bg-gray-100">
                                Export CSV
                            </button>
                            <button onClick={exportPDF} className="text-sm h-8 px-2 py-1 rounded border hover:bg-gray-100">
                                Export PDF
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {/* TABLE */}
            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="hidden xl:table-cell py-2 px-3 border-r">#</th>
                            <th className="py-2 px-3 border-r text-left">Product Name</th>
                            <th className="hidden xl:table-cell py-2 px-3 border-r text-center">SKU</th>
                            <th className="hidden xl:table-cell py-2 px-3 border-r text-center">Pack Size</th>
                            <th className="hidden xl:table-cell py-2 px-3 border-r text-center">Weight Value</th>
                            <th className="hidden xl:table-cell py-2 px-3 border-r text-center">Weight Unit</th>
                            <Header label="Quantity" column="quantity" />
                            <Header label="Tonnage" column="tonnage" />
                            <Header label="Price" column="price" />
                            <Header label="Value" column="value" />
                            <Header label="Low Stock At" column="lowStockAt" />
                            <th className="py-2 px-3 text-center">Status</th>
                            <th className="py-2 px-3 text-center">Actions</th>
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
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">{i + 1}</td>
                                            <td className="py-2 px-3 border-r max-w-[180px] truncate">{p.name}</td>
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">{p.sku || "-"}</td>
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">{p.packSize}</td>
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">{p.weightValue}</td>
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">{p.weightUnit || '-'}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.quantity}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.tonnage.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.price.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.value.toFixed(2)}</td>
                                            <td className="py-2 px-3 border-r text-center">{p.lowStockAt}</td>
                                            <td className={`py-2 px-3 border-r text-center ${statusColor}`}>{status}</td>
                                            <td className="py-2 px-2 border-r">
                                                <Link
                                                    href={`/inventory/inventory?productId=${p.id}#inventory-table`}
                                                    className="text-blue-600 hover:underline text-sm"
                                                >
                                                    View Inventory
                                                </Link>
                                            </td>
                                        </tr>
                                    );
                                })}

                                {/* Total Row */}
                                <tr className="hidden xl:table-row bg-gray-200 font-semibold">
                                    <td className="py-2 px-3 border-r text-center" colSpan={6}>
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
                                    <td className="py-2 px-3 border-r text-center">-</td>
                                </tr>
                            </>
                        ) : (
                            <tr>
                                <td colSpan={12} className="py-2 px-3 text-center text-gray-500">
                                    No data available for the selected location and category
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
}
