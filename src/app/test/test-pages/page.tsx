"use client";

import { useState, useEffect, useMemo } from "react";
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
import TopCustomers from "@/components/TopCustomers";
import LeastCustomers from "@/components/LeastCustomers";
import SalesTable from "@/components/SalesTable";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchSales } from "@/lib/fetchSales";
import SalesData from "@/components/SalesData";
import InventorySummary from "@/components/InventorySummary";
import InventoryTable from "@/components/InventoryTableTest";


export default function Page() {

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

    // SALES BY CATEGORY //
    const oldestDate = useMemo(() => {
        if (!sales.length) return null;
        const oldest = Math.min(
            ...sales.map(s => new Date(s.saleDate).getTime())
        );
        return new Date(oldest).toISOString().split("T")[0];
    }, [sales]);

    // 
    return (
        <DashboardLayout>
            <div className="space-y-6 p-6">
                <SalesTrend sales={sales} loading={loading} />
                <div className="space-y-6 grid grid-cols-2 gap-5">
                    <SalesByCategoryPie sales={sales} loading={loading} oldestDate={oldestDate} />
                    <SalesByLocation sales={sales} loading={loading} oldestDate={oldestDate} />
                    <SalesGrowthByLocation sales={sales} loading={loading} oldestDate={oldestDate} />

                    <TopProductsByLocation sales={sales} loading={loading} />
                    <SalesValueByLocation sales={sales} loading={loading} />
                    <SalesContributionByLocation sales={sales} loading={loading} />
                    <TopProducts sales={sales} loading={loading} />
                    <LeastProducts sales={sales} loading={loading} limit={5} />
                    <TopCustomers sales={sales} loading={loading} limit={5} />
                    <LeastCustomers sales={sales} loading={loading} limit={5} />
                    <SalesByCategory sales={sales} loading={loading} />
                </div>
                <div>
                    <SalesData sales={sales} loading={loading} />
                </div>
                <SalesTable />
                <InventorySummary
                    title="Inventory Summary"
                    iconColor="text-blue-600"
                />
            </div>
        </DashboardLayout>
    );
}
