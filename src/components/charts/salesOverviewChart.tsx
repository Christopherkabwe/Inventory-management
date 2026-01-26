import { useMemo } from "react";
import { aggregateSales } from "@/lib/charts/aggregateSales";
import { formatChartLabel } from "@/lib/charts/formatChartLabels";
import GenericBarChart from "@/components/charts/GenericBarChart";

export default function SalesOverviewChart({
    sales,
    view,
}: {
    sales: any[];
    view: "weekly" | "monthly" | "yearly";
}) {
    const data = useMemo(
        () =>
            aggregateSales(sales, view, sale =>
                sale.items.reduce((a: number, i: any) => a + i.total, 0)
            ),
        [sales, view]
    );

    return (
        <GenericBarChart
            title={`Sales (${view})`}
            labels={data.map(d => formatChartLabel(d.label, view))}
            values={data.map(d => d.value)}
            color="#2563eb"
        />
    );
}
