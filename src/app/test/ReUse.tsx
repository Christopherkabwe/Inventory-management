"use client";

import {
    LineChart, Line, Pie, PieChart, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import SalesByCategoryPie from "./SalesByCategoryPie";
import { MapPin, BarChart3 } from "lucide-react";

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

    /* ---------------- CATEGORY DATA ---------------- */
    const categories = Array.from(
        new Set(
            sales
                .filter(s => new Date(s.saleDate).getFullYear() === new Date().getFullYear())
                .map(s => s.product?.category || "Uncategorized")
        )
    );

    const categoryData = categories.map(category => {
        const categorySales = sales.filter(
            s =>
                new Date(s.saleDate).getFullYear() === new Date().getFullYear() &&
                s.product?.category === category
        );

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

    /* ---------------- LOCATION DATA ---------------- */
    const locations = Array.from(
        new Set(
            sales
                .filter(s => new Date(s.saleDate).getFullYear() === new Date().getFullYear())
                .map(s => s.location?.name || "Unknown")
        )
    );

    const locationData = locations.map(location => {
        const locationSales = sales.filter(
            s =>
                new Date(s.saleDate).getFullYear() === new Date().getFullYear() &&
                s.location?.name === location
        );

        return {
            location,
            quantity: locationSales.reduce((sum, s) => sum + s.quantity, 0),
            salesValue: locationSales.reduce((sum, s) => sum + s.quantity * s.salePrice, 0),
            tonnage: locationSales.reduce((sum, s) => {
                const p = productList.find(p => p.id === s.productId);
                return sum + (p ? (p.weightValue * s.quantity * p.packSize) / 1000 : 0);
            }, 0),
        };
    }).sort((a, b) => b.tonnage - a.tonnage);

    return (
        <div className="space-y-6">
            {/* ================= LINE CHARTS ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Value Trend */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-blue-600" />
                        Sales Value Trend
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Sales Value (K)</p>

                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={salesTrendData}>
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
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <BarChart3 className="h-5 w-5 text-green-600" />
                        Sales Tonnage Trend
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Tonnage</p>

                    <ResponsiveContainer width="100%" height={220}>
                        <LineChart data={salesTrendData}>
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
                <SalesByCategoryPie categoryData={categoryData} />

                {/* Sales Value by Location */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Sales Value by Location
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Year-to-Date</p>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar
                                dataKey="salesValue"
                                radius={[6, 6, 0, 0]}
                                fill="#3b82f6"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Tonnage by Location */}
                <div className="bg-white p-6 rounded-xl border">
                    <h3 className="font-semibold mb-1 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Sales by Location
                    </h3>
                    <p className="text-xs text-gray-500 mb-4">Tonnage</p>

                    <ResponsiveContainer width="100%" height={260}>
                        <BarChart data={locationData} barCategoryGap={18}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="location" tick={{ fontSize: 11 }} />
                            <YAxis tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar
                                dataKey="tonnage"
                                radius={[6, 6, 0, 0]}
                                fill="#16a34a"
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
}
