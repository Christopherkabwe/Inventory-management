import { format } from "date-fns";

type ViewMode = "weekly" | "monthly" | "yearly";

export function aggregateSales(
    sales: any[],
    view: ViewMode,
    accessor: (sale: any) => number
) {
    const map = new Map<string, number>();

    sales.forEach(sale => {
        if (!sale.saleDate) return;

        const date = new Date(sale.saleDate);
        let key = "";

        if (view === "weekly") {
            key = `${format(date, "yyyy")}-W${format(date, "II")}`;
        } else if (view === "monthly") {
            key = format(date, "yyyy-MM");
        } else {
            key = format(date, "yyyy");
        }

        map.set(key, (map.get(key) || 0) + accessor(sale));
    });

    return Array.from(map.entries())
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([label, value]) => ({ label, value }));
}
