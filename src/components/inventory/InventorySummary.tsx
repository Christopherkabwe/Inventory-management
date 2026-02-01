"use client";

import { useMemo, useState, useEffect } from "react";
import { Package, ArrowUpDown } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { unitToKg } from "@/lib/UnitToKg";
import Link from "next/link";
import { fetchInventory } from "@/lib/fetchInventory";
import { fetchSales } from "@/lib/fetchSales";
import FiltersExports from "@/components/Exports/FilterExports";
import Loading from "@/components/Loading";
import { useUser } from "@/app/context/UserContext";


type SortKey = "name" | "quantity" | "value" | "tonnage" | "price" | "lowStockAt";

interface InventoryItem {
    id: string;
    quantity: number;
    lowStockAt: number;
    updatedAt: Date;
    assignedUser: {
        id: string,
        fullName: string,
        managerId: string,
    };
    product: {
        id: string;
        name: string;
        sku: string;
        price: number;
        packSize: number;
        weightValue: number;
        weightUnit: string;
        category?: string | null;
    };
    location: { name: string };
}

interface Sale {
    id: string;
    createdBy: string;
    saleDate: Date;
    items: { product: { id: string; price: number }; quantity: number }[];
}

interface CurrentUser {
    id: string;
    role: "ADMIN" | "MANAGER" | "USER";
}

interface Props {
    title: string;
    iconColor: string;
}

export default function InventorySummary({ title, iconColor }: Props) {
    /* ---------------- STATE ---------------- */
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [sortKey, setSortKey] = useState<SortKey>("quantity");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    /* ---------------- FILTER STATE ---------------- */
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]); // optional if needed

    const [showFilters, setShowFilters] = useState(true);

    const user = useUser();

    const currentUser = user;

    /* ---------------- FETCH INVENTORY & SALES ---------------- */
    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);

                const [inventoryData, salesData] = await Promise.all([
                    fetchInventory(),
                    fetchSales(),
                ]);

                setInventory(inventoryData);
                setSales(salesData);
                setError(null);
            } catch (err: any) {
                console.error(err);
                setError(err.message || "Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []);


    /* ---------------- FILTER OPTIONS ---------------- */
    const locationOptions = useMemo(() => {
        const uniqueNames = Array.from(new Set(inventory.map((i) => i.location.name)));
        return uniqueNames.map((name) => ({ id: name, name }));
    }, [inventory]);

    const categoryOptions = useMemo(
        () =>
            Array.from(new Set(inventory.map((i) => i.product.category ?? "Uncategorized"))),
        [inventory]
    );

    const productOptions = useMemo(() => {
        const map = new Map<string, { id: string; name: string; }>();
        inventory.forEach((i) => {
            if (!map.has(i.product.name)) {
                map.set(i.product.name, {
                    id: i.product.name,
                    name: i.product.name,
                });
            }
        });
        return Array.from(map.values());
    }, [inventory]);

    const users = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();

        inventory.forEach((item) => {
            const user = item.assignedUser;
            if (!user) return;

            // ADMIN: see all users
            if (currentUser?.role === "ADMIN") {
                map.set(user.id, { id: user.id, name: user.fullName ?? "Unknown User" });
                return;
            }

            // MANAGER: only users they manage
            if (currentUser?.role === "MANAGER" && user.managerId === currentUser.id) {
                map.set(user.id, { id: user.id, name: user.fullName ?? "Unknown User" });
                return;
            }

            // USER: only themselves
            if (currentUser?.role === "USER" && user.id === currentUser.id) {
                map.set(user.id, { id: user.id, name: user.fullName ?? "Unknown User" });
                return;
            }
        });

        // Optional: allow filtering unassigned inventory only if ADMIN or MANAGER
        if (currentUser?.role !== "USER") {
            map.set("UNASSIGNED", { id: "UNASSIGNED", name: "Unassigned" });
        }

        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [inventory, currentUser]);


    const userOptions = (users); // Add users if you have user data

    /* ---------------- FILTER INVENTORY ---------------- */
    const filteredInventory = useMemo(() => {
        return inventory.filter((i) => {
            // Date filters
            if (startDate && new Date(i.updatedAt) < startDate) return false;
            if (endDate && new Date(i.updatedAt) > endDate) return false;

            // Location filter
            if (selectedLocations.length && !selectedLocations.includes(i.location.name)) return false;

            // Category filter
            const category = i.product.category ?? "Uncategorized";
            if (selectedCategories.length && !selectedCategories.includes(category)) return false;

            // Product filter
            if (selectedProducts.length && !selectedProducts.includes(i.product.name)) return false;

            // User filter
            if (selectedUsers.length) {
                const isUnassigned = !i.assignedUser;
                const userId = i.assignedUser?.id;

                if (!((isUnassigned && selectedUsers.includes("UNASSIGNED"))
                    || (userId && selectedUsers.includes(userId)))) {
                    return false;
                }
            }

            return true;
        });
    }, [inventory, startDate, endDate, selectedLocations, selectedCategories, selectedProducts, selectedUsers]);
    /* ---------------- SALES MAP ---------------- */
    const salesMap = useMemo(() => {
        const map: Record<string, number> = {};
        sales.forEach((sale) =>
            sale.items.forEach((item) => {
                map[item.product.id] = (map[item.product.id] || 0) + item.quantity;
            })
        );
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
                    soldQuantity: 0,
                };
            }

            map[p.id].quantity += item.quantity;
            map[p.id].value += item.quantity * p.price;
            map[p.id].tonnage +=
                (item.quantity * p.packSize * unitToKg(item.product.weightValue, item.product.weightUnit)) / 1000;
            map[p.id].soldQuantity += salesMap[p.id] || 0;
        });

        return Object.values(map);
    }, [filteredInventory, salesMap]);

    /* ---------------- SORT ---------------- */
    const sortedData = useMemo(() => {
        return [...data].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];

            if (typeof aVal === "string" && typeof bVal === "string") {
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortDir === "asc" ? Number(aVal) - Number(bVal) : Number(bVal) - Number(aVal);
        });
    }, [data, sortKey, sortDir]);

    const toggleSort = (key: SortKey) => {
        if (key === sortKey) setSortDir(sortDir === "asc" ? "desc" : "asc");
        else {
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

    /* ---------------- EXPORT ---------------- */
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
                p.quantity === 0 ? "Out of Stock" : p.quantity < p.lowStockAt ? "Low Stock" : "Available";
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

    const exportPDF = () => {
        const doc = new jsPDF();
        const start = startDate ? startDate.toLocaleDateString() : "N/A";
        const end = endDate ? endDate.toLocaleDateString() : "N/A";

        doc.setFontSize(16);
        doc.text(title, doc.internal.pageSize.getWidth() / 2, 15, { align: "center" });
        doc.setFontSize(10);
        doc.text(`Date Range: ${start} - ${end}`, doc.internal.pageSize.getWidth() / 2, 23, { align: "center" });

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
                    p.quantity === 0 ? "Out of Stock" : p.quantity < p.lowStockAt ? "Low Stock" : "Available";
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
        <div className="bg-white p-5 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold flex items-center gap-2">
                <Package className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>

            <div className="flex justify-start items-center mb-2 mt-2">
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="text-sm px-2 py-1 border rounded hover:bg-gray-100"
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            {showFilters && (
                <FiltersExports
                    selectedLocations={selectedLocations}
                    setSelectedLocations={setSelectedLocations}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    locationOptions={locationOptions}
                    categoryOptions={categoryOptions}
                    productOptions={productOptions}
                    userOptions={userOptions}
                    exportCSV={exportCSV}
                    exportPDF={exportPDF}
                />
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
                        {loading ? (
                            <Loading message="Loading Inventory" colSpan={13} />
                        ) : sortedData.length ? (
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
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">
                                                {p.weightValue.toFixed(2)}
                                            </td>
                                            <td className="hidden xl:table-cell py-2 px-3 border-r text-center">
                                                {p.weightUnit || "-"}
                                            </td>
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

                                {/* TOTAL ROW */}
                                <tr className="hidden xl:table-row bg-gray-200 font-semibold">
                                    <td colSpan={6} className="py-2 px-3 border-r text-center">
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
                                <td colSpan={13} className="py-4 text-center text-gray-500">
                                    No data available for the selected filters
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
