"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/Loading";
import { useUser } from "@/app/context/UserContext";
import { useRouter } from "next/navigation";
import StandardPieChart from "@/components/charts/StandardPieChart";
import StandardLineChart from "@/components/charts/StandardLineChart";
import "@/lib/chartsJs";

import StandardBarChart from "../charts/StandardBarChart";
import StandardChartTooltip from "../charts/StandardPieTooltip";

/* ================= TYPES ================= */

type ProductionStatus = "DRAFT" | "CONFIRMED" | "LOCKED";

interface Product {
    id: string;
    name: string;
    sku: string;
}

interface ProductionItem {
    product: Product;
    quantity: number;
}

interface ProductionDefect {
    id: string;
    productId: string;
    quantity: number;
    defectType: string;
    disposition: string;
    reason?: string;
    recordedBy: { fullName: string };
    recordedByName: string;
    createdAt: string;
}

interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    status: ProductionStatus;
    location: { id: string; name: string };
    locationName: string;
    createdBy: { id: string; fullName: string };
    createdByName: string;
    recordedBy: { id: string; fullName: string };
    recordedByName: string;
    createdAt: string;
    items: ProductionItem[];
    defects: ProductionDefect[];
}

interface DefectForm {
    quantity: number;
    defectType: string;
    disposition: string;
    reason: string;
}

/* ================= PAGE ================= */

export default function QualityChartsPage() {
    const [productions, setProductions] = useState<Production[]>([]);
    const [loading, setLoading] = useState(true);

    /* ================= FETCH DATA ================= */

    async function fetchProductions() {
        setLoading(true);
        const res = await fetch("/api/rbac/productions");
        const json = await res.json();
        const productionsUpdated = json.data.map((p: Production) => ({
            ...p,
            locationName: p.location?.name,
            createdByName: p.createdBy?.fullName,
        }));
        setProductions(productionsUpdated);
        setLoading(false);
    }

    useEffect(() => {
        fetchProductions();
    }, []);

    /* ================= FILTERED DATA ================= */
    const allDefects = productions.flatMap((p) =>
        p.defects.map((d) => ({
            ...d,
            productionNo: p.productionNo,
            batchNumber: p.batchNumber,
            recordedByName: d.recordedBy?.fullName,
            productName: p.items.find((i) => i.product.id === d.productId)?.product.name || "-",
        }))
    );

    if (loading) return <Loading message="Loading productions..." />;

    /* ================= REPORT DATA ================= */

    const defectTypes = ["PACKAGING", "CONTAMINATION", "DAMAGED", "OTHER"];
    const defectTypeData = defectTypes.map((type) => ({
        name: type,
        value: allDefects.filter((d) => d.defectType === type).reduce((sum, d) => sum + d.quantity, 0),
    }));

    const dispositionTypes = ["SCRAPPED", "REWORKED", "HELD"];
    const dispositionData = dispositionTypes.map((d) => ({
        name: d,
        value: allDefects.filter((def) => def.disposition === d).reduce((sum, def) => sum + def.quantity, 0),
    }));

    const batchDefectData = productions.map((p) => {
        const totalDefects = p.defects.reduce((s, d) => s + d.quantity, 0);
        const totalProduced = p.items.reduce((s, i) => s + i.quantity, 0);
        return {
            batchNumber: p.batchNumber,
            productionNo: p.productionNo,
            totalDefects,
            defectRate: totalProduced ? parseFloat(((totalDefects / totalProduced) * 100).toFixed(2)) : 0,
        };
    });

    const productDefectData: { name: string; defects: number; defectRate: number }[] = [];
    productions.forEach((p) => {
        p.items.forEach((i) => {
            const existing = productDefectData.find((pd) => pd.name === i.product.name);
            const defectsQty = p.defects
                .filter((d) => d.productId === i.product.id)
                .reduce((s, d) => s + d.quantity, 0);
            if (existing) {
                existing.defects += defectsQty;
                existing.defectRate = existing.defects / (existing.defects + i.quantity) * 100;
            } else {
                productDefectData.push({
                    name: i.product.name,
                    defects: defectsQty,
                    defectRate: i.quantity ? (defectsQty / i.quantity) * 100 : 0,
                });
            }
        });
    });

    const statusData = ["DRAFT", "CONFIRMED", "LOCKED"].map((s) => ({
        name: s,
        value: productions.filter((p) => p.status === s).length,
    }));

    const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#A28BD4", "#FF6666"];

    /* ================= MONTHLY DEFECT TREND ================= */

    const monthlyDefectMap: Record<string, number> = {};

    allDefects.forEach(d => {
        const month = new Date(d.createdAt).toLocaleString("default", {
            year: "numeric",
            month: "short",
        });

        monthlyDefectMap[month] = (monthlyDefectMap[month] || 0) + d.quantity;
    });

    const monthlyDefectTrend = Object.entries(monthlyDefectMap)
        .map(([month, totalDefects]) => ({
            month,
            totalDefects,
        }))
        .sort(
            (a, b) =>
                new Date(`01 ${a.month}`).getTime() -
                new Date(`01 ${b.month}`).getTime()
        );

    /* ================= DAILY DEFECT TREND ================= */

    const dailyDefectMap: Record<string, number> = {};

    allDefects.forEach(d => {
        const day = new Date(d.createdAt).toISOString().split("T")[0]; // YYYY-MM-DD
        dailyDefectMap[day] = (dailyDefectMap[day] || 0) + d.quantity;
    });

    const dailyDefectTrend = Object.entries(dailyDefectMap)
        .map(([date, totalDefects]) => ({
            date,
            totalDefects,
        }))
        .sort(
            (a, b) =>
                new Date(a.date).getTime() - new Date(b.date).getTime()
        );

    /* ================= RENDER ================= */

    return (
        <div className="bg-white space-y-5 rounded-lg mb-5 p-5">
            <div><h2 className="text-xl font-bold mb-3">Quality Control Charts</h2></div>
            <div className="grid grid-cols-3 gap-5 rounded-md">

                {/* Production Status Summary */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Production Status Summary</h3>

                    <StandardPieChart
                        data={[
                            { name: "Draft", value: statusData.find(s => s.name === "DRAFT")?.value || 0, color: "#94a3b8" },
                            { name: "Confirmed", value: statusData.find(s => s.name === "CONFIRMED")?.value || 0, color: "#22c55e" },
                            { name: "Locked", value: statusData.find(s => s.name === "LOCKED")?.value || 0, color: "#dc2626" },
                        ]}
                    />
                </div>
                {/* Defects by Type */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Defects by Type</h3>

                    <StandardPieChart
                        data={[
                            { name: "Packaging", value: defectTypeData.find(d => d.name === "PACKAGING")?.value || 0, color: "#0ea5e9" },
                            { name: "Contamination", value: defectTypeData.find(d => d.name === "CONTAMINATION")?.value || 0, color: "#dc2626" },
                            { name: "Damaged", value: defectTypeData.find(d => d.name === "DAMAGED")?.value || 0, color: "#f97316" },
                            { name: "Other", value: defectTypeData.find(d => d.name === "OTHER")?.value || 0, color: "#a855f7" },
                        ]}
                    />
                </div>

                {/* Defects by Disposition */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Defects by Disposition</h3>

                    <StandardPieChart
                        data={[
                            { name: "Scrapped", value: dispositionData.find(d => d.name === "SCRAPPED")?.value || 0, color: "#dc2626" },
                            { name: "Reworked", value: dispositionData.find(d => d.name === "REWORKED")?.value || 0, color: "#facc15" },
                            { name: "Held", value: dispositionData.find(d => d.name === "HELD")?.value || 0, color: "#0ea5e9" },
                        ]}
                    />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-5 rounded-md">
                {/* Defect Rate by Batch */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Defect Rate by Batch (%)</h3>

                    <StandardLineChart
                        data={batchDefectData}
                        xKey="batchNumber"
                        lines={[
                            {
                                dataKey: "defectRate",
                                name: "Defect Rate %",
                                color: "#8884d8",
                            },
                            {
                                dataKey: "totalDefects",
                                name: "Total Defects",
                                color: "#82ca9d",
                            },
                        ]}
                        tooltip={
                            <StandardChartTooltip
                                total={batchDefectData.reduce(
                                    (sum, d) => sum + (d.defectRate ?? 0),
                                    0
                                )}
                                locale="en-ZM"
                            />
                        }
                    />
                </div>

                {/* Top Defective Products */}
                <StandardBarChart
                    title="Top Defective Products"
                    labels={productDefectData.map(p => p.name)}
                    datasets={[
                        {
                            label: "Total Defects",
                            data: productDefectData.map(p => p.defects),
                            color: "#f97316",
                        },
                        {
                            label: "Defect Rate %",
                            data: productDefectData.map(p => Number(p.defectRate.toFixed(2))),
                            color: "#0ea5e9",
                        },
                    ]}
                />
                {/* Monthly Defects Trend */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Monthly Defects Trend</h3>
                    <p className="text-sm text-gray-500 mb-3">
                        Total defective quantities recorded per month
                    </p>

                    <StandardLineChart
                        data={monthlyDefectTrend}
                        xKey="month"
                        lines={[
                            {
                                dataKey: "totalDefects",
                                name: "Total Defects",
                                color: "#dc2626",
                                strokeWidth: 2.5,
                            },
                        ]}
                        height={320}
                        tooltip={
                            <StandardChartTooltip
                                total={monthlyDefectTrend.reduce(
                                    (sum, d) => sum + (d.totalDefects ?? 0),
                                    0
                                )}
                                locale="en-ZM"
                            />
                        }
                    />
                </div>

                {/* Daily Defects Trend */}
                <div className="bg-white border rounded-md p-5 shadow-sm">
                    <h3 className="font-semibold mb-2">Daily Defects Trend</h3>
                    <p className="text-sm text-gray-500 mb-3">
                        Total defective quantities recorded per day
                    </p>

                    <StandardLineChart
                        data={dailyDefectTrend}
                        xKey="date"
                        lines={[
                            {
                                dataKey: "totalDefects",
                                name: "Total Defects",
                                color: "#ea580c",
                                strokeWidth: 2.5,
                            },
                        ]}
                        height={320}
                        tooltip={
                            <StandardChartTooltip
                                total={dailyDefectTrend.reduce(
                                    (sum, d) => sum + (d.totalDefects ?? 0),
                                    0
                                )}
                                locale="en-ZM"
                            />
                        }
                    />
                </div>
            </div>
        </div >
    );
}


