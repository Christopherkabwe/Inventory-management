"use client";

import { useState, useEffect } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import PieCard from "./ProductionPieChart";
import { BarChart3, Factory, Package } from "lucide-react";
import ChartDataLabels from "chartjs-plugin-datalabels";
import InventorySummary from "../InventorySummary";
import Loading from "../Loading";


ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    Tooltip,
    Legend,
    ChartDataLabels
);

interface ProductSummary {
    name: string;
    totalQty: number;
    tonnage: number;
    totalValue: number;
}

interface LocationSummary {
    location: string;
    totalQty: number;
    totalTonnage: number;
}
export interface Production {
    id: string;
    productionNo: string;
    batchNumber: string;
    notes?: string;
    createdAt: string;

    location: {
        id: string;
        name: string;
    };

    items: {
        id: string;
        quantity: number;
        product: {
            id: string;
            name: string;
            sku: string;
            category: string;
            packSize: number;
            weightValue: number;
            weightUnit: string;
            price: number;
        };
    }[];

    createdBy: {
        id: string;
        name: string;
        email: string;
    };
}

export const baseBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: { display: false },
        datalabels: {
            anchor: "end",
            align: "top",
            offset: 4,
            font: {
                weight: "bold",
                size: 12,
            },
            formatter: (value: number) => value.toFixed(2),
        },
    },
    scales: {
        x: {
            ticks: { autoSkip: false },
            grid: {
                drawTicks: false,  // optional: remove tick marks
                drawOnChartArea: false, // <--- disables vertical grid lines
            },
        },
        y: {
            beginAtZero: true,
            grid: {
                drawTicks: true,      // keeps horizontal ticks if you want
                drawOnChartArea: true, // keeps horizontal grid lines
            },
            ticks: {
                callback: (v: any) => `${v} t`,
            },
        },
    },
};

const barOptionsNoLabels = {
    ...baseBarOptions,
    plugins: {
        ...baseBarOptions.plugins,
        datalabels: { display: false },
    },
};


function groupProductionByMonth(productions: Production[]) {
    const map: Record<string, number> = {};

    productions.forEach((p) => {
        const date = new Date(p.createdAt);
        const monthKey = date.toLocaleString("default", {
            month: "short",
            year: "numeric",
        }); // e.g., "Jan 2026"

        // Calculate tonnage: weight * packSize * quantity / 1000
        const tonnage = p.items.reduce((sum, item) => {
            return (
                sum +
                (item.product.weightValue *
                    item.product.packSize *
                    item.quantity) /
                1000
            );
        }, 0);

        map[monthKey] = (map[monthKey] || 0) + tonnage;
    });

    // Convert to sorted array
    return Object.entries(map)
        .map(([month, tonnage]) => ({ month, tonnage: Number(tonnage.toFixed(2)) }))
        .sort((a, b) => new Date(a.month).getTime() - new Date(b.month).getTime());
}

function groupProductionByDay(productions: Production[]) {
    const map: Record<string, number> = {};

    productions.forEach((p) => {
        const date = new Date(p.createdAt);
        const dayKey = date.toLocaleDateString("default", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }); // e.g., "14 Jan 2026"

        // Calculate tonnage: weight * packSize * quantity / 1000
        const tonnage = p.items.reduce((sum, item) => {
            return (
                sum +
                (item.product.weightValue *
                    item.product.packSize *
                    item.quantity) /
                1000
            );
        }, 0);

        map[dayKey] = (map[dayKey] || 0) + tonnage;
    });

    return Object.entries(map)
        .map(([day, tonnage]) => ({ day, tonnage: Number(tonnage.toFixed(2)) }))
        .sort((a, b) => new Date(a.day).getTime() - new Date(b.day).getTime());
}


export default function ProductionCharts({
    byProduct,
    byLocation,
}: {
    byProduct: ProductSummary[];
    byLocation: LocationSummary[];
}) {

    const [productions, setProductions] = useState<Production[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // Fetch productions once
    useEffect(() => {
        fetch("/api/rbac/productions")
            .then(res => res.json())
            .then(data => setProductions(data.data || []))
            .catch(err => console.error("Failed to fetch productions", err));
    }, []);

    // Group by month
    const monthlyProductionData = groupProductionByMonth(productions);

    const monthlyTrendData = {
        labels: monthlyProductionData.map(m => m.month),
        datasets: [
            {
                label: "Production (Tonnage)",
                data: monthlyProductionData.map(m => m.tonnage),
                backgroundColor: "#2563eb",
                borderRadius: 6,
            },
        ],
    };

    const dailyProductionData = groupProductionByDay(productions);

    const dailyTrendData = {
        labels: dailyProductionData.map(d => d.day),
        datasets: [
            {
                label: "Production (Tonnage)",
                data: dailyProductionData.map(d => d.tonnage),
                backgroundColor: "#10b981", // green
                borderRadius: 6,
            },
        ],
    };


    /* ---------------- Product Quantity Chart ---------------- */
    const productQtyData = {
        labels: byProduct.map(p => p.name),
        datasets: [
            {
                label: "Total Quantity",
                data: byProduct.map(p => p.totalQty),
                backgroundColor: "#2563eb",
            },
        ],
    };

    /* ---------------- Product Value Chart ---------------- */
    const productValueData = {
        labels: byProduct.map(p => p.name),
        datasets: [
            {
                label: "Total Value",
                data: byProduct.map(p => p.totalValue),
                backgroundColor: "#16a34a",
            },
        ],
    };

    /* ---------------- Location Tonnage Pie ---------------- */
    const locationTonnageData = {
        labels: byLocation.map(l => l.location),
        datasets: [
            {
                data: byLocation.map(l => l.totalTonnage),
                backgroundColor: [
                    "#2563eb",
                    "#16a34a",
                    "#dc2626",
                    "#ca8a04",
                    "#7c3aed",
                ],
            },
        ],
    };

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Tonnage by Location */}
                <div className="bg-white p-4 border rounded">
                    <h3 className="font-semibold mb-3">
                        <Factory className="inline-block h-5 w-5 mr-2 text-blue-600" />
                        Production by Location (Tonage)
                    </h3>
                    <div className="h-[300px]">
                        <Bar data={locationTonnageData} options={baseBarOptions} />
                    </div>
                </div>

                {/* Quantity by Product */}
                <div className="bg-white p-4 border rounded">
                    <h3 className="font-semibold mb-3">
                        <Factory className="inline-block h-5 w-5 mr-2 text-blue-600" />
                        Production by Product (Quantity)
                    </h3>
                    <div className="h-[300px]">
                        <Bar data={productQtyData} options={baseBarOptions} />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="bg-white p-4 border rounded">
                    <h3 className="font-semibold mb-3">
                        <BarChart3 className="inline-block h-5 w-5 mr-2 text-blue-600" />
                        Monthly Production Trend (Tonnage)</h3>
                    <div className="h-[320px]">
                        <Bar
                            data={monthlyTrendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    datalabels: {
                                        anchor: "end",
                                        align: "top",
                                        formatter: (v: number) => `${v.toFixed(2)} MT`,
                                        font: { size: 11 },
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: { autoSkip: false },
                                        grid: { drawOnChartArea: false }, // <-- remove vertical grid lines
                                    },
                                    y: {
                                        beginAtZero: true,
                                        suggestedMax: Math.max(...monthlyTrendData.datasets[0].data) * 1.1,
                                        ticks: { callback: (v: any) => `${v} MT` },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
                <div className="bg-white p-4 border rounded">
                    <h3 className="font-semibold mb-3">
                        <BarChart3 className="inline-block h-5 w-5 mr-2 text-blue-600" />
                        Production Trend (Tonnage)</h3>
                    <div className="h-[320px] overflow-x-auto">
                        <Bar
                            data={dailyTrendData}
                            options={{
                                responsive: true,
                                maintainAspectRatio: false,
                                plugins: {
                                    legend: { display: false },
                                    datalabels: {
                                        anchor: "end",
                                        align: "top",
                                        formatter: (v: number) => `${v.toFixed(2)} MT`,
                                        font: { size: 11 },
                                    },
                                },
                                scales: {
                                    x: {
                                        ticks: { autoSkip: false },
                                        grid: { drawOnChartArea: false }, // <-- remove vertical grid lines
                                    },
                                    y: {
                                        beginAtZero: true,
                                        suggestedMax: Math.max(...dailyTrendData.datasets[0].data) * 1.1,
                                        ticks: { callback: (v: any) => `${v} MT` },
                                    },
                                },
                            }}
                        />
                    </div>
                </div>
            </div>
            {/* Tonnage by Location */}
            <div className="p-4 rounded grid grid-cols-1 xl:grid-cols-2 gap-5">
                <PieCard
                    title="Production by Location (Tonnage)"
                    icon={<Factory className="h-5 w-5 text-blue-600" />}
                    data={byLocation}
                    dataKey="totalTonnage"
                    nameKey="location"
                />

                <PieCard
                    title="Production by Product (Tonnage)"
                    icon={<Package className="h-5 w-5 text-green-600" />}
                    data={byProduct}
                    dataKey="tonnage"
                    nameKey="name"
                />
            </div>
        </div>
    );
};
