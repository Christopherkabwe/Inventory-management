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
import DashboardLayout from "@/components/DashboardLayout";


export default function Page() {

    return (
        <DashboardLayout>
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
        </DashboardLayout>
    );
}
