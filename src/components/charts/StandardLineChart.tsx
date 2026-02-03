"use client";

import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

export interface LineConfig {
    dataKey: string;
    name?: string;
    color: string;
    strokeWidth?: number;
    dot?: boolean;
}

interface StandardLineChartProps {
    data: any[];
    xKey: string;
    lines: LineConfig[];
    height?: number;
    tooltip?: React.ReactNode;
}

export default function StandardLineChart({
    data,
    xKey,
    lines,
    height = 300,
    tooltip,
}: StandardLineChartProps) {
    return (
        <ResponsiveContainer width="100%" height={height}>
            <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip content={tooltip as any} />

                {lines.map((line) => (
                    <Line
                        key={line.dataKey}
                        type="monotone"
                        dataKey={line.dataKey}
                        name={line.name}
                        stroke={line.color}
                        strokeWidth={line.strokeWidth ?? 2}
                        dot={line.dot ?? false}
                        activeDot={{ r: 4 }}
                    />
                ))}
            </LineChart>
        </ResponsiveContainer>
    );
}
