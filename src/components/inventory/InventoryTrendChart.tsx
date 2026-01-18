"use client";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TrendingUp } from 'lucide-react';

interface ChartDataPoint {
    date: string;
    value: number; // inventory value
}

interface Props {
    data: ChartDataPoint[];
}

export default function InventoryTrendChart({ data }: Props) {
    if (!data.length) {
        return <p>No inventory data available.</p>;
    }

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" /> Inventory Value Trend
            </h3>
            <h4 className="text-sm font-medium text-gray-500 mb-2">Value (K)</h4>
            <ResponsiveContainer width="100%" height={200}>
                <LineChart data={data}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`K${value}`, 'Inventory Value']} />
                    <Line type="monotone" dataKey="value" stroke="#10b981" strokeWidth={2} />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
