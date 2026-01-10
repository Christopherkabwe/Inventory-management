import React from "react";

const iconColors = {
    purple: "text-purple-600",
    green: "text-green-600",
    yellow: "text-yellow-500",
    red: "text-red-600",
    blue: "text-blue-600",
    orange: "text-orange-600",
    teal: "text-teal-600",
    indigo: "text-indigo-600",
    emerald: "text-emerald-600",
    amber: "text-amber-600",
};

export type KPIColor = keyof typeof iconColors;

interface KPIProps {
    title: string;
    value: number | string;
    icon: React.ReactNode;
    color: KPIColor;
}

export function KPI({ title, value, icon, color }: KPIProps) {
    return (
        <div className="bg-white p-2 rounded-xl border flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-xl font-bold">{value}</h2>
            </div>

            <div className={iconColors[color]}>
                {icon}
            </div>
        </div>
    );
}
