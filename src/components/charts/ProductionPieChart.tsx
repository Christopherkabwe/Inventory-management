"use client";

import { ReactNode } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

interface PieCardProps<T> {
    title: string;
    icon?: ReactNode;
    data: T[];
    dataKey: keyof T;
    nameKey: keyof T;
    loading?: boolean;
    colors?: string[];
    tooltipFormatter?: (value: number, name: string) => string;
    showLegend?: boolean;
}

export default function PieCard<T extends Record<string, any>>({
    title,
    icon,
    data,
    dataKey,
    nameKey,
    loading,
    showLegend = true,
    colors = [
        "#2563eb",
        "#16a34a",
        "#f59e0b",
        "#ef4444",
        "#8b5cf6",
        "#ec4899",
    ],
    tooltipFormatter,
}: PieCardProps<T>) {
    const total = data.reduce(
        (s, d) => s + Number(d[dataKey] ?? 0),
        0
    );

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex flex-col h-full">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                {icon}
                {title}
            </h3>

            <div className="relative flex-1">
                {loading ? (
                    <div className="flex justify-center items-center h-[250px]">
                        Loading...
                    </div>
                ) : (
                    <div className="h-[260px] flex flex-col">
                        {/* Chart */}
                        <div className="flex justify-center items-center flex-1">
                            <ResponsiveContainer width="100%" height={200}>
                                <PieChart>
                                    <Pie
                                        data={data}
                                        dataKey={dataKey as string}
                                        nameKey={nameKey as string}
                                        innerRadius={50}
                                        outerRadius={80}
                                        paddingAngle={4}
                                    >
                                        {data.map((_, i) => (
                                            <Cell
                                                key={i}
                                                fill={colors[i % colors.length]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip
                                        formatter={
                                            tooltipFormatter
                                                ? tooltipFormatter
                                                : (v: number) =>
                                                    `${v.toFixed(2)}`
                                        }
                                    />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Legend */}
                        {showLegend && (
                            <div className="flex flex-wrap justify-center gap-2 mt-1 text-xs max-h-[100px] overflow-y-auto">
                                {data.map((d, i) => (
                                    <div
                                        key={String(d[nameKey])}
                                        className="flex items-center gap-2"
                                    >
                                        <span
                                            className="w-2 h-2 rounded-full"
                                            style={{
                                                backgroundColor: colors[i % colors.length],
                                            }}
                                        />
                                        <span>
                                            {String(d[nameKey])} (
                                            {total
                                                ? (
                                                    (Number(d[dataKey]) / total) * 100
                                                ).toFixed(1)
                                                : 0}
                                            %)
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

{/* ---------------- Use case ---------------- */ }
{/*
                <PieCard
                    title="Sales by Category"
                    icon={<ShoppingCart className="h-5 w-5 text-purple-600" />}
                    data={categoryData}
                    dataKey="tonnage"
                    nameKey="category"
                />

                <PieCard
                    title="Inventory Distribution"
                    icon={<Boxes className="h-5 w-5 text-orange-600" />}
                    data={inventoryData}
                    dataKey="quantity"
                    nameKey="product"
                />


                <PieCard
                    title="Revenue Share"
                    icon={<DollarSign className="h-5 w-5 text-emerald-600" />}
                    data={revenueData}
                    dataKey="amount"
                    nameKey="source"
                    tooltipFormatter={(v) => `K ${v.toLocaleString()}`}
                />


*/}

