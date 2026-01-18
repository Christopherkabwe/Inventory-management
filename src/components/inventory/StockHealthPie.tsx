"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

export default function StockHealthPie({ inStock, lowStock, outOfStock }: any) {
    const total = inStock + lowStock + outOfStock;

    const data = [
        { name: "In Stock", value: inStock, color: "#16a34a" },
        { name: "Low Stock", value: lowStock, color: "#facc15" },
        { name: "Out of Stock", value: outOfStock, color: "#dc2626" },
    ];

    return (
        <div className="">
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
                    //label={({ name, value }) => `${name} (${Math.round((value / total) * 100)}%)`}
                    >
                        {data.map((d, i) => (
                            <Cell key={i} fill={d.color} />
                        ))}
                    </Pie>
                </PieChart>
            </ResponsiveContainer>

            {/* LEGEND WITH PERCENTAGES */}
            <div className="flex justify-center gap-6 mt-4 text-sm">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: d.color }}
                        />
                        <span>{`${d.name} (${Math.round((d.value / total) * 100)}%)`}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}
