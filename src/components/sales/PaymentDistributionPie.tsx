"use client";

import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

interface PaymentDistributionPieProps {
    paid: number;
    outstanding: number;
    creditNotes: number;
}

export default function PaymentDistributionPie({ paid, outstanding, creditNotes }: PaymentDistributionPieProps) {
    const total = paid + outstanding + creditNotes || 1; // avoid division by zero

    const data = [
        { name: "Paid", value: paid, color: "#10b981" },
        { name: "Outstanding", value: outstanding, color: "#ef4444" },
        { name: "Credit Notes", value: creditNotes, color: "#f59e0b" },
    ];

    return (
        <div>
            <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                    <Pie
                        data={data}
                        dataKey="value"
                        innerRadius={50}
                        outerRadius={80}
                        paddingAngle={4}
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
