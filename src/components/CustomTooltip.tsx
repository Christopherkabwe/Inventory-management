import React from 'react';
import { TooltipProps } from 'recharts';

interface CustomTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    labels?: {
        titleKey?: string;
        metrics?: { key: string; label: string; format?: (value: number | undefined) => string }[];
    };
}

const CustomTooltip = ({
    active,
    payload,
    label,
    labels = {
        titleKey: 'category',
        metrics: [
            { key: 'tonnage', label: 'Tonnage', format: (v) => `${v?.toFixed(2)} tons` },
            { key: 'salesValue', label: 'Sales Value', format: (v) => `K${v?.toFixed(2)}` },
            { key: 'quantity', label: 'Quantity', format: (v) => `${v} units` },
        ],
    },
}: CustomTooltipProps) => {
    if (active && payload && payload.length) {
        const data = payload[0].payload as Record<string, number | undefined>;
        return (
            <div className="bg-white p-3 border rounded shadow text-sm">
                <p className="font-bold">{data[labels.titleKey!] || label}</p>
                {labels.metrics?.map((metric) => (
                    <p key={metric.key}>
                        {metric.label}: {data[metric.key] !== undefined ? (metric.format ? metric.format(data[metric.key]) : data[metric.key]) : 'N/A'}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default CustomTooltip;