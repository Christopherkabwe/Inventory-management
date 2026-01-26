"use client";

import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Tooltip,
    Legend,
} from "chart.js";
import { format, parse } from "date-fns";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface Dataset {
    label: string;
    data: number[];
    backgroundColor: string;
}

interface MonthlySalesChartProps {
    data: {
        labels: string[]; // expects YYYY-MM
        datasets: Dataset[];
    } | null;
    title?: string;
}

export default function MonthlySalesChart({
    data,
    title = "Monthly Sales Overview",
}: MonthlySalesChartProps) {
    if (!data) {
        return <div className="p-4 bg-white shadow rounded">Loading chart...</div>;
    }

    // 🔹 Determine label rotation
    const isVertical = data.labels.length >= 6;

    // 🔹 Format labels: 2026-01 → Jan 2026
    const formattedData = {
        ...data,
        labels: data.labels.map(label =>
            format(parse(label, "yyyy-MM", new Date()), "MMM yy")
        ),
    };

    return (
        <div className="p-4 bg-white shadow rounded h-[340px] overflow-hidden">
            <h3 className="mb-2 font-bold">{title}</h3>

            <Bar
                data={formattedData}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,

                    layout: {
                        padding: {
                            left: 14,
                            right: 14,
                            top: 8,
                            bottom: isVertical ? 28 : 12,
                        },
                    },

                    plugins: {
                        legend: {
                            position: "top",
                            labels: { boxWidth: 12 },
                        },
                    },

                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                maxRotation: isVertical ? 60 : 0,
                                minRotation: isVertical ? 60 : 0,
                                padding: 6,
                                font: { size: 11 },
                            },
                        },
                        y: {
                            grid: { display: false },
                            ticks: {
                                padding: 8,
                                font: { size: 11 },
                            },
                        },
                    },
                }}
            />
        </div>
    );
}
