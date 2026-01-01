"use client";

import {
    LineChart, Line, Pie, PieChart, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ScatterChart, Scatter, Legend
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import SalesByCategoryPie from "./SalesByCategoryPie";
import { MapPin, BarChart3 } from "lucide-react";
import { useMemo, useState } from "react";
import { TrendingUp, Package, Package2Icon } from 'lucide-react';
import SalesTrend from "./SalesTrend"
import SalesByLocation from "./SalesByLocation";
import SalesGrowthByLocation from "./SalesGrowthByLocation";
import TopProductsByLocation from "./TopProductsByLocation";
import SalesValueByLocation from "./SalesValueByLocation";
import SalesContributionByLocation from "./SalesContributionByLocation";

interface ChartDataPoint {
    date: string;
    value: number;
    quantity: number;
    tonnage: number;
}

interface Props {
    sales: any[];
    productList: any[];
}

type GrowthData = {
    location: string;
    current: number;
    previous: number;
    growthPercent: number;
};

export default function SalesTrendChart({ sales, productList }: Props) {
    if (!sales.length || !productList.length) {
        return <p className="text-sm text-gray-500">No sales data available.</p>;
    }

    const salesTrendData: ChartDataPoint[] = useMemo(() => {
        const map = new Map<string, ChartDataPoint>();

        sales.forEach(s => {
            if (!s.saleDate) return;

            const dateKey = new Date(s.saleDate).toISOString().split("T")[0];

            if (!map.has(dateKey)) {
                map.set(dateKey, {
                    date: dateKey,
                    value: 0,
                    quantity: 0,
                    tonnage: 0,
                });
            }

            const acc = map.get(dateKey)!;
            const value = s.quantity * s.salePrice;

            const product = productList.find(p => p.id === s.productId);
            const tonnage = product
                ? (product.weightValue * s.quantity * product.packSize) / 1000
                : 0;

            acc.value += value;
            acc.quantity += s.quantity;
            acc.tonnage += tonnage;
        });

        return Array.from(map.values()).sort(
            (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }, [sales, productList]);

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

            if (!map.has(key)) {
                map.set(key, {
                    date: key,
                    value: 0,
                    quantity: 0,
                    tonnage: 0,
                });
            }

            const acc = map.get(key)!;
            acc.value += Number(d.value) || 0;
            acc.quantity += Number(d.quantity) || 0;
            acc.tonnage += Number(d.tonnage) || 0;
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

    // Growth By Location Data //
    const growthByLocation = useMemo(() => {
        const start = new Date(locationStartDate);
        const end = new Date(locationEndDate);
        const diff = end.getTime() - start.getTime();

        const prevStart = new Date(start.getTime() - diff);
        const prevEnd = new Date(start.getTime());

        const current = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= start && d <= end;
        });

        const previous = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= prevStart && d < prevEnd;
        });

        const locations = Array.from(
            new Set([...current, ...previous].map(s => s.location?.name || "Unknown"))
        );

        return locations.map(location => {
            const currValue = current
                .filter(s => s.location?.name === location)
                .reduce((sum, s) => sum + s.quantity * s.salePrice, 0);

            const prevValue = previous
                .filter(s => s.location?.name === location)
                .reduce((sum, s) => sum + s.quantity * s.salePrice, 0);

            const growthPercent =
                prevValue === 0 ? 100 : ((currValue - prevValue) / prevValue) * 100;

            return {
                location,
                growthPercent
            };
        }).sort((a, b) => b.growthPercent - a.growthPercent);
    }, [sales, locationStartDate, locationEndDate]);

    // Sales Contribution by Location Data //

    const locationContributionData = useMemo(() => {
        const filtered = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= new Date(locationStartDate) && d <= new Date(locationEndDate);
        });

        const totals = new Map<string, number>();
        let grandTotal = 0;

        filtered.forEach(s => {
            const location = s.location?.name || "Unknown";
            const value = s.quantity * s.salePrice;

            totals.set(location, (totals.get(location) || 0) + value);
            grandTotal += value;
        });

        return Array.from(totals.entries()).map(([location, total]) => ({
            location,
            salesValue: total,
            contribution: grandTotal ? (total / grandTotal) * 100 : 0,
        }));
    }, [sales, locationStartDate, locationEndDate]);


    // Sales by Product Data //

    const [productStartDate, setProductStartDate] = useState<string>(
        new Date(new Date().getFullYear(), 0, 1).toISOString().split("T")[0]
    );
    const [productEndDate, setProductEndDate] = useState<string>(
        new Date().toISOString().split("T")[0]
    );

    const productSalesData = useMemo(() => {
        const filtered = sales.filter(s => {
            const d = new Date(s.saleDate);
            return d >= new Date(productStartDate) && d <= new Date(productEndDate);
        });
        const products = Array.from(new Set(filtered.map(s => s.product?.name || "Unknown")));
        return products.map(product => {
            const productSales = filtered.filter(s => s.product?.name === product);
            return {
                productName: product,
                salesValue: productSales.reduce((sum, s) => sum + s.quantity * s.salePrice, 0),
            };
        }).sort((a, b) => b.salesValue - a.salesValue);
    }, [sales, productStartDate, productEndDate]);

    // Top Products Per Location

    const topProductsByLocation = useMemo(() => {
        const map = new Map<
            string,
            Map<string, { tonnage: number; value: number }>
        >();

        sales.forEach(s => {
            const location = s.location?.name || "Unknown";
            const productName = s.product?.name || "Unknown";
            const product = productList.find(p => p.id === s.productId);

            const value = s.quantity * s.salePrice;
            const tonnage = product
                ? (product.weightValue * s.quantity * product.packSize) / 1000
                : 0;

            if (!map.has(location)) {
                map.set(location, new Map());
            }

            const prodMap = map.get(location)!;

            if (!prodMap.has(productName)) {
                prodMap.set(productName, { tonnage: 0, value: 0 });
            }

            const entry = prodMap.get(productName)!;
            entry.tonnage += tonnage;
            entry.value += value;
        });

        return Array.from(map.entries()).map(([location, prodMap]) => ({
            location,
            products: Array.from(prodMap.entries())
                .sort((a, b) => {
                    // 🔥 Primary: tonnage, Secondary: value
                    if (b[1].tonnage !== a[1].tonnage) {
                        return b[1].tonnage - a[1].tonnage;
                    }
                    return b[1].value - a[1].value;
                })
                .slice(0, 5)
                .map(([name, data]) => ({
                    name,
                    tonnage: data.tonnage,
                    value: data.value,
                })),
        }));
    }, [sales, productList]);


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
            <div className="flex items-center justify-end w-full gap-2 mb-5">
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
            <div className="flex items-center justify-end w-full gap-2 mb-5">
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
            <div className="grid grid-cols-1 xl:grid-cols-1 gap-6">

                {/* Sales Value Trend */}

                <div>
                    <SalesTrend />
                </div>
            </div>

            {/* ================= BARS & PIE ================= */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Category Pie */}
                <div>
                    <SalesByCategoryPie />
                </div>
                {/* Sales Tonnage by Location */}
                <div>
                    <SalesByLocation />
                </div>
                {/* Sales Growth by Location */}
                <SalesGrowthByLocation />
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-5">
                {/* Top Products per Location */}
                <div >
                    <TopProductsByLocation />
                </div>

                {/* Sales Value by Location */}
                <SalesValueByLocation />
                {/* Contribution to Total Sales (Donut) */}
                <SalesContributionByLocation />
            </div>
        </div >
    );
}