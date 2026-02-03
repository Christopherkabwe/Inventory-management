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
import Loading from "../Loading";
import StandardBarChart from "./StandardBarChart";
import StandardPieChart from "./StandardPieChart";
import ProductionTrendLineChart from "../production/ProductionTrendLineChart";


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
        setLoading(true);
        fetch("/api/rbac/productions")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data.data)) {
                    setProductions(data.data);
                } else {
                    setProductions([]);
                }
            })
            .catch(err => {
                console.error("Failed to fetch productions", err);
                setProductions([]);
            })
            .finally(() => {
                setLoading(false);
            });
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

    if (loading) return <Loading message="Loading productions..." />;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Tonnage by Location */}
                <div className="bg-white p-4 border rounded">
                    <StandardBarChart
                        title="Production by Location (Tonnage)"
                        labels={byLocation.map(l => l.location)}
                        datasets={[
                            {
                                label: "Tonnage",
                                data: byLocation.map(l => l.totalTonnage),
                                color: "#2563eb",
                            },
                        ]}
                    />
                </div>

                {/* Quantity by Product */}
                <div className="bg-white p-4 border rounded">
                    <StandardBarChart
                        title="Production by Product (Quantity)"
                        labels={byProduct.map(p => p.name)}
                        datasets={[
                            {
                                label: "Quantity",
                                data: byProduct.map(p => p.totalQty),
                                color: "#2563eb",
                            },
                        ]}
                    />
                </div>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="bg-white">
                    <StandardBarChart
                        title="Monthly Production Trend (Tonnage)"
                        labels={monthlyTrendData.labels}
                        datasets={[
                            {
                                label: "Tonnage",
                                data: monthlyTrendData.datasets[0].data,
                                color: "#2563eb",
                            },
                        ]}
                    />
                </div>
                <div className="bg-white">
                    <ProductionTrendLineChart
                        title="Production Trend (Tonnage)"
                        data={productions.map(p => {
                            const tonnage = p.items.reduce((sum, item) => {
                                return sum + (item.product.weightValue * item.product.packSize * item.quantity) / 1000;
                            }, 0);
                            return { date: p.createdAt, tonnage };
                        })}
                    />
                </div>
            </div>
            {/* Tonnage by Location */}
            <div className="p-4 rounded grid grid-cols-1 xl:grid-cols-2 gap-5">
                <div className="bg-white p-4 border rounded">
                    <StandardPieChart
                        title="Production by Location (Tonnage)"
                        data={byLocation.map(l => ({
                            name: l.location,
                            value: l.totalTonnage,
                            color: ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"][byLocation.indexOf(l)],
                        }))}
                    />
                </div>
                <div className="bg-white p-4 border rounded">
                    <StandardPieChart
                        title="Production by Product (Tonnage)"
                        data={byProduct.map(p => ({
                            name: p.name,
                            value: p.tonnage,
                            color: ["#2563eb", "#16a34a", "#dc2626", "#ca8a04", "#7c3aed"][byProduct.indexOf(p)],
                        }))}
                    />
                </div>
            </div>
        </div>
    );
};
