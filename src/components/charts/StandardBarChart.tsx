"use client";

import { Bar } from "react-chartjs-2";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { standardChartTooltip } from "./StandardTooltipChart";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ChartDataLabels);


interface BarDataset {
    label: string;
    data: number[];
    color: string;
}

interface StandardBarChartProps {
    title: string;
    labels: string[];
    datasets: BarDataset[];
}

export default function StandardBarChart({
    title,
    labels,
    datasets,
}: StandardBarChartProps) {
    const isVertical = labels.length >= 6;

    return (
        <div className="p-5 bg-white rounded-lg shadow h-[380px] overflow-hidden">
            <h3 className="mb-2 font-bold">{title}</h3>

            <Bar
                data={{
                    labels,
                    datasets: datasets.map(ds => ({
                        label: ds.label,
                        data: ds.data,
                        backgroundColor: ds.color,
                    })),
                }}
                options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: { position: "top" },
                        tooltip: standardChartTooltip({ locale: "en-ZM", showPercent: true, isCurrency: false }),
                        datalabels: {
                            anchor: "end",       // 'end' puts the label at the top of the bar
                            align: "end",        // 'end' aligns above the bar
                            color: "#000",
                            font: { weight: "bold", size: 12 },
                            formatter: (value: number) => value.toLocaleString(),
                            clamp: true,         // ensures label stays within chart area
                            offset: -4,          // moves the label slightly inside the bar
                        },
                    },
                    layout: {
                        padding: {
                            bottom: isVertical ? 30 : 12,
                            left: 14,
                            right: 14,
                        },
                    },
                    scales: {
                        x: { grid: { display: false }, ticks: { maxRotation: isVertical ? 60 : 0, minRotation: isVertical ? 60 : 0, font: { size: 11 } } },
                        y: { beginAtZero: true, grid: { display: false }, ticks: { font: { size: 11 } } },
                    },
                }}
            />
        </div>
    );
}
