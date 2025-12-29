import Sidebar from "@/components/sidebar2";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DollarSign, TrendingUp, Users, ShoppingBag, Calendar, MapPin } from "lucide-react";
import SalesTrendChart from "@/components/SalesTrendChart";
import TopProducts from "@/components/TopProducts";
import LeastProducts from "@/components/LeastProducts";
import RecentSales from "@/components/RecentSales";
import TopCustomers from "@/components/TopCustomers";
import LeastCustomers from "@/components/LeastCustomers";
import SalesByLocation from "@/components/SalesByLocation";
import { DashboardSale } from "@/components/DashboardSale";
import SalesByCustomer from "@/components/SalesByCustomer";
import SalesByProduct from "@/components/SalesByProduct";
import SalesTable from "@/components/SalesTable";
import DateFiltersExports from "@/components/DateFiltersExports";

interface ChartDataPoint {
    date: string;
    value: number;
    quantity: number;
    tonnage: number;
}

interface Props {
    currentPath?: string;
}

interface CategoryTrendDataPoint {
    date: string;
    [category: string]: number | string;
}

export default async function SalesDashboardPage() {
    const user = await getCurrentUser();
    if (!user) return <div>Please log in.</div>;
    const userId = user.id;

    // Metrics
    const sales: DashboardSale[] = await prisma.sale.findMany({
        where: { createdBy: userId },
        include: {
            product: {
                select: {
                    name: true,
                    price: true,
                    category: true,
                    weightValue: true,
                    packSize: true
                },
            },
            location: { select: { name: true } }
        },
    });

    // 1. Get product sales with quantities
    const productSales = await prisma.sale.groupBy({
        by: ['productId'],
        where: {
            createdBy: userId,
            saleDate: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
            },
        },
        _sum: {
            quantity: true,
        },
    });

    // 2. Fetch product details for the IDs
    const productIds = productSales.map((sale) => sale.productId);
    const products = await prisma.productList.findMany({
        where: { id: { in: productIds } },
        select: { id: true, name: true, price: true },
    });

    // 3. Merge sales data with product info
    const salesByProduct = productSales
        .map((sale) => {
            const product = products.find((p) => p.id === sale.productId);
            if (!product) return null;
            return {
                id: product.id,
                name: product.name,
                totalValue: product.price * (sale._sum.quantity || 0),
                qty: sale._sum.quantity || 0,
            };
        })
        .filter(Boolean) // Remove nulls
        .sort((a, b) => b.totalValue - a.totalValue);

    const topSellingProducts = salesByProduct.slice(0, 5);
    const leastSellingProducts = salesByProduct.slice(-5).reverse();

    // Total Sales, Total Orders, Average Order Value
    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const customers = await prisma.customer.findMany({
        where: { createdBy: userId },
        include: {
            sales: {
                include: { product: true }
            }
        },
    });


    const totalCustomers = customers.length;

    // 1. Total Revenue Growth (vs. Last Month)
    const lastMonthStart = new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1);
    const lastMonthEnd = new Date(new Date().getFullYear(), new Date().getMonth(), 0);
    const prevMonthSales = await prisma.sale.findMany({
        where: {
            createdBy: userId,
            saleDate: { gte: lastMonthStart, lte: lastMonthEnd },
        },
    });
    const prevMonthTotal = prevMonthSales.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);
    const growth = prevMonthTotal ? ((totalSales - prevMonthTotal) / prevMonthTotal * 100).toFixed(1) : "0";

    // 2. Conversion Rate
    const conversionRate = totalCustomers > 0 ? (totalOrders / totalCustomers * 100).toFixed(1) : "0";

    // 3. Sales per Product Category
    const salesByCategory = sales.reduce((acc, sale) => {
        const category = sale.product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = { totalValue: 0, qty: 0 };
        }
        acc[category].totalValue += sale.quantity * sale.salePrice;
        acc[category].qty += sale.quantity;
        return acc;
    }, {} as Record<string, { totalValue: number; qty: number }>);

    // 4. Average Items per Order
    const totalItemsSold = sales.reduce((sum, sale) => sum + sale.quantity, 0);
    const avgItemsPerOrder = totalOrders > 0 ? (totalItemsSold / totalOrders).toFixed(1) : "0";

    // 5. Top Selling Location
    const salesByLocation = sales.reduce((acc, sale) => {
        const loc = sale.location?.name || 'Unknown';
        acc[loc] = (acc[loc] || 0) + sale.quantity * sale.salePrice;
        return acc;
    }, {} as Record<string, number>);
    const topLocation = Object.entries(salesByLocation).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';

    // YTD and MTD Sales
    const startOfYear = new Date(new Date().getFullYear(), 0, 1);
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

    const salesYTD = await prisma.sale.findMany({
        where: { createdBy: userId, saleDate: { gte: startOfYear } },
        include: { product: { select: { price: true } } },
    });
    const totalSalesYTD = salesYTD.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);

    const salesMTD = await prisma.sale.findMany({
        where: { createdBy: userId, saleDate: { gte: startOfMonth } },
        include: { product: { select: { price: true } } },
    });
    const totalSalesMTD = salesMTD.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);

    // Current year
    const startOfCurrentYear = new Date(new Date().getFullYear(), 0, 1);
    const endOfCurrentYear = new Date();

    // Previous year
    const startOfLastYear = new Date(new Date().getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(new Date().getFullYear() - 1, 11, 31);

    // Total sales this year
    const salesThisYear = sales.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);

    // Total sales last year
    const lastYearSales = await prisma.sale.findMany({
        where: {
            createdBy: userId,
            saleDate: { gte: startOfLastYear, lte: endOfLastYear },
        },
    });
    const salesLastYear = lastYearSales.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);

    // YoY growth %
    const yoyGrowth = salesLastYear
        ? ((salesThisYear - salesLastYear) / salesLastYear) * 100
        : 0;

    // Recent sales (last 7 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentSales = sales
        .filter(sale => sale.saleDate >= thirtyDaysAgo)
        .sort((a, b) => b.saleDate.getTime() - a.saleDate.getTime())
        .slice(0, 10);

    // Top products (by quantity sold)
    const topProducts = sales
        .reduce((acc, sale) => {
            const name = sale.product.name;
            acc[name] = (acc[name] || 0) + sale.quantity;
            return acc;
        }, {} as Record<string, number>)
    const topProductsArray = Object.entries(topProducts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

    // Sales trend data (preparing data for charts)
    const productList = await prisma.productList.findMany({
        select: { id: true, weightValue: true, packSize: true },
    });

    if (productList.length === 0) {
        console.warn("No products found for tonnage calculation.");
    }

    const salesTrendData = sales
        .reduce((acc, sale) => {
            const date = new Date(sale.saleDate).toISOString().split('T')[0];
            const product = productList.find(p => p.id === sale.productId);
            const weightInTons = product ? (product.weightValue * sale.quantity * product.packSize) / 1000 : 0;

            const existing = acc.find(d => d.date === date);
            if (existing) {
                existing.value += sale.salePrice * sale.quantity;
                existing.quantity += sale.quantity;
                existing.tonnage += weightInTons;
            } else {
                acc.push({
                    date,
                    value: sale.salePrice * sale.quantity,
                    quantity: sale.quantity,
                    tonnage: weightInTons,
                });
            }
            return acc;
        }, [] as ChartDataPoint[])
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Sales Category trend data
    const salesCategoryTrendData = (sales || []).reduce((acc, sale) => {
        const date = new Date(sale.saleDate).toISOString().split('T')[0];
        const category = sale.product?.category || 'Uncategorized'; // Optional chaining for safety
        const existing = acc.find(d => d.date === date);

        if (existing) {
            existing[category] = (existing[category] || 0) + sale.quantity;
        } else {
            acc.push({
                date,
                [category]: sale.quantity,
            });
        }
        return acc;
    }, [] as CategoryTrendDataPoint[]).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    // Top Customers and Least Customers
    const topCustomers = [...customers]
        .sort((a, b) => (b.sales?.length || 0) - (a.sales?.length || 0))
        .slice(0, 5);

    const leastCustomers = [...customers]
        .sort((a, b) => (a.sales?.length || 0) - (b.sales?.length || 0))
        .slice(0, 5);



    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/sales" />
            <main className="ml-64 p-8 space-y-10">
                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Sales Dashboard</h1>
                    <p className="text-gray-500 mt-1">Track your sales performance and trends</p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-1 md:grid-cols-8 gap-2">
                    <KPI title="Total Sales" value={`K${totalSales.toFixed(0)}`} icon={<DollarSign />} color="blue" />
                    <KPI title="Sales YTD" value={`K${totalSalesYTD.toFixed(0)}`} icon={<Calendar />} color="yellow" />
                    <KPI title="Sales MTD" value={`K${totalSalesMTD.toFixed(0)}`} icon={<Calendar />} color="yellow" />
                    <KPI
                        title="YoY Growth"
                        value={`${yoyGrowth >= 0 ? '+' : ''}${yoyGrowth.toFixed(1)}%`}
                        icon={<TrendingUp />}
                        color={yoyGrowth >= 0 ? "green" : "red"}
                    />
                    <KPI title="Monthly Growth" value={`${growth}%`} icon={<TrendingUp />} color="blue" />
                    <KPI title="Customers" value={totalCustomers} icon={<Users />} color="yellow" />
                    <KPI title="Orders" value={totalOrders} icon={<ShoppingBag />} color="blue" />
                    <KPI title="Avg. Order Value" value={`K${avgOrderValue.toFixed(0)}`} icon={<TrendingUp />} color="blue" />
                    {/*<KPI title="Items per Order" value={avgItemsPerOrder} icon={<ShoppingBag />} color="green" />*/}
                    {/*<KPI title="Conversion Rate" value={`${conversionRate}%`} icon={<Users />} color="purple" />*/}
                </div>

                {/* Main Grid */}
                <div>
                    <SalesTrendChart
                        salesTrendData={salesTrendData || []}
                        sales={sales || []}
                        productList={productList || []}
                    />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <TopProducts
                        products={topSellingProducts}
                        title="Top Selling Products (Last 30 Days)"
                        iconColor="text-yellow-500"
                    />
                    <LeastProducts products={leastSellingProducts} />

                    {/* Sales by Category */}
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Calendar className="h-5 w-5 text-blue-500" /> Sales by Category
                        </h3>
                        {Object.entries(salesByCategory).length === 0 ? (
                            <p className="text-sm text-gray-500">No sales data.</p>
                        ) : (
                            <ul className="space-y-3 text-sm overflow-y-auto">
                                {Object.entries(salesByCategory).map(([category, data]) => (
                                    <li key={category} className="flex justify-between items-center">
                                        <span className="font-medium">{category}</span>
                                        <span>{data.qty} units</span>
                                        <span className="font-bold text-purple-600">K{data.totalValue.toFixed(0)}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>

                {/* Top Customers and Location */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <TopCustomers
                        customers={topCustomers}
                        title="Top Customers (Last 30 Days)"
                        iconColor="text-green-500"
                    />
                    <LeastCustomers customers={leastCustomers} />
                </div>
                {/* Sales by Location */}
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    <SalesTable sales={sales} />
                </div>
                <RecentSales sales={recentSales} />
            </main >
        </div >
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

function KPI({ title, value, icon, color }: {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: Color;
}) {
    return (
        <div className="relative bg-white p-2 rounded-xl border hover:shadow-md transition-all duration-200">
            {/* Top Accent Bar */}
            <div className={`absolute top-0 left-0 w-full h-1 rounded-t-xl ${bgColors[color]}`} />

            <div className="flex items-center justify-between">
                {/* Text */}
                <div>
                    <p className="text-sm text-gray-500">{title}</p>
                    <h2 className="text-2xl font-bold mt-1">{value}</h2>
                </div>

                {/* Icon */}
                <div
                    className={`p-2 ${iconColors[color]}`}
                >
                    {icon}
                </div>
            </div>
        </div>
    );
}
