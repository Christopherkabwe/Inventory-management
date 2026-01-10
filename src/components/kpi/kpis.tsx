// app/components/kpis/index.tsx
import {
    DollarSign, TrendingUp, Users, ShoppingBag, Calendar, MapPin, AlertTriangle, Box, Truck,
} from "lucide-react";
import React from "react";

type Color = "purple" | "green" | "yellow" | "red" | "blue";

const iconColors: Record<Color, string> = {
    purple: "text-purple-600",
    green: "text-green-600",
    yellow: "text-yellow-500",
    red: "text-red-600",
    blue: "text-blue-600",
};

interface KPIProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: Color;
}

export function KPI({ title, value, icon, color }: KPIProps) {
    return (
        <div className="bg-white p-3 rounded-xl border flex justify-between items-center shadow-sm">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-xl font-bold">{value}</h2>
            </div>
            <div className={`${iconColors[color]} text-2xl`}>
                {icon}
            </div>
        </div>
    );
}

// ====================== SALES KPIs ======================
export const TotalSalesKPI = ({ value }: { value: number }) => (
    <KPI title="Total Sales" value={`K${value.toFixed(0)}`} icon={<DollarSign />} color="blue" />
);

export const TotalOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Orders" value={value} icon={<ShoppingBag />} color="blue" />
);

export const AvgOrderValueKPI = ({ value }: { value: number }) => (
    <KPI title="Avg. Order Value" value={`K${value.toFixed(0)}`} icon={<TrendingUp />} color="blue" />
);

export const YoYGrowthKPI = ({ value }: { value: number }) => (
    <KPI
        title="YoY Growth"
        value={`${value >= 0 ? '+' : ''}${value.toFixed(1)}%`}
        icon={<TrendingUp />}
        color={value >= 0 ? "green" : "red"}
    />
);

export const MonthlyGrowthKPI = ({ value }: { value: number }) => (
    <KPI title="Monthly Growth" value={`${value.toFixed(1)}%`} icon={<TrendingUp />} color="blue" />
);

export const SalesVelocityKPI = ({ value }: { value: number }) => (
    <KPI title="Sales Velocity (K/day)" value={`K${value.toFixed(0)}`} icon={<TrendingUp />} color="blue" />
);

// ====================== CUSTOMER KPIs ======================
export const TotalCustomersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Customers" value={value} icon={<Users />} color="yellow" />
);

export const RevenuePerCustomerKPI = ({ value }: { value: number }) => (
    <KPI title="Revenue per Customer" value={`K${value.toFixed(0)}`} icon={<DollarSign />} color="blue" />
);

export const RepeatCustomerRateKPI = ({ value }: { value: number }) => (
    <KPI title="Repeat Customer Rate" value={`${value.toFixed(1)}%`} icon={<Users />} color="yellow" />
);

// ====================== LOCATION / OPERATION KPIs ======================
export const TopLocationKPI = ({ value }: { value: string }) => (
    <KPI title="Top Location" value={value} icon={<MapPin />} color="green" />
);

// ====================== INVENTORY / PRODUCT KPIs ======================
export const TonnageSoldKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage Sold (30 Days)" value={`${value.toFixed(2)} t`} icon={<Box />} color="blue" />
);

export const LowStockItemsKPI = ({ value }: { value: number }) => (
    <KPI title="Low Stock Items" value={value} icon={<AlertTriangle />} color="red" />
);

export const LeastSellingProductKPI = ({ value }: { value: string }) => (
    <KPI title="Least Selling Product" value={value} icon={<Box />} color="purple" />
);

export const StockRiskKPI = ({ value }: { value: number }) => (
    <KPI title="Stock Risk Items" value={value} icon={<AlertTriangle />} color="red" />
);

export const AvgItemsPerOrderKPI = ({ value }: { value: number }) => (
    <KPI title="Avg Items per Order" value={value.toFixed(1)} icon={<ShoppingBag />} color="blue" />
);

export const CancelledOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Cancelled Orders" value={value} icon={<AlertTriangle />} color="red" />
);

export const TopSellingProductKPI = ({ value }: { value: string }) => (
    <KPI title="Top Selling Product" value={value} icon={<Box />} color="green" />
);

export const NewCustomersKPI = ({ value }: { value: number }) => (
    <KPI title="New Customers (30 Days)" value={value} icon={<Users />} color="green" />
);

export const CustomerChurnRateKPI = ({ value }: { value: number }) => (
    <KPI title="Customer Churn Rate" value={`${value.toFixed(1)}%`} icon={<Users />} color="red" />
);

export const CustomerLifetimeValueKPI = ({ value }: { value: number }) => (
    <KPI title="Customer Lifetime Value" value={`K${value.toFixed(0)}`} icon={<DollarSign />} color="blue" />
);

export const OrdersPerLocationKPI = ({ value }: { value: number }) => (
    <KPI title="Orders per Location" value={value} icon={<MapPin />} color="blue" />
);

export const FulfillmentRateKPI = ({ value }: { value: number }) => (
    <KPI title="Fulfillment Rate" value={`${value.toFixed(1)}%`} icon={<MapPin />} color="green" />
);

export const AvgDeliveryTimeKPI = ({ value }: { value: number }) => (
    <KPI title="Avg Delivery Time (Days)" value={value.toFixed(1)} icon={<Calendar />} color="blue" />
);

export const ExpiredProductsKPI = ({ value }: { value: number }) => (
    <KPI title="Expired Products" value={value} icon={<AlertTriangle />} color="red" />
);

export const DamagedStockKPI = ({ value }: { value: number }) => (
    <KPI title="Damaged Stock" value={value} icon={<AlertTriangle />} color="red" />
);

export const StockTurnoverRateKPI = ({ value }: { value: number }) => (
    <KPI title="Stock Turnover Rate" value={value.toFixed(2)} icon={<TrendingUp />} color="blue" />
);

// ==================== USERS ====================
export const TotalUsersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Users" value={value} icon={<Users />} color="blue" />
);

export const ActiveUsersKPI = ({ value }: { value: number }) => (
    <KPI title="Active Users" value={value} icon={<Users />} color="green" />
);

// ==================== PRODUCTS ====================
export const TotalProductsKPI = ({ value }: { value: number }) => (
    <KPI title="Total Products" value={value} icon={<Box />} color="yellow" />
);

// ==================== TRANSPORTERS ====================
export const TotalTransportersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Transporters" value={value} icon={<Truck />} color="purple" />
);

// ==================== SALES ORDERS ====================
export const PendingOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Orders" value={value} icon={<ShoppingBag />} color="yellow" />
);

export const PartiallyFilledOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Partially Filled Orders" value={value} icon={<ShoppingBag />} color="red" />
);

// ==================== DELIVERIES ====================
export const DailyDeliveriesKPI = ({ value }: { value: number }) => (
    <KPI title="Daily Deliveries" value={value} icon={<Calendar />} color="blue" />
);

export const WeeklyDeliveriesKPI = ({ value }: { value: number }) => (
    <KPI title="Weekly Deliveries" value={value} icon={<Calendar />} color="green" />
);

// ==================== SALES (VALUE) ====================
export const SalesFTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales FTD (Value)" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesWTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales WTD (Value)" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesMTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales MTD (Value)" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesYTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales YTD (Value)" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

// ==================== SALES (TONNAGE) ====================
export const TonnageFTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales FTD (Tons)" value={`${value.toFixed(2)} t`} icon={<Box />} color="blue" />
);

export const TonnageWTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales WTD (Tons)" value={`${value.toFixed(2)} t`} icon={<Box />} color="blue" />
);

export const TonnageMTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales MTD (Tons)" value={`${value.toFixed(2)} t`} icon={<Box />} color="blue" />
);

export const TonnageYTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales YTD" value={`${value.toFixed(2)} Mt`} icon={<Box />} color="blue" />
);

// ==================== QUOTATIONS ====================
export const PendingQuotationsKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Quotations" value={value} icon={<AlertTriangle />} color="yellow" />
);

export const RejectedQuotationsKPI = ({ value }: { value: number }) => (
    <KPI title="Rejected Quotations" value={value} icon={<AlertTriangle />} color="red" />
);

// ==================== RETURNS ====================
export const MTDReturnsKPI = ({ value }: { value: number }) => (
    <KPI title="MTD Returns" value={value} icon={<AlertTriangle />} color="red" />
);

// ==================== TRANSFERS ====================
export const TransfersPendingKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Transfers" value={value} icon={<Truck />} color="yellow" />
);

// ==================== PRODUCTION ====================
export const TotalProductionKPI = ({ value }: { value: number }) => (
    <KPI title="Total Production" value={value} icon={<Box />} color="green" />
);