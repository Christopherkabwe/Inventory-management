import { format, parse } from "date-fns";

export function formatChartLabel(label: string, view: "weekly" | "monthly" | "yearly") {
    if (view === "yearly") return label;

    if (view === "monthly") {
        return format(parse(label, "yyyy-MM", new Date()), "MMM yyyy");
    }

    // weekly → 2026-W05 → W05 2026
    const [year, week] = label.split("-W");
    return `W${week} ${year}`;
}
