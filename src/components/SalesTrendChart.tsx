"use client";

import { useState, useEffect, useMemo } from "react";
import SalesTrend from "./SalesTrend";
import SalesByCategoryPie from "./SalesByCategoryPie";
import SalesByLocation from "./SalesByLocation";
import SalesGrowthByLocation from "./SalesGrowthByLocation";
import TopProductsByLocation from "./TopProductsByLocation";
import SalesValueByLocation from "./SalesValueByLocation";
import SalesContributionByLocation from "./SalesContributionByLocation";
import TopProducts from "./TopProducts";
import TopCustomers from "./TopCustomers";
import { fetchSales } from "@/lib/fetchSales";
import LeastProducts from "./LeastProducts";
import LeastCustomers from "./LeastCustomers";
import SalesByCategory from "./SalesByCategory";

export default function SalesDashboard() {
    const [sales, setSales] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const data = await fetchSales();
                setSales(data);
            } catch (e) {
                console.error(e);
                setSales([]);
            } finally {
                setLoading(false);
            }
        };
        load();
    }, []);

    const oldestDate = useMemo(() => {
        if (!sales.length) return null;
        const oldest = Math.min(...sales.map(s => new Date(s.saleDate).getTime()));
        return new Date(oldest).toISOString().split("T")[0];
    }, [sales]);

    return (
        <div className="space-y-6 p-6">
            {/* Sales Trend */}
            <SalesTrend sales={sales} loading={loading} />

            {/* ================= BARS & PIE ================= */}
            {/* Category & Location */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Category Pie */}
                <SalesByCategoryPie sales={sales} loading={loading} oldestDate={oldestDate} />
                {/* Sales Tonnage by Location */}
                <SalesByLocation sales={sales} loading={loading} oldestDate={oldestDate} />
                {/* Sales Growth by Location */}
                <SalesGrowthByLocation sales={sales} loading={loading} oldestDate={oldestDate} />
            </div>
            {/* Top Products & Value */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-5">
                {/* Top Products per Location */}
                <TopProductsByLocation sales={sales} loading={loading} />
                {/* Sales Value by Location */}
                <SalesValueByLocation sales={sales} loading={loading} />
                {/* Contribution to Total Sales (Donut) */}
                <SalesContributionByLocation sales={sales} loading={loading} />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-5">
                {/* Top & Least Selling Products */}
                <TopProducts sales={sales} loading={loading} />
                <LeastProducts sales={sales} loading={loading} limit={5} />

                {/* Sales by Category */}
                <SalesByCategory sales={sales} loading={loading} />
            </div>
            {/* Top Customers and Location */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-5">
                <TopCustomers sales={sales} loading={loading} limit={5} />
                <LeastCustomers sales={sales} loading={loading} limit={5} />
            </div>
        </div>
    );
}
