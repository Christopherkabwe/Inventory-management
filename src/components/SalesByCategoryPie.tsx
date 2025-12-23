"use client";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { TrendingUp } from 'lucide-react';
import CustomTooltip from "./CustomTooltip";

interface Props {
    categoryData: { category: string; tonnage: number }[];
}

export default function SalesByCategoryPie({ categoryData }: Props) {
    //const COLORS = ['#3b82f6', '#10b981', '#f97316', '#8b5cf6', '#ec4899'];
    const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

    const totalTonnage = categoryData.reduce((sum, item) => sum + item.tonnage, 0);

    return (
        <div>
            {/*<div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                Sales By Category (Year-to-Date)
            </h3>*/}
            <div className="flex justify-center">
                <ResponsiveContainer width="100%" height={200}>
                    <PieChart>
                        <Pie
                            data={categoryData}
                            dataKey="tonnage"
                            nameKey="category"
                            innerRadius={50}
                            outerRadius={80}
                            paddingAngle={4}
                        >
                            {categoryData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-4 text-xs">
                {categoryData.map((entry, index) => (
                    <div key={entry.category} className="flex items-center gap-2">
                        <span
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                        />
                        <span>{`${entry.category} (${((entry.tonnage / totalTonnage) * 100).toFixed(1)}%)`}</span>
                    </div>
                ))}
            </div>
        </div >
    );
}
