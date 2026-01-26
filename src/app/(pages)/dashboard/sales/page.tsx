import { getCurrentUser } from "@/lib/auth";
import SalesTrendChart from "@/components/sales/SalesTrendChart";
import DashboardLayout from "@/components/DashboardLayout";
import { redirect } from "next/navigation"
import { fetchDashboardData } from "@/lib/fetchData";
import {
    TotalSalesKPI,
    TotalOrdersKPI,
    TonnageYTDKPI,
    AvgOrderValueKPI,
    SalesVelocityKPI,
    AvgItemsPerOrderKPI,
    CancelledOrdersKPI,

    TonnageFTDKPI,
    TonnageWTDKPI,
    TonnageMTDKPI,

    TotalCustomersKPI,
    RepeatCustomerRateKPI,
    NewCustomers30DaysKPI,
    CustomerChurnRateKPI,

    TopLocationKPI,

    PendingOrdersKPI,
    PartiallyFilledOrdersKPI,
    PendingQuotationsKPI,
    RejectedQuotationsKPI,
    MTDReturnsKPI,
    PendingTransfersKPI,
} from "@/components/kpi"
import RecentSales from "@/components/sales/RecentSales";
import SalesTable from "@/components/sales/SalesTable";

export const metadata = {
    title: "Sales Dashboard",
};

export default async function SalesDashboardPage() {
    const user = await getCurrentUser();
    if (!user) {
        redirect("/sign-in");
    }

    const kpis = await fetchDashboardData();

    return (
        <>
            <div className="w-full">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Sales Dashboard</h1>
                    <p className="text-gray-500 mt-1 mb-2">Track your sales performance and trends</p>
                </div>
                {/* KPIs */}
                <div className="grid grid-cols-2 md:grid-cols-6 gap-2 mb-2 text-black">
                    <TotalSalesKPI value={kpis.totalSales} />
                    <TotalOrdersKPI value={kpis.totalOrders} />
                    <AvgOrderValueKPI value={kpis.avgOrderValue} />
                    <SalesVelocityKPI value={kpis.salesVelocity} />
                    <AvgItemsPerOrderKPI value={kpis.avgItemsPerOrder} />
                    <CancelledOrdersKPI value={kpis.cancelledOrders} />

                    <TonnageFTDKPI value={kpis.tonnageFTD} />
                    <TonnageWTDKPI value={kpis.tonnageWTD} />
                    <TonnageMTDKPI value={kpis.tonnageMTD} />
                    <TonnageYTDKPI value={kpis.tonnageYTD} />

                    <TotalCustomersKPI value={kpis.totalCustomers} />
                    <RepeatCustomerRateKPI value={kpis.repeatCustomerRate} />
                    <NewCustomers30DaysKPI value={kpis.newCustomers30Days} />
                    <CustomerChurnRateKPI value={kpis.customerChurnRate} />

                    <TopLocationKPI value={kpis.topLocation} />

                    <PendingOrdersKPI value={kpis.pendingOrders} />
                    <PartiallyFilledOrdersKPI value={kpis.partiallyFilledOrders} />
                    <PendingQuotationsKPI value={kpis.pendingQuotations} />
                    <RejectedQuotationsKPI value={kpis.rejectedQuotations} />
                    <MTDReturnsKPI value={kpis.mtdReturns} />
                    {/*<PendingTransfersKPI value={kpis.transfersPending} />*/}

                </div>
                {/* Main Grid */}
                <div>
                    <SalesTrendChart />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-5">
                    <SalesTable />
                </div>
                <RecentSales />
            </div >
        </ >

    );
}

/* -----------------------------
   REUSABLE COMPONENTS
----------------------------- */
const iconColors = {
    purple: "text-purple-600",
    green: "text-green-600",
    yellow: "text-yellow-500",
    red: "text-red-600",
    blue: "text-blue-600",
};

const bgColors = {
    purple: "bg-purple-500",
    green: "bg-green-500",
    yellow: "bg-yellow-400",
    red: "bg-red-500",
    blue: "bg-blue-500",
};

type Color = keyof typeof iconColors;

interface Props {
    title: string;
    value: string;
    icon: React.ReactNode;
    color: Color;
}

function KPI({ title, value, icon, color }: Props) {
    return (
        <div className="bg-white p-2 rounded-xl border flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-xl font-bold">{value}</h2>
            </div>

            {/* Icon */}
            <div
                className={`${iconColors[color]}`}
            >
                {icon}
            </div>
        </div>
    );
}