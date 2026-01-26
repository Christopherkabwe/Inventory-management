"use client";

import { Bar } from "react-chartjs-2";

interface GenericBarChartProps {
    title: string;
    labels: string[];
    values: number[];
    color: string;
}

export default function GenericBarChart({
    title,
    labels,
    values,
    color,
}: GenericBarChartProps) {
    const isVertical = labels.length >= 6;

    return (
        <div className="p-4 bg-white shadow rounded h-[340px] overflow-hidden">
            <h3 className="mb-2 font-bold">{title}</h3>

            <Bar
                data={{
                    labels,
                    datasets: [{ label: title, data: values, backgroundColor: color }],
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    layout: {
                        padding: {
                            bottom: isVertical ? 30 : 12,
                            left: 14,
                            right: 14,
                        },
                    },
                    scales: {
                        x: {
                            grid: { display: false },
                            ticks: {
                                maxRotation: isVertical ? 90 : 0,
                                minRotation: isVertical ? 90 : 0,
                                font: { size: 11 },
                            },
                        },
                        y: {
                            grid: { display: false },
                            ticks: { font: { size: 11 } },
                        },
                    },
                }}
            />
        </div>
    );
}
