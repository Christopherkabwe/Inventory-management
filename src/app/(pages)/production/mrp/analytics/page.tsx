"use client";

import Loading from "@/components/Loading";
import LoadingTable from "@/components/LoadingTable";
import { useEffect, useState } from "react";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    CartesianGrid,
} from "recharts";

export default function MRPAnalyticsPage() {
    const [loading, setLoading] = useState(true);
    const [shortages, setShortages] = useState<any[]>([]);

    useEffect(() => {
        let isMounted = true;

        setLoading(true);
        fetch("/api/mrp/shortages")
            .then((r) => r.json())
            .then((data) => {
                if (isMounted) {
                    setShortages(data);
                }
            })
            .catch(console.error)
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });

        return () => {
            isMounted = false;
        };
    }, []);
    if (loading) return (
        <Loading
            message="Loading"
            className="items-center"
        />
    )

    if (shortages.length === 0) {
        return (
            <div className="bg-white p-6">
                <h1 className="text-xl font-bold mb-4">MRP Analytics</h1>
                <p className="text-gray-500">No shortages to display</p>
            </div>
        );
    }

    return (
        <div className="bg-white p-6">
            <h1 className="text-xl font-bold mb-4">MRP Analytics</h1>

            <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={shortages}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="productName" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="netShortage" fill="#2563eb" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
