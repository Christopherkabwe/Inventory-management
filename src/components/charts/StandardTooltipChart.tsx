import { TooltipItem } from "chart.js";
import { detectCurrency, formatCurrency } from "@/lib/utils/currency";

interface StandardTooltipOptions {
    locale?: string;           // e.g., "en-ZM" or "en-US"
    currency?: string;         // override currency
    isCurrency?: boolean;      // whether to show currency
    showPercent?: boolean;     // whether to show percent
}

export function standardChartTooltip({
    locale = "en-US",
    currency,
    isCurrency = false,
    showPercent = true,
}: StandardTooltipOptions = {}) {
    return {
        callbacks: {
            title(items: TooltipItem<"bar" | "line">[]) {
                return items[0]?.label ?? "";
            },

            label(item: TooltipItem<"bar" | "line">) {
                const datasetLabel = item.dataset.label ?? "Value";
                const value = item.parsed.y ?? 0;
                return `${datasetLabel}: ${value.toLocaleString()}`;
            },

            afterLabel(item: TooltipItem<"bar" | "line">) {
                if (!showPercent) return "";

                const dataIndex = item.dataIndex;

                const total = item.chart.data.datasets.reduce((sum, ds, i) => {
                    const meta = item.chart.getDatasetMeta(i);
                    const val = meta.data[dataIndex]?.parsed?.y ?? 0;
                    return sum + val;
                }, 0);

                if (!total) return "";

                const percent = ((item.parsed.y / total) * 100).toFixed(1);
                return `Percent: ${percent}%`;
            },

            footer(items: TooltipItem<"bar" | "line">[]) {
                if (!isCurrency) return "";
                const value = items[0]?.parsed.y ?? 0;
                const detected = detectCurrency({ currency, locale });
                return formatCurrency(value, detected, locale);
            },
        },
    };
}

{/*
    <Bar
  data={{
    labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      backgroundColor: ds.color,
    })),
  }}
  options={{
    plugins: {
      tooltip: standardChartTooltip({ locale: "en-ZM", isCurrency: true }),
      legend: { position: "top" },
    },
  }}
/>

<Line
  data={{
    labels,
    datasets: datasets.map(ds => ({
      label: ds.label,
      data: ds.data,
      borderColor: ds.color,
      backgroundColor: ds.color + "33", // semi-transparent fill for area
      fill: true,                       // area chart
    })),
  }}
  options={{
    plugins: {
      tooltip: standardChartTooltip({ locale: "en-ZM", isCurrency: true }),
      legend: { position: "top" },
    },
  }}
/>

*/}