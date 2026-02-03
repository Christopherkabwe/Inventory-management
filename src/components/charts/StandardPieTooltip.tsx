import React from "react";
import { detectCurrency, formatCurrency } from "@/lib/utils/currency";

export interface TooltipMetric {
    key: string;
    label?: string;
    isCurrency?: boolean;
    showPercent?: boolean;
}

interface StandardChartTooltipProps {
    active?: boolean;
    payload?: any[];
    label?: string;
    total?: number;
    titleKey?: string;
    locale?: string;
    currency?: string;
    metrics?: TooltipMetric[];
}

const humanize = (key: string) =>
    key
        .replace(/_/g, " ")
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\b\w/g, (l) => l.toUpperCase());

const StandardChartTooltip = ({
    active,
    payload,
    label,
    total,
    titleKey = "name",
    locale = "en-US",
    currency,
    metrics,
}: StandardChartTooltipProps) => {
    if (!active || !payload?.length) return null;

    const entry = payload[0];
    const data = entry.payload ?? {};
    const color = entry.color ?? entry.fill;

    const detectedCurrency = detectCurrency({
        currency,
        symbol: entry.unit,
        locale,
    });

    // 🔹 AUTO-DERIVE METRICS IF NONE PROVIDED
    const resolvedMetrics: TooltipMetric[] =
        metrics ??
        Object.keys(data)
            .filter(
                (key) =>
                    typeof data[key] === "number" &&
                    key !== "percent"
            )
            .map((key) => ({
                key,
                label: humanize(key),
                showPercent: true,
            }));

    return (
        <div className="bg-white border rounded-lg shadow-md px-4 py-3 text-sm min-w-[190px]">
            {/* Title */}
            <div className="flex items-center gap-2 mb-2">
                {color && (
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: color }}
                    />
                )}
                <span className="font-semibold">
                    {data[titleKey] ?? label}
                </span>
            </div>

            {/* Metrics */}
            <div className="space-y-1">
                {resolvedMetrics.map((metric) => {
                    const value = data[metric.key];
                    if (value == null) return null;

                    const percent =
                        metric.showPercent && total
                            ? (value / total) * 100
                            : null;

                    return (
                        <div key={metric.key} className="space-y-1">
                            {/* Value row */}
                            <div className="flex justify-between gap-4">
                                <span className="text-gray-500">
                                    {metric.label ?? metric.key}
                                </span>
                                <span className="font-medium text-right">
                                    {metric.isCurrency
                                        ? formatCurrency(
                                            value,
                                            detectedCurrency,
                                            locale
                                        )
                                        : value.toLocaleString()}
                                </span>
                            </div>

                            {/* Percent row */}
                            {percent !== null && (
                                <div className="flex justify-between gap-4">
                                    <span className="text-gray-400">
                                        Percent
                                    </span>
                                    <span className="text-gray-500 text-right">
                                        {percent.toFixed(1)}%
                                    </span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default StandardChartTooltip;


{/*
    1) Generic usage (no metrics needed)
   <Tooltip
    content={
        <StandardChartTooltip total={total} locale="en-ZM" />
    }
/>

2) Optional custom metrics / currency override

<Tooltip
    content={
        <StandardChartTooltip
            locale="en-US"
            metrics={[
                { key: "revenue", label: "Revenue", isCurrency: true },
            ]}
        />
    }
/>


*/}