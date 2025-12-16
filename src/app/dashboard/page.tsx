import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { TrendingUp, TrendingDown, Package, DollarSign, AlertTriangle } from "lucide-react";
import ProductsChart from "@/components/products-chart";

export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) {
        return <div>Please log in.</div>;
    }
    const userId = user.id;

    const [totalProducts, lowStock, allProducts] = await Promise.all([
        prisma.inventory.count({ where: { createdBy: userId } }),
        prisma.inventory.count({
            where: {
                createdBy: userId,
                quantity: { lte: 5 },
            },
        }),
        prisma.inventory.findMany({
            where: { createdBy: userId },
            include: {
                product: {
                    select: { price: true, name: true },
                },
            },
        }),
    ]);

    const totalValue = allProducts.reduce(
        (sum, inventory) =>
            sum + Number(inventory.product.price) * Number(inventory.quantity),
        0
    );

    const inStockCount = allProducts.filter((inventory) => Number(inventory.quantity) > 5).length;
    const lowStockCount = allProducts.filter((inventory) => Number(inventory.quantity) <= 5 && Number(inventory.quantity) > 0).length;
    const outOfStockCount = allProducts.filter((inventory) => Number(inventory.quantity) === 0).length;

    const inStockPercentage = totalProducts > 0 ? Math.round((inStockCount / totalProducts) * 100) : 0;
    const lowStockPercentage = totalProducts > 0 ? Math.round((lowStockCount / totalProducts) * 100) : 0;
    const outOfStockPercentage = totalProducts > 0 ? Math.round((outOfStockCount / totalProducts) * 100) : 0;

    const now = new Date();
    const weeklyProductsData = [];
    for (let i = 11; i >= 0; i--) {
        const weekStart = new Date(now);
        weekStart.setDate(weekStart.getDate() - i * 7);
        weekStart.setHours(0, 0, 0, 0);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        weekEnd.setHours(23, 59, 59, 999);

        const weekLabel = `${String(weekStart.getMonth() + 1).padStart(2, "0")}/${String(weekStart.getDate()).padStart(2, "0")}`;
        const weekProducts = allProducts.filter((inventory) => {
            const productDate = new Date(inventory.createdAt);
            return productDate >= weekStart && productDate <= weekEnd;
        });

        weeklyProductsData.push({ week: weekLabel, products: weekProducts.length });
    }

    const recent = await prisma.inventory.findMany({
        where: { createdBy: userId },
        include: {
            product: true,
        },
        orderBy: { createdAt: "desc" },
        take: 5,
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/dashboard" />
            <main className="ml-64 p-8">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
                    <p className="text-sm text-gray-500">Welcome back! Here’s an overview of your inventory.</p>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Products</p>
                                <h3 className="text-2xl font-bold text-gray-900">{totalProducts}</h3>
                            </div>
                            <Package className="h-10 w-10 text-purple-500" />
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" /> +{totalProducts} this month
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Total Value</p>
                                <h3 className="text-2xl font-bold text-gray-900">K{Number(totalValue).toFixed(0)}</h3>
                            </div>
                            <DollarSign className="h-10 w-10 text-green-500" />
                        </div>
                        <div className="mt-2 flex items-center text-sm text-green-600">
                            <TrendingUp className="h-4 w-4 mr-1" /> +K{Number(totalValue).toFixed(0)} this month
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">Low Stock</p>
                                <h3 className="text-2xl font-bold text-gray-900">{lowStock}</h3>
                            </div>
                            <AlertTriangle className="h-10 w-10 text-yellow-500" />
                        </div>
                        <div className="mt-2 flex items-center text-sm text-yellow-600">
                            <TrendingDown className="h-4 w-4 mr-1" /> {lowStock} items need restock
                        </div>
                    </div>
                </div>

                {/* First Row: New Products, Recent Products, Efficiency */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">New Products per Week</h2>
                        <div className="h-48">
                            <ProductsChart data={weeklyProductsData} />
                        </div>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Products</h2>
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                            {recent.map((inventory, key) => {
                                const stockLevel = inventory.quantity === 0 ? 0 : inventory.quantity <= (inventory.lowStockAt || 5) ? 1 : 2;
                                const bgColors = ["bg-red-600", "bg-yellow-600", "bg-green-600"];
                                const textColors = ["text-red-600", "text-yellow-600", "text-green-600"];
                                return (
                                    <div key={key} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50">
                                        <div className="flex items-center space-x-3">
                                            <div className={`w-3 h-3 rounded-full ${bgColors[stockLevel]}`} />
                                            <span className="text-sm font-medium text-gray-900">{inventory.product.name}</span>
                                        </div>
                                        <div className={`text-sm font-medium ${textColors[stockLevel]}`}>
                                            {inventory.quantity} units
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                    {/* Efficiency Section */}
                    <div className="bg-white rounded-lg border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-lg font-semibold text-gray-900">Efficiency</h2>
                        </div>
                        <div className="flex items-center justify-center">
                            <div className="relative w-48 h-48">
                                <div className="absolute inset-0 rounded-full border-8 border-gray-200" />
                                <div
                                    className="absolute inset-0 rounded-full border-8 border-green-600"
                                    style={{
                                        clipPath: "polygon(50% 50%, 50% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 50%)"
                                    }}
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl font-bold text-gray-900">
                                            {inStockPercentage}%
                                        </div>
                                        <div className="text-sm text-gray-600">In Stock</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 space-y-2">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-green-600" />
                                    <span>In Stock ({inStockPercentage}%)</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-yellow-600" />
                                    <span>Low Stock ({lowStockPercentage}%)</span>
                                </div>
                            </div>
                            <div className="flex items-center justify-between text-sm text-gray-600">
                                <div className="flex items-center space-x-2">
                                    <div className="w-3 h-3 rounded-full bg-red-600" />
                                    <span>Out of Stock ({outOfStockPercentage}%)</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main >
        </div >
    );
}
