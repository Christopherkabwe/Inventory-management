"use client";

import { useState, useEffect, useMemo } from "react";
import LeastProducts from "@/components/sales/LeastProducts";
import SalesByCategory from "@/components/sales/SalesByCategory";
import SalesByCategoryPie from "@/components/sales/SalesByCategoryPie";
import SalesByLocation from "@/components/sales/SalesByLocation";
import SalesContributionByLocation from "@/components/sales/SalesContributionByLocation";
import SalesGrowthByLocation from "@/components/sales/SalesGrowthByLocation";
import SalesTrend from "@/components/sales/SalesTrend";
import SalesValueByLocation from "@/components/sales/SalesValueByLocation";
import TopProducts from "@/components/sales/TopProducts";
import TopProductsByLocation from "@/components/sales/TopProductsByLocation";
import TopCustomers from "@/components/sales/TopCustomers";
import LeastCustomers from "@/components/sales/LeastCustomers";
import SalesTable from "@/components/sales/SalesTable";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchSales } from "@/lib/fetchSales";
import SalesData from "@/components/sales/SalesData";
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
        <div>
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
        </div>
    );
}
