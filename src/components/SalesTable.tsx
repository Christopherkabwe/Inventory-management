"use client";

import { useMemo, useState, useEffect } from "react";
import { ArrowUpDown } from "lucide-react";
import { unitToKg } from "@/lib/UnitToKg";
import ViewSelector from "./ViewSelector";
import DateFiltersExports from "./DateFiltersExports";
import { Sale } from "@/types/Sale";
import Loading from "@/components/Loading";
import { useUser } from "@/app/context/UserContext";

type View = "location" | "customer" | "product" | "salesperson" | "manager";

type SortKey =
    | "name"
    | "saleCount"
    | "quantity"
    | "totalTonnage"
    | "totalSalesValue"
    | "avgOrderValue"
    | "contribution";

interface AggregatedRow {
    id: string;
    name: string;
    saleCount: number;
    quantity: number;
    totalTonnage: number;
    totalSalesValue: number;
    avgOrderValue: number;
    contribution: number;
}

interface CurrentUser {
    id: string;
    role: "ADMIN" | "MANAGER" | "USER";
}

export default function SalesTable() {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    const [view, setView] = useState<View>("location");
    const [sortKey, setSortKey] = useState<SortKey>("totalSalesValue");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");

    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
    const [showFilters, setShowFilters] = useState(false);



    /** ----------------- Fetch Current User ----------------- */
    const user = useUser();
    const currentUser = user;

    /** ----------------- Fetch Sales ----------------- */
    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const res = await fetch("/api/rbac/sales");
                const data = await res.json();
                setSales(data || []);
            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchSales();
    }, []);

    /** ----------------- Sorting ----------------- */
    const toggleSort = (key: SortKey) => {
        if (key === sortKey) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortKey(key);
            setSortDir("desc");
        }
    };

    const Header = ({ label, column, align = "left" }: any) => (
        <th
            onClick={() => toggleSort(column)}
            className={`py-2 px-3 cursor-pointer border-r select-none hover:text-blue-600 ${align === "right" ? "text-right" : "text-left"}`}
        >
            <span className="inline-flex items-center gap-1">
                {label}
                {sortKey === column && <span className="text-xs">{sortDir === "asc" ? "▲" : "▼"}</span>}
                <ArrowUpDown className="w-3 h-3 opacity-40" />
            </span>
        </th>
    );

    /** ----------------- Users (Customer Owners) ----------------- */
    const users = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();
        sales.forEach((sale) => {
            const user = sale.customer?.user;
            if (!user) return;

            if (currentUser?.role === "MANAGER" && user.manager?.id !== currentUser.id) return;

            if (!map.has(user.id)) {
                map.set(user.id, { id: user.id, name: user.fullName ?? "Unknown User" });
            }
        });
        return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
    }, [sales, currentUser]);

    /** ----------------- Locations ----------------- */
    const locations = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();
        sales.forEach((sale) => {
            if (sale.location && !map.has(sale.locationId)) {
                map.set(sale.locationId, { id: sale.locationId, name: sale.location.name });
            }
        });
        return Array.from(map.values());
    }, [sales]);

    /** ----------------- Categories ----------------- */
    const categories = useMemo(() => {
        const set = new Set<string>();
        sales.forEach((sale) =>
            sale.items.forEach((item) => {
                if (item.product?.category) set.add(item.product.category);
            })
        );
        return Array.from(set);
    }, [sales]);

    /** ----------------- Products ----------------- */
    const products = useMemo(() => {
        const map = new Map<string, { id: string; name: string }>();
        sales.forEach((sale) =>
            sale.items.forEach((item) => {
                if (item.product && !map.has(item.productId)) {
                    map.set(item.productId, { id: item.productId, name: item.product.name });
                }
            })
        );
        return Array.from(map.values());
    }, [sales]);

    /** ----------------- Filtered Sales ----------------- */
    const filteredSales = useMemo(() => {
        if (!currentUser) return [];
        return sales.filter((sale) => {
            const user = sale.customer?.user;
            const date = new Date(sale.saleDate);
            if (startDate && date < startDate) return false;
            if (endDate && date > endDate) return false;
            if (currentUser.role === "ADMIN") {
                // Admin sees everything
            } else if (currentUser.role === "MANAGER") {
                // Manager sees:
                // 1️⃣ Sales they created
                // 2️⃣ Sales for customers assigned to users they manage
                // 3️⃣ Sales happening in their location(s)
                if (
                    sale.createdById !== currentUser.id && // sales created by manager
                    (!user || user.managerId !== currentUser.id) && // customers assigned to managed users
                    sale.locationId !== currentUser.locationId // sales in manager's location
                ) return false;
            } else if (currentUser.role === "USER") {
                // User sees sales they created + sales for their assigned customers
                if (
                    sale.createdById !== currentUser.id && // sales created by user
                    (!user || user.id !== currentUser.id) // sales for user's assigned customers
                ) return false;
            }

            if (selectedUsers.length && user && !selectedUsers.includes(user.id)) return false;
            if (selectedLocations.length && !selectedLocations.includes(sale.locationId)) return false;
            if (selectedCategories.length) {
                const saleCategories = sale.items.map((i) => i.product?.category).filter(Boolean);
                if (!saleCategories.some((c) => selectedCategories.includes(c!))) return false;
            }
            if (selectedProducts.length) {
                const ids = sale.items.map((i) => i.productId);
                if (!ids.some((id) => selectedProducts.includes(id))) return false;
            }
            return true;
        });
    }, [
        sales,
        startDate,
        endDate,
        selectedUsers,
        selectedLocations,
        selectedCategories,
        selectedProducts,
        currentUser,
    ]);

    /** ----------------- Aggregation ----------------- */
    const aggregatedData = useMemo(() => {
        const map: Record<string, AggregatedRow> = {};

        filteredSales.forEach((sale) => {
            const user = sale.customer?.user;

            sale.items.forEach((item) => {
                let id: string;
                let name: string;

                if (view === "location") {
                    id = sale.locationId;
                    name = sale.location?.name ?? "Unknown Location";
                } else if (view === "customer") {
                    id = sale.customerId;
                    name = sale.customer?.name ?? "Unknown Customer";
                } else if (view === "product") {
                    id = item.productId;
                    name = item.product?.name ?? "Unknown Product";
                } else if (view === "salesperson") {
                    if (!user) return;
                    id = user.id;
                    name = user.fullName ?? "Unknown User";
                } else if (view === "manager") {
                    if (!user) return;
                    const manager = user.manager;
                    id = manager?.id ?? "no-manager";
                    name = manager?.fullName ?? "No Manager";
                } else return;

                if (!map[id]) {
                    map[id] = {
                        id,
                        name,
                        saleCount: 0,
                        quantity: 0,
                        totalTonnage: 0,
                        totalSalesValue: 0,
                        avgOrderValue: 0,
                        contribution: 0,
                    };
                }

                const weightKg = unitToKg(item.product?.weightValue ?? 0, item.product?.weightUnit ?? "kg");
                const tonnage = (weightKg * item.quantity * (item.product?.packSize ?? 1)) / 1000;

                map[id].saleCount += 1;
                map[id].quantity += item.quantity;
                map[id].totalTonnage += tonnage;
                map[id].totalSalesValue += item.total ?? item.price * item.quantity;
            });
        });

        const totalRevenue = Object.values(map).reduce((sum, d) => sum + d.totalSalesValue, 0);

        return Object.values(map).map((d) => ({
            ...d,
            avgOrderValue: d.saleCount ? d.totalSalesValue / d.saleCount : 0,
            contribution: totalRevenue ? (d.totalSalesValue / totalRevenue) * 100 : 0,
        }));
    }, [filteredSales, view]);

    /** ----------------- Sorting Aggregated Data ----------------- */
    const sortedData = useMemo(() => {
        return [...aggregatedData].sort((a, b) => {
            const aVal = a[sortKey];
            const bVal = b[sortKey];
            if (typeof aVal === "string" && typeof bVal === "string")
                return sortDir === "asc" ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            if (typeof aVal === "number" && typeof bVal === "number")
                return sortDir === "asc" ? aVal - bVal : bVal - aVal;
            return 0;
        });
    }, [aggregatedData, sortKey, sortDir]);

    /** ------------------ Render ------------------ */
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md">
            <h2 className="px-2 font-semibold mb-5">Sales Summary</h2>

            <ViewSelector view={view} setView={setView} />

            <div className="flex justify-start items-center mb-2 mt-2">
                <button
                    className="xl:hidden mb-3 px-3 py-1 border rounded-sm text-sm hover:bg-gray-100"
                    onClick={() => setShowFilters(!showFilters)}
                >
                    {showFilters ? "Hide Filters" : "Show Filters"}
                </button>
            </div>

            <div className={`${showFilters ? "flex flex-col" : "hidden"} xl:flex xl:flex-col`}>
                <DateFiltersExports
                    startDate={startDate}
                    endDate={endDate}
                    setStartDate={setStartDate}
                    setEndDate={setEndDate}
                    selectedLocations={selectedLocations}
                    setSelectedLocations={setSelectedLocations}
                    selectedCategories={selectedCategories}
                    setSelectedCategories={setSelectedCategories}
                    selectedProducts={selectedProducts}
                    setSelectedProducts={setSelectedProducts}
                    selectedUsers={selectedUsers}
                    setSelectedUsers={setSelectedUsers}
                    locationOptions={locations}
                    categoryOptions={categories}
                    productOptions={products}
                    userOptions={users}
                    exportCSV={() => { }}
                    exportPDF={() => { }}
                />
            </div>

            <div className="max-h-[420px] overflow-y-auto overflow-x-auto">
                <table className="w-full text-sm border border-gray-200">
                    <thead className="sticky top-0 bg-gray-200">
                        <tr>
                            <th className="py-2 px-3 border-r text-center">#</th>
                            <Header
                                label={
                                    view === "location"
                                        ? "Location"
                                        : view === "customer"
                                            ? "Customer"
                                            : view === "product"
                                                ? "Product"
                                                : view === "salesperson"
                                                    ? "Sales Rep"
                                                    : "Manager"
                                }
                                column="name"
                            />
                            <Header label="Orders" column="saleCount" />
                            <Header label="Quantity" column="quantity" />
                            <Header label="Tonnage" column="totalTonnage" />
                            <Header label="Avg Order Value" column="avgOrderValue" />
                            <Header label="Revenue" column="totalSalesValue" />
                            <Header label="Contribution" column="contribution" />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <Loading message="Loading Sales" colSpan={8} />
                            </tr>
                        ) : (
                            sortedData.map((d, i) => (
                                <tr key={d.id} className={i % 2 ? "bg-gray-50" : ""}>
                                    <td className="py-2 px-3 border-r text-center">{i + 1}</td>
                                    <td className="py-2 px-3 border-r">{d.name}</td>
                                    <td className="py-2 px-3 border-r">{d.saleCount}</td>
                                    <td className="py-2 px-3 border-r">{d.quantity}</td>
                                    <td className="py-2 px-3 border-r">{d.totalTonnage.toFixed(2)}</td>
                                    <td className="py-2 px-3 border-r">K{d.avgOrderValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r">K{d.totalSalesValue.toFixed(0)}</td>
                                    <td className="py-2 px-3 border-r">{d.contribution.toFixed(1)}%</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
