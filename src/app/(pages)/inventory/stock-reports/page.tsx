// app/inventory/stock-reports/page.tsx
import DashboardLayout from "@/components/DashboardLayout";
import StockReportTable from "@/components/inventory/StockReportTable"; // client component for sorting/export
import { getStockReport, StockReportRow } from "@/lib/stockReport";

export default async function StockReportPage() {
    const report: StockReportRow[] = await getStockReport(); // server-side
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Stock Report</h1>
            <p className="mb-5">
                Overview of current stock levels, movements, and key inventory trends to support management
                decision-making.
            </p>
            <StockReportTable report={report} /> {/* client component */}
        </div>
    );
}
