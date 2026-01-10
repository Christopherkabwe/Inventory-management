
import {
    DollarSign,
    ShoppingCart,
    ShoppingBag,
    BarChart3,
    Layers,
    XCircle,
    Package,
    TrendingUp,
    Users,
    UserPlus,
    UserMinus,
    MapPin,
    ClipboardList,
    FileText,
    FileX,
    RotateCcw,
    Truck,
    Calendar,
    AlertTriangle,
    Box,
} from "lucide-react";
import { KPI } from "@/components/kpi/KPI"

/* ==================== SALES ==================== */

export const TotalSalesKPI = ({ value }: { value: number }) => (
    <KPI title="Total Sales" value={`K${value.toLocaleString()}`} icon={<DollarSign />} color="green" />
);

export const TotalOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Orders" value={value} icon={<ShoppingCart />} color="blue" />
);

export const AvgOrderValueKPI = ({ value }: { value: number }) => (
    <KPI title="Avg Order Value" value={`K${value.toFixed(2)}`} icon={<BarChart3 />} color="purple" />
);

export const SalesVelocityKPI = ({ value }: { value: number }) => (
    <KPI title="Sales Velocity" value={`K${value.toFixed(2)}`} icon={<TrendingUp />} color="teal" />
);

export const AvgItemsPerOrderKPI = ({ value }: { value: number }) => (
    <KPI title="Avg Items / Order" value={value.toFixed(2)} icon={<Layers />} color="indigo" />
);

export const CancelledOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Cancelled Orders" value={value} icon={<XCircle />} color="red" />
);

/* ==================== SALES GROWTH ==================== */

export const YoYGrowthKPI = ({ value }: { value: number }) => (
    <KPI
        title="YoY Growth"
        value={`${value >= 0 ? "+" : ""}${value.toFixed(1)}%`}
        icon={<TrendingUp />}
        color={value >= 0 ? "green" : "red"}
    />
);

export const MonthlyGrowthKPI = ({ value }: { value: number }) => (
    <KPI title="Monthly Growth" value={`${value.toFixed(1)}%`} icon={<TrendingUp />} color="blue" />
);

/* ==================== SALES VALUE PERIODS ==================== */

export const SalesFTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales FTD" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesWTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales WTD" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesMTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales MTD" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

export const SalesYTDKPI = ({ value }: { value: number }) => (
    <KPI title="Sales YTD" value={`K${value.toFixed(2)}`} icon={<DollarSign />} color="blue" />
);

/* ==================== TONNAGE ==================== */

export const TonnageFTDKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage FTD" value={`${value.toFixed(2)} t`} icon={<Package />} color="orange" />
);

export const TonnageWTDKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage WTD" value={`${value.toFixed(2)} t`} icon={<Package />} color="orange" />
);

export const TonnageMTDKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage MTD" value={`${value.toFixed(2)} t`} icon={<Package />} color="orange" />
);

export const TonnageYTDKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage YTD" value={`${value.toFixed(2)} t`} icon={<Package />} color="orange" />
);

export const TonnageSold30DaysKPI = ({ value }: { value: number }) => (
    <KPI title="Tonnage Sold (30 Days)" value={`${value.toFixed(2)} t`} icon={<Box />} color="blue" />
);

/* ==================== CUSTOMERS ==================== */

export const TotalCustomersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Customers" value={value} icon={<Users />} color="blue" />
);

export const RepeatCustomerRateKPI = ({ value }: { value: number }) => (
    <KPI title="Repeat Customer Rate" value={`${value.toFixed(1)}%`} icon={<Users />} color="green" />
);

export const NewCustomers30DaysKPI = ({ value }: { value: number }) => (
    <KPI title="New Customers (30 Days)" value={value} icon={<UserPlus />} color="emerald" />
);

export const RevenuePerCustomerKPI = ({ value }: { value: number }) => (
    <KPI title="Revenue per Customer" value={`K${value.toFixed(0)}`} icon={<DollarSign />} color="blue" />
);

export const CustomerChurnRateKPI = ({ value }: { value: number }) => (
    <KPI title="Customer Churn" value={`${value.toFixed(1)}%`} icon={<UserMinus />} color="red" />
);

export const CustomerLifetimeValueKPI = ({ value }: { value: number }) => (
    <KPI title="Customer Lifetime Value" value={`K${value.toFixed(0)}`} icon={<DollarSign />} color="purple" />
);

/* ==================== LOCATION ==================== */

export const TopLocationKPI = ({ value }: { value: string }) => (
    <KPI title="Top Location" value={value} icon={<MapPin />} color="purple" />
);

export const OrdersPerLocationKPI = ({ value }: { value: number }) => (
    <KPI title="Orders per Location" value={value} icon={<MapPin />} color="blue" />
);

export const FulfillmentRateKPI = ({ value }: { value: number }) => (
    <KPI title="Fulfillment Rate" value={`${value.toFixed(1)}%`} icon={<MapPin />} color="green" />
);

/* ==================== INVENTORY ==================== */

export const LowStockItemsKPI = ({ value }: { value: number }) => (
    <KPI title="Low Stock Items" value={value} icon={<AlertTriangle />} color="red" />
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

export const StockRiskKPI = ({ value }: { value: number }) => (
    <KPI title="Stock Risk Items" value={value} icon={<AlertTriangle />} color="red" />
);

export const TopSellingProductKPI = ({ value }: { value: string }) => (
    <KPI title="Top Selling Product" value={value} icon={<Box />} color="green" />
);

export const LeastSellingProductKPI = ({ value }: { value: string }) => (
    <KPI title="Least Selling Product" value={value} icon={<Box />} color="purple" />
);

export const TotalProductsKPI = ({ value }: { value: number }) => (
    <KPI title="Total Products" value={value} icon={<Box />} color="yellow" />
);

/* ==================== ORDERS / OPERATIONS ==================== */

export const PendingOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Orders" value={value} icon={<ClipboardList />} color="yellow" />
);

export const PartiallyFilledOrdersKPI = ({ value }: { value: number }) => (
    <KPI title="Partially Filled Orders" value={value} icon={<ClipboardList />} color="amber" />
);

export const PendingQuotationsKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Quotations" value={value} icon={<FileText />} color="blue" />
);

export const RejectedQuotationsKPI = ({ value }: { value: number }) => (
    <KPI title="Rejected Quotations" value={value} icon={<FileX />} color="red" />
);

export const MTDReturnsKPI = ({ value }: { value: number }) => (
    <KPI title="MTD Returns" value={value} icon={<RotateCcw />} color="orange" />
);

/* ==================== DELIVERIES ==================== */

export const AvgDeliveryTimeKPI = ({ value }: { value: number }) => (
    <KPI title="Avg Delivery Time (Days)" value={value.toFixed(1)} icon={<Calendar />} color="blue" />
);

export const DailyDeliveriesKPI = ({ value }: { value: number }) => (
    <KPI title="Daily Deliveries" value={value} icon={<Calendar />} color="blue" />
);

export const WeeklyDeliveriesKPI = ({ value }: { value: number }) => (
    <KPI title="Weekly Deliveries" value={value} icon={<Calendar />} color="green" />
);

/* ==================== USERS ==================== */

export const TotalUsersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Users" value={value} icon={<Users />} color="blue" />
);

export const ActiveUsersKPI = ({ value }: { value: number }) => (
    <KPI title="Active Users" value={value} icon={<Users />} color="green" />
);

/* ==================== TRANSPORT ==================== */

export const TotalTransportersKPI = ({ value }: { value: number }) => (
    <KPI title="Total Transporters" value={value} icon={<Truck />} color="purple" />
);

export const PendingTransfersKPI = ({ value }: { value: number }) => (
    <KPI title="Pending Transfers" value={value} icon={<Truck />} color="yellow" />
);

/* ==================== PRODUCTION ==================== */

export const TotalProductionKPI = ({ value }: { value: number }) => (
    <KPI title="Total Production" value={value} icon={<Box />} color="green" />
);
