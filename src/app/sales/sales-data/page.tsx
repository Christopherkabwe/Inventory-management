"use client";

import { useState, useEffect, useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchSales } from "@/lib/fetchSales";
import SalesData from "@/components/sales/SalesData";


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

    // 
    return (
        <DashboardLayout>
            <SalesData sales={sales} loading={loading} />
        </DashboardLayout>
    );
}
