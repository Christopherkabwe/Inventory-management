import React from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { fetchKPIs } from "@/components/kpi/calcKPIs";
import { getCurrentUser } from "@/lib/auth";
import {
    // Sales KPIs
    TotalSalesKPI,
    TotalOrdersKPI,
    AvgOrderValueKPI,
    YoYGrowthKPI,
    MonthlyGrowthKPI,
    SalesVelocityKPI,
    AvgItemsPerOrderKPI,
    CancelledOrdersKPI,
    TopSellingProductKPI,
    LeastSellingProductKPI,

    // Customer KPIs
    TotalCustomersKPI,
    RevenuePerCustomerKPI,
    RepeatCustomerRateKPI,
    NewCustomersKPI,
    CustomerChurnRateKPI,
    CustomerLifetimeValueKPI,

    // Location / Operations KPIs
    TopLocationKPI,
    OrdersPerLocationKPI,
    FulfillmentRateKPI,
    AvgDeliveryTimeKPI,

    // Inventory / Product KPIs
    TonnageSoldKPI,
    LowStockItemsKPI,
    ExpiredProductsKPI,
    DamagedStockKPI,
    StockRiskKPI,
    StockTurnoverRateKPI,

    TotalUsersKPI,
    ActiveUsersKPI,
    TotalProductsKPI,
    TotalTransportersKPI,
    PendingOrdersKPI,
    PartiallyFilledOrdersKPI,
    DailyDeliveriesKPI,
    WeeklyDeliveriesKPI,
    SalesFTDKPI,
    SalesWTDKPI,
    SalesMTDKPI,
    SalesYTDKPI,
    TonnageFTDKPI,
    TonnageWTDKPI,
    TonnageMTDKPI,
    TonnageYTDKPI,
    PendingQuotationsKPI,
    RejectedQuotationsKPI,
    MTDReturnsKPI,
    TransfersPendingKPI,
    TotalProductionKPI
} from "@/components/kpi/kpis";

export default async function KeyPerformanceMetrics() {
    const user = await getCurrentUser();

    if (!user) {
        throw new Error("Unauthorized");
    }

    const kpis = await fetchKPIs(user);

    return (
        <div>
            <div className="grid grid-cols-2 xl:grid-cols-6 gap-3 mb-5">

                {/* ================= SALES KPIs ================= */}
                <TotalSalesKPI value={kpis.totalSales} />
                <TotalOrdersKPI value={kpis.totalOrders} />
                <AvgOrderValueKPI value={kpis.avgOrderValue} />
                <YoYGrowthKPI value={kpis.yoyGrowth} />
                <MonthlyGrowthKPI value={kpis.monthlyGrowth} />
                <SalesVelocityKPI value={kpis.salesVelocity} />
                <AvgItemsPerOrderKPI value={kpis.avgItemsPerOrder} />
                <CancelledOrdersKPI value={kpis.cancelledOrders} />
                <TopSellingProductKPI value={kpis.topSellingProduct} />
                <LeastSellingProductKPI value={kpis.leastSellingProduct} />

                {/* ================= CUSTOMER KPIs ================= */}
                <TotalCustomersKPI value={kpis.totalCustomers} />
                <RevenuePerCustomerKPI value={kpis.revenuePerCustomer} />
                <RepeatCustomerRateKPI value={kpis.repeatCustomerRate} />
                <NewCustomersKPI value={kpis.newCustomers30Days} />
                <CustomerChurnRateKPI value={kpis.customerChurnRate} />
                <CustomerLifetimeValueKPI value={kpis.customerLifetimeValue} />

                {/* ================= LOCATION / OPERATIONS KPIs ================= */}
                <TopLocationKPI value={kpis.topLocation} />
                <OrdersPerLocationKPI value={Object.values(kpis.ordersPerLocation).reduce((a, b) => a + b, 0)} />
                <FulfillmentRateKPI value={kpis.fulfillmentRate} />
                <AvgDeliveryTimeKPI value={kpis.avgDeliveryTime} />

                {/* ================= INVENTORY / PRODUCT KPIs ================= */}
                <TonnageSoldKPI value={kpis.tonnageSold} />
                <LowStockItemsKPI value={kpis.lowStockItems} />
                <ExpiredProductsKPI value={kpis.expiredProducts} />
                <DamagedStockKPI value={kpis.damagedStock} />
                <StockRiskKPI value={kpis.stockRiskItems} />
                <StockTurnoverRateKPI value={kpis.stockTurnoverRate} />

                {/* ================= GENERAL KPIS ================= */}
                <TotalUsersKPI value={kpis.totalUsers} />
                <ActiveUsersKPI value={kpis.activeUsers} />
                <TotalProductsKPI value={kpis.totalProducts} />
                <TotalTransportersKPI value={kpis.totalTransporters} />
                <PendingOrdersKPI value={kpis.pendingOrders} />
                <PartiallyFilledOrdersKPI value={kpis.partiallyFilledOrders} />
                <DailyDeliveriesKPI value={kpis.dailyDeliveries} />
                <WeeklyDeliveriesKPI value={kpis.weeklyDeliveries} />
                <SalesFTDKPI value={kpis.salesFTD} />
                <SalesWTDKPI value={kpis.salesWTD} />
                <SalesMTDKPI value={kpis.salesMTD} />
                <SalesYTDKPI value={kpis.salesYTD} />
                <TonnageFTDKPI value={kpis.tonnageFTD} />
                <TonnageWTDKPI value={kpis.tonnageWTD} />
                <TonnageMTDKPI value={kpis.tonnageMTD} />
                <TonnageYTDKPI value={kpis.tonnageYTD} />
                <PendingQuotationsKPI value={kpis.pendingQuotations} />
                <RejectedQuotationsKPI value={kpis.rejectedQuotations} />
                <MTDReturnsKPI value={kpis.mtdReturns} />
                <TransfersPendingKPI value={kpis.transfersPending} />
                <TotalProductionKPI value={kpis.totalProduction} />


            </div>
        </div>
    );
}
