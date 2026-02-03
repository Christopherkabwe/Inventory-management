"use client";

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import StandardChartTooltip from "./StandardPieTooltip";

export interface PieDatum {
    name: string;
    value: number;
    color: string;
}

interface StandardPieChartProps {
    data: PieDatum[];
    title?: string;  // optional title
}

export default function StandardPieChart({ data, title }: StandardPieChartProps) {
    const total = data.reduce((s, d) => s + d.value, 0);

    return (
        <div>
            {/* Optional title */}
            {title && <h3 className="mb-2 font-semibold text-left">{title}</h3>}

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
                    <Tooltip
                        content={
                            <StandardChartTooltip total={total} locale="en-ZM" />
                        }
                    />
                </PieChart>
            </ResponsiveContainer>

            {/* Legend */}
            <div className="flex justify-center gap-6 mt-4 text-sm flex-wrap">
                {data.map(d => (
                    <div key={d.name} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: d.color }}
                        />
                        <span>
                            {d.name} ({total ? Math.round((d.value / total) * 100) : 0}%)
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}
