"use client";

import {
    LineChart, Line, Pie, PieChart, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import SalesByCategoryPie from "./SalesByCategoryPie";
import { MapPin, BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
import { TrendingUp } from 'lucide-react';

interface ChartDataPoint {
    date: string;
    value: number;
    quantity: number;
    tonnage: number;
}

interface Props {
    salesTrendData: ChartDataPoint[];
    sales: any[];
    productList: any[];
}

export default function SalesTrendChart({ salesTrendData, sales, productList }: Props) {
    if (!salesTrendData.length || !sales.length || !productList.length) {
        return <p className="text-sm text-gray-500">No sales data available.</p>;
    }

    // Separate date ranges for value and tonnage
    const [valueStartDate, setValueStartDate] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
    );
    const [valueEndDate, setValueEndDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [tonnageStartDate, setTonnageStartDate] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
    );
    const [tonnageEndDate, setTonnageEndDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [categoryStartDate, setCategoryStartDate] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
    );
    const [categoryEndDate, setCategoryEndDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const [locationStartDate, setLocationStartDate] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
    );
    const [locationEndDate, setLocationEndDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    type ViewMode = "daily" | "monthly" | "yearly";

    const [valueView, setValueView] = useState<ViewMode>("monthly");
    const [tonnageView, setTonnageView] = useState<ViewMode>("monthly");

    const aggregateTrendData = (data: ChartDataPoint[], view: ViewMode) => {
        const map = new Map<string, ChartDataPoint>();

        data.forEach(d => {
            const date = new Date(d.date);

            let key = "";
            if (view === "daily") {
                key = date.toISOString().split("T")[0];
            } else if (view === "monthly") {
                key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            } else {
                key = `${date.getFullYear()}`;
            }

            const existing = map.get(key);
            if (existing) {
                existing.value += d.value;
                existing.quantity += d.quantity;
                existing.tonnage += d.tonnage;
            } else {
                map.set(key, { ...d, date: key });
            }
        });

        return Array.from(map.values());
    };

    // Filtered data
    const filteredValueData = useMemo(
        () => salesTrendData.filter(d => {
            const date = new Date(d.date);
            return date >= new Date(valueStartDate) && date <= new Date(valueEndDate);
        }),
        [salesTrendData, valueStartDate, valueEndDate]
    );

    const filteredTonnageData = useMemo(
        () => salesTrendData.filter(d => {
            const date = new Date(d.date);
            return date >= new Date(tonnageStartDate) && date <= new Date(tonnageEndDate);
        }),
        [salesTrendData, tonnageStartDate, tonnageEndDate]
    );

    const filteredCategorySales = useMemo(() =>
        sales.filter(s => {
            const date = new Date(s.saleDate);
            return date >= new Date(categoryStartDate) && date <= new Date(categoryEndDate);
        }),
        [sales, categoryStartDate, categoryEndDate]
    );

    const filteredLocationSales = useMemo(() =>
        sales.filter(s => {
            const date = new Date(s.saleDate);
            return date >= new Date(locationStartDate) && date <= new Date(locationEndDate);
        }),
        [sales, locationStartDate, locationEndDate]
    );

    const valueTrendData = useMemo(
        () => aggregateTrendData(filteredValueData, valueView),
        [filteredValueData, valueView]
    );

    const tonnageTrendData = useMemo(
        () => aggregateTrendData(filteredTonnageData, tonnageView),
        [filteredTonnageData, tonnageView]
    );

    /* ---------------- CATEGORY DATA ---------------- */
    const categoryData = useMemo(() => {
        const filtered = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= new Date(categoryStartDate) && d <= new Date(categoryEndDate);
        });

        const categories = Array.from(new Set(filtered.map(s => s.product?.category || "Uncategorized")));

        return categories.map(category => {
            const categorySales = filtered.filter(s => s.product?.category === category);

            return {
                category,
                quantity: categorySales.reduce((sum, s) => sum + s.quantity, 0),
                salesValue: categorySales.reduce((sum, s) => sum + s.quantity * s.salePrice, 0),
                tonnage: categorySales.reduce((sum, s) => {
                    const p = productList.find(p => p.id === s.productId);
                    return sum + (p ? (p.weightValue * s.quantity * p.packSize) / 1000 : 0);
                }, 0),
            };
        }).sort((a, b) => b.tonnage - a.tonnage);
    }, [sales, categoryStartDate, categoryEndDate, productList]);

    /* ---------------- LOCATION DATA ---------------- */
    const productMap = useMemo(() => {
        const map = new Map();
        productList.forEach(p => map.set(p.id, p));
        return map;
    }, [productList]);

    const locationData = useMemo(() => {
        const filtered = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= new Date(locationStartDate) && d <= new Date(locationEndDate);
        });

        const locs = Array.from(new Set(filtered.map(s => s.location?.name || "Unknown")));

        return locs.map(location => {
            const locationSales = filtered.filter(s => s.location?.name === location);
            return {
                location,
                quantity: locationSales.reduce((sum, s) => sum + s.quantity, 0),
                salesValue: locationSales.reduce((sum, s) => sum + s.quantity * s.salePrice, 0),
                tonnage: locationSales.reduce((sum, s) => {
                    const p = productMap.get(s.productId);
                    return sum + (p ? (p.weightValue * s.quantity * p.packSize) / 1000 : 0);
                }, 0),
            };
        }).sort((a, b) => b.tonnage - a.tonnage);
    }, [sales, locationStartDate, locationEndDate, productList]);

    // Date Range Selector
    const DateRangeSelector = ({
        start, end, setStart, setEnd, view, setView
    }: {
        start: string,
        end: string,
        setStart: (s: string) => void,
        setEnd: (s: string) => void,
        view: ViewMode,
        setView: (v: ViewMode) => void
    }) => {
        // Default fallback dates
        const defaultStart = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]; // Jan 1 YTD
        const defaultEnd = new Date().toISOString().split("T")[0]; // today

        return (
            <div className="flex items-center gap-2 ml-35 mb-5">
                <span className="text-xs text-center">Date Range:</span>
                <input
                    type="date"
                    value={start}
                    onChange={e => setStart(e.target.value || defaultStart)}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
                />
                <span>-</span>
                <input
                    type="date"
                    value={end}
                    onChange={e => setEnd(e.target.value || defaultEnd)}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
                />
                <select value={view} onChange={e => setView(e.target.value as ViewMode)}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-100">
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>
        );
    };

    const SimpleDateRangeSelector = ({
        start,
        end,
        setStart,
        setEnd
    }: {
        start: string;
        end: string;
        setStart: (s: string) => void;
        setEnd: (s: string) => void;
    }) => {
        const defaultStart = new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0];
        const defaultEnd = new Date().toISOString().split("T")[0];

        return (
            <div className="flex items-center gap-2 ml-10 mb-5">
                <span className="text-xs">Date Range:</span>
                <input
                    type="date"
                    value={start}
                    onChange={e => setStart(e.target.value || defaultStart)}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
                />
                <span>-</span>
                <input
                    type="date"
                    value={end}
                    onChange={e => setEnd(e.target.value || defaultEnd)}
                    className="border rounded px-2 py-1 text-xs hover:bg-gray-100"
                />
            </div>
        );
    };


    return (
        <div className="space-y-6">
            {/* ================= LINE CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Value Trend */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Sales Value Trend
                        </h3>
                    </div>
                    <div>
                        <DateRangeSelector
                            start={valueStartDate} end={valueEndDate} setStart={setValueStartDate} setEnd={setValueEndDate}
                            view={valueView} setView={setValueView}
                        />
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={valueTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip labels={{
                                titleKey: "date",
                                metrics: [
                                    { key: "value", label: "Sales Value", format: v => `K${v.toFixed(2)}` },
                                    { key: "tonnage", label: "Tonnage", format: v => `${v.toFixed(2)} tons` },
                                    { key: "quantity", label: "Quantity", format: v => `${v} units` },
                                ],
                            }} />} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#2563eb"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Sales Tonnage Trend */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" />
                            Sales Tonnage Trend
                        </h3>
                    </div>
                    <div>
                        <DateRangeSelector
                            start={tonnageStartDate} end={tonnageEndDate} setStart={setTonnageStartDate} setEnd={setTonnageEndDate}
                            view={tonnageView} setView={setTonnageView}
                        />
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={tonnageTrendData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip content={<CustomTooltip labels={{
                                titleKey: "date",
                                metrics: [
                                    { key: "tonnage", label: "Tonnage", format: v => `${v.toFixed(2)} tons` },
                                    { key: "value", label: "Sales Value", format: v => `K${v.toFixed(2)}` },
                                ],
                            }} />} />
                            <Line
                                type="monotone"
                                dataKey="tonnage"
                                stroke="#16a34a"
                                strokeWidth={2.5}
                                dot={false}
                                activeDot={{ r: 4 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ================= BARS & PIE ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Category Pie */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-2">Sales by Category</h3>
                    <SimpleDateRangeSelector
                        start={categoryStartDate}
                        end={categoryEndDate}
                        setStart={setCategoryStartDate}
                        setEnd={setCategoryEndDate}
                    />
                    <SalesByCategoryPie categoryData={categoryData} />
                </div>

                {/* Sales Value by Location */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Sales Value by Location
                    </h3>
                    <SimpleDateRangeSelector
                        start={locationStartDate}
                        end={locationEndDate}
                        setStart={setLocationStartDate}
                        setEnd={setLocationEndDate}
                    />

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="salesValue" radius={[6, 6, 0, 0]} fill="#3b82f6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tonnage by Location */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Sales by Location (Tonnage)
                    </h3>
                    <SimpleDateRangeSelector
                        start={locationStartDate}
                        end={locationEndDate}
                        setStart={setLocationStartDate}
                        setEnd={setLocationEndDate}
                    />
                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="tonnage" radius={[6, 6, 0, 0]} fill="#16a34a" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
