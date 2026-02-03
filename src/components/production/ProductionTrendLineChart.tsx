import { useMemo, useState } from "react";
import StandardLineChart from "../charts/StandardLineChart";
import StandardChartTooltip from "../charts/StandardPieTooltip";
import { LineConfig } from "../charts/StandardLineChart";
type ViewMode = "daily" | "monthly" | "yearly";

interface TrendPoint {
    date: string;
    tonnage: number;
}

export default function ProductionTrend({
    data,
    title,
}: {
    data: TrendPoint[];
    title: string;
}) {
    const [view, setView] = useState<ViewMode>("monthly");

    // Aggregate data by view
    const aggregatedData = useMemo(() => {
        const map = new Map<string, TrendPoint>();

        data.forEach(d => {
            const date = new Date(d.date);
            let key = "";
            if (view === "daily") key = date.toLocaleDateString("en-CA");
            else if (view === "monthly") key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
            else key = `${date.getFullYear()}`;

            if (!map.has(key)) map.set(key, { date: key, tonnage: 0 });
            const acc = map.get(key)!;
            acc.tonnage += d.tonnage;
        });

        return Array.from(map.values()).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [data, view]);

    const lines: LineConfig[] = [
        { dataKey: "tonnage", name: "Tonnage", color: "#2563eb", strokeWidth: 2, dot: false }
    ];

    return (
        <div className="bg-white p-5 rounded-lg shadow">
            <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">{title}</h3>
                <select value={view} onChange={e => setView(e.target.value as ViewMode)} className="border rounded px-2 py-1 text-xs">
                    <option value="daily">Daily</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                </select>
            </div>

            <StandardLineChart
                data={aggregatedData}
                xKey="date"
                lines={lines}
                height={305}
                tooltip={<StandardChartTooltip />}
            />
        </div>
    );
}
