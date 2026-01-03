"use client";

import LeastProducts from "@/components/LeastProducts";
import SalesByCategory from "@/components/SalesByCategory";
import SalesByCategoryPie from "@/components/SalesByCategoryPie";
import SalesByLocation from "@/components/SalesByLocation";
import SalesContributionByLocation from "@/components/SalesContributionByLocation";
import SalesGrowthByLocation from "@/components/SalesGrowthByLocation";
import SalesTrend from "@/components/SalesTrend";
import SalesValueByLocation from "@/components/SalesValueByLocation";
import TopProducts from "@/components/TopProducts";
import TopProductsByLocation from "@/components/TopProductsByLocation";
import RecentSales from "@/components/RecentSales";
import React, { useMemo, useState, useEffect } from "react";
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import TopCustomers from "@/components/TopCustomers";
import LeastCustomers from "@/components/LeastCustomers";
import SalesTable from "@/components/SalesTable";
import SalesPersonSummary from "@/components/SalesPersonSummary"

const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;
    return (
        <div className="bg-white border p-2 text-xs">
            <div><strong>{label}</strong></div>
            {payload.map((p: any) => (
                <div key={p.dataKey}>
                    {p.name}: {p.dataKey === "value" ? `K${p.value.toFixed(2)}` : `${p.value.toFixed(2)} tons`}
                </div>
            ))}
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

export default function Page() {
    // ✅ Hooks always at the top
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

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
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
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

    return (
        <div className="space-y-6 p-6">
            <SalesTrend />
            <div className="space-y-6 grid grid-cols-2 gap-5">
                <SalesByCategoryPie />
                <SalesByLocation />
                <SalesGrowthByLocation />
                <TopProductsByLocation />
                <SalesValueByLocation />
                <SalesContributionByLocation />
                <TopProducts />
                <LeastProducts />
                <SalesByCategory />
                <RecentSales />
                <TopCustomers />
                <LeastCustomers />
            </div>
            <SalesTable />
            <SalesPersonSummary />
        </div>
    );
}
