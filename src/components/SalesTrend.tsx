"use client";

import { BarChart3 } from "lucide-react";
import React, { useMemo, useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import SalesByCategoryPie from "./SalesByCategoryPie";

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-white border p-2 text-xs" >
            <div>{label}</div >
            {
                payload.map((p: any) => (
                    <div key={p.dataKey} >
                        {p.name}: {p.dataKey === "value" ? `K${p.value.toFixed(2)}` : `${p.value.toFixed(2)} tons`}
                    </div>
                ))
            }
        </div>
    );
};

interface Product {
    id: number;
    name: string;
    weightValue: number;
    packSize: number;
}

interface SaleItem {
    productId: number;
    quantity: number;
    price: number;
    product: Product;
}

interface Sale {
    saleDate: string;
    items: SaleItem[];
}

interface ChartDataPoint {
    date: string;
    value: number;
    quantity: number;
    tonnage: number;
}

type ViewMode = "daily" | "monthly" | "yearly";

export default function TestPage() {
    // ✅ Hooks always at the top
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingValueChart, setLoadingValueChart] = useState(true);
    const [loadingTonnageChart, setLoadingTonnageChart] = useState(true);

    const [valueStartDate, setValueStartDate] = useState("");
    const [valueEndDate, setValueEndDate] = useState("");
    const [tonnageStartDate, setTonnageStartDate] = useState("");
    const [tonnageEndDate, setTonnageEndDate] = useState("");

    const [valueView, setValueView] = useState<ViewMode>("monthly");
    const [tonnageView, setTonnageView] = useState<ViewMode>("monthly");

    // ---------------- Fetch sales ----------------
    useEffect(() => {
        fetch("/api/sales")
            .then(res => res.json())
            .then(data => {
                if (data.success) setSales(data.data);
                else console.error("Failed to fetch sales:", data.error);
                setLoading(false);
                setLoadingValueChart(false);
                setLoadingTonnageChart(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
                setLoadingValueChart(false);
                setLoadingTonnageChart(false);
            });
    }, []);

    // ---------------- Chart calculations ----------------
    const salesTrendData: ChartDataPoint[] = useMemo(() => {
        const map = new Map<string, ChartDataPoint>();
        sales.forEach(s => {
            const dateKey = new Date(s.saleDate).toISOString().split("T")[0];
            if (!map.has(dateKey)) map.set(dateKey, { date: dateKey, value: 0, quantity: 0, tonnage: 0 });
            const acc = map.get(dateKey)!;
            s.items.forEach(item => {
                acc.value += item.quantity * item.price;
                acc.quantity += item.quantity;
                acc.tonnage += item.product
                    ? (item.product.weightValue * item.quantity * item.product.packSize) / 1000
                    : 0;
            });
        });
        return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [sales]);

    const aggregateTrendData = (data: ChartDataPoint[], view: ViewMode) => {
        const map = new Map<string, ChartDataPoint>();
        data.forEach(d => {
            const date = new Date(d.date);
            let key = "";
            if (view === "daily") key = date.toISOString().split("T")[0];
            else if (view === "monthly") key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            else key = `${date.getFullYear()}`;

            if (!map.has(key)) map.set(key, { date: key, value: 0, quantity: 0, tonnage: 0 });
            const acc = map.get(key)!;
            acc.value += d.value;
            acc.quantity += d.quantity;
            acc.tonnage += d.tonnage;
        });
        return Array.from(map.values());
    };

    // ---------------- Set default dates once data is loaded ----------------
    useEffect(() => {
        if (!salesTrendData.length) return;
        const defaultStart = salesTrendData[0].date;
        const defaultEnd = salesTrendData[salesTrendData.length - 1].date;
        setValueStartDate(defaultStart);
        setValueEndDate(defaultEnd);
        setTonnageStartDate(defaultStart);
        setTonnageEndDate(defaultEnd);
    }, [salesTrendData]);

    const filteredValueData = useMemo(
        () => salesTrendData.filter(d => new Date(d.date) >= new Date(valueStartDate) && new Date(d.date) <= new Date(valueEndDate)),
        [salesTrendData, valueStartDate, valueEndDate]
    );

    const filteredTonnageData = useMemo(
        () => salesTrendData.filter(d => new Date(d.date) >= new Date(tonnageStartDate) && new Date(d.date) <= new Date(tonnageEndDate)),
        [salesTrendData, tonnageStartDate, tonnageEndDate]
    );

    const valueTrendData = useMemo(() => aggregateTrendData(filteredValueData, valueView), [filteredValueData, valueView]);
    const tonnageTrendData = useMemo(() => aggregateTrendData(filteredTonnageData, tonnageView), [filteredTonnageData, tonnageView]);

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
        const defaultStart = new Date(2024, 0, 1).toISOString().split("T")[0]; // Jan 1, 2024
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

    return (
        <div className="space-y-6" >
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-2" >
                {/* Sales Value */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" /> Sales Value Trend
                        </h3>
                    </div>
                    <div>
                        <DateRangeSelector start={valueStartDate} end={valueEndDate} setStart={setValueStartDate} setEnd={setValueEndDate} view={valueView} setView={setValueView} />
                    </div>
                    {loadingValueChart ? (
                        <div className="flex justify-center items-center h-[250px]">
                            Loading...
                        </div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={valueTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip labels={{
                                    titleKey: "date", metrics: [
                                        { key: "value", label: "Sales Value", format: v => `K${v.toFixed(2)}` },
                                        { key: "tonnage", label: "Tonnage", format: v => `${v.toFixed(2)} tons` },
                                        { key: "quantity", label: "Quantity", format: v => `${v} units` },
                                    ],
                                }} />} />
                                <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
                {/* Sales Tonnage */}
                <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold flex items-center gap-2">
                            <BarChart3 className="h-5 w-5 text-blue-600" /> Sales Tonnage Trend
                        </h3>
                    </div>
                    <div>
                        <DateRangeSelector start={tonnageStartDate} end={tonnageEndDate} setStart={setTonnageStartDate} setEnd={setTonnageEndDate} view={tonnageView} setView={setTonnageView} />
                    </div>
                    {loadingTonnageChart ? (
                        <div className="flex justify-center items-center h-[250px]">Loading...</div>
                    ) : (
                        <ResponsiveContainer width="100%" height={250}>
                            <LineChart data={tonnageTrendData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                                <YAxis tick={{ fontSize: 11 }} />
                                <Tooltip content={<CustomTooltip labels={{
                                    titleKey: "date", metrics: [
                                        { key: "tonnage", label: "Tonnage", format: v => `${v.toFixed(2)} tons` },
                                        { key: "value", label: "Sales Value", format: v => `K${v.toFixed(2)}` },
                                    ],
                                }} />} />
                                <Line type="monotone" dataKey="tonnage" stroke="#16a34a" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                            </LineChart>
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </div>
    );
}
