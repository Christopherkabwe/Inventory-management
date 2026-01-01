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
import { DashboardSale } from "@/components/DashboardSale";
import SalesTable from "@/components/SalesTable";
import DashboardLayout from "@/components/DashboardLayout";
import SalesByCategory from "@/components/SalesByCategory";

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
            customer: { select: { id: true, name: true } },
            location: { select: { id: true, name: true, address: true } },
            items: {
                include: {
                    product: {
                        select: {
                            id: true,
                            name: true,
                            price: true,
                            category: true,
                            weightValue: true,
                            packSize: true,
                            weightUnit: true,
                        },
                    },
                },
            },
        },
    }).then(data => data.flatMap(sale =>
        sale.items.map(item => ({
            id: sale.id,
            customerId: sale.customerId,
            customerName: sale.customer?.name,
            address: { name: sale.location?.name },
            productId: item.product.id,
            quantity: item.quantity,
            salePrice: item.product.price,
            totalAmount: item.product.price * item.quantity,
            saleDate: sale.saleDate,
            createdBy: sale.createdBy,
            createdAt: sale.createdAt,
            updatedAt: sale.updatedAt,
            location: { name: sale.location?.name, address: sale.location?.address },
            locationId: sale.locationId,
            product: {
                id: item.product.id,
                name: item.product.name,
                price: item.product.price,
                category: item.product.category,
                packSize: item.product.packSize,
                weightValue: item.product.weightValue,
                weightUnit: item.product.weightUnit,
            },
        }))
    ));

    // 1. Get product sales with quantities
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const productSales = await prisma.saleItem.groupBy({
        by: ['productId'],
        where: {
            sale: {
                createdBy: userId,
                saleDate: { gte: thirtyDaysAgo },
            },
        },
        _sum: {
            quantity: true,
            total: true, // optional, total sales per product
        },
        orderBy: {
            _sum: {
                total: 'desc',
            },
        },
    });

    // 2. Fetch product details for the IDs
    const productIds = productSales.map((sale) => sale.productId);
    const products = await prisma.productList.findMany({
        where: { id: { in: productIds } },
        select: {
            id: true,
            name: true,
            price: true,
            category: true,
            weightValue: true,
            packSize: true,
        },
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
        .filter(Boolean)
        .sort((a, b) => b.totalValue - a.totalValue);

    // Total Sales, Total Orders, Average Order Value
    const totalSales = sales.reduce((sum, sale) => sum + sale.quantity * sale.salePrice, 0);
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders > 0 ? totalSales / totalOrders : 0;

    const customers = await prisma.customer.findMany({
        where: { createdBy: userId },
        include: {
            sales: {
                include: {
                    items: {
                        include: { product: true }
                    }
                }
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
            saleDate: {
                gte: lastMonthStart,
                lte: lastMonthEnd
            }
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
    });

    const prevMonthTotal = prevMonthSales.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
            return itemSum + item.quantity * item.product.price;
        }, 0);
    }, 0);

    const growth = prevMonthTotal ? ((totalSales - prevMonthTotal) / prevMonthTotal * 100).toFixed(1) : "0";


    // 3. Sales per Product Category
    const salesByCategory = sales.reduce((acc, sale) => {
        const category = sale.product.category || 'Uncategorized';
        if (!acc[category]) {
            acc[category] = { totalValue: 0, qty: 0 };
        }
        acc[category].totalValue += sale.salePrice * sale.quantity;
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
        where: {
            createdBy: userId,
            saleDate: {
                gte: startOfYear
            }
        },
        include: {
            items: {
                include: {
                    product: {
                        select: {
                            price: true
                        }
                    }
                }
            }
        },
    });

    const totalSalesYTD = salesYTD.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
            return itemSum + item.quantity * item.product.price;
        }, 0);
    }, 0);

    const salesMTD = await prisma.sale.findMany({
        where: {
            createdBy: userId,
            saleDate: {
                gte: startOfMonth
            }
        },
        include: {
            items: {
                include: {
                    product: true
                }
            }
        },
    });

    const totalSalesMTD = salesMTD.reduce((sum, sale) => {
        return sum + sale.items.reduce((itemSum, item) => {
            return itemSum + item.quantity * item.product.price;
        }, 0);
    }, 0);

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

    // Recent sales (last 30 days)
    const recentSales = sales
        .filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo)
        .sort((a, b) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
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

    // Top Customers and Least Customers
    const sortCustomers = (a: any, b: any) => {
        const recentSalesA = a.sales?.filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo) || [];
        const recentSalesB = b.sales?.filter(sale => new Date(sale.saleDate) >= thirtyDaysAgo) || [];

        const totalTonnageA = recentSalesA.reduce((sum, sale) => {
            return sum + sale.items.reduce((itemSum, item) => {
                const productWeight = item.product?.weightValue || 0;
                const packSize = item.product?.packSize || 1;
                return itemSum + (productWeight * item.quantity * packSize) / 1000; // convert to tons
            }, 0);
        }, 0);

        const totalTonnageB = recentSalesB.reduce((sum, sale) => {
            return sum + sale.items.reduce((itemSum, item) => {
                const productWeight = item.product?.weightValue || 0;
                const packSize = item.product?.packSize || 1;
                return itemSum + (productWeight * item.quantity * packSize) / 1000; // convert to tons
            }, 0);
        }, 0);

        return totalTonnageB - totalTonnageA; // Sort in descending order
    };

    const sortedCustomers = [...customers].sort(sortCustomers);
    const topCustomers = sortedCustomers.slice(0, 5);
    const leastCustomers = sortedCustomers.slice(-5).reverse();

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardLayout>

                {/* Header */}
                <div>
                    <h1 className="text-3xl font-bold">Sales Dashboard</h1>
                    <p className="text-gray-500 mt-1 mb-2">Track your sales performance and trends</p>
                </div>
                {/* KPIs */}
                <div className="grid grid-cols-2 xl:grid-cols-8 gap-2 mb-5">
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
                </div>

                {/* Main Grid */}
                <div>
                    <SalesTrendChart
                        salesTrendData={salesTrendData || []}
                        sales={sales || []}
                        productList={productList || []}
                    />
                </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-5">
                    <TopProducts />
                    <LeastProducts />

                    {/* Sales by Category */}
                    <SalesByCategory />
                </div>

                {/* Top Customers and Location */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-5">
                    <TopCustomers />
                    <LeastCustomers />
                </div>
                {/* Sales by Location */}
                <div className="grid grid-cols-1 xl:grid-cols-1 gap-6 mb-5">
                    <SalesTable />
                </div>
                <RecentSales />
            </DashboardLayout >
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