import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
    Package,
    DollarSign,
    AlertTriangle,
    XCircle,
    Bell,
    Clock,
    WeightIcon,
} from "lucide-react";
import StockHealthPie from "@/components/StockHealthPie";
import InventorySummary from "@/components/InventorySummary";
import DashboardLayout from "@/components/DashboardLayout";
import { redirect } from "next/navigation";

export const metadata = {
    title: "Inventory Dashboard",
};


export default async function DashboardPage() {
    const user = await getCurrentUser();
    if (!user) redirect("/sign-in");
    const userId = user.id;

    /* -----------------------------
       INVENTORY
    ----------------------------- */
    const allProducts = await prisma.inventory.findMany({
        where: { createdById: userId },
        include: {
            product:
            {
                select: {
                    name: true,
                    price: true,
                    weightValue: true,
                    weightUnit: true,
                    packSize: true,
                }
            },
            location: true
        },
    });

    /* -----------------------------
       LOW-STOCK LOGIC
    ----------------------------- */
    const weakestTenIds = allProducts
        .slice()
        .sort((a, b) => a.quantity - b.quantity)
        .slice(0, 10)
        .map(i => i.id);

    const isLowStock = (item: any) =>
        item.quantity <= item.lowStockAt;

    /* ----------------------------------
       LOW STOCK BY LOCATION (COLUMNS)
    ---------------------------------- */
    const lowStockByLocation: Record<string, any[]> = {};
    allProducts.forEach(item => {
        if (!isLowStock(item)) return;
        if (!item.location) return;
        const loc = item.location.name;
        if (!lowStockByLocation[loc]) lowStockByLocation[loc] = [];
        lowStockByLocation[loc].push(item);
    });

    Object.values(lowStockByLocation).forEach(items =>
        items.sort((a, b) => a.quantity - b.quantity)
    );

    /* -----------------------------
       METRICS
    ----------------------------- */
    const totalProducts = allProducts.length;
    const totalValue = allProducts.reduce(
        (sum, i) => sum + i.quantity * i.product.price,
        0
    );

    const inStock = allProducts.filter(i => i.quantity > 0 && !isLowStock(i)).length;
    const lowStock = allProducts.filter(i => i.quantity > 0 && isLowStock(i)).length;
    const outOfStock = allProducts.filter(i => i.quantity === 0).length;

    /* -----------------------------
       RESTOCK ALERTS
    ----------------------------- */
    const restockAlerts = allProducts.filter(isLowStock).slice(0, 10);

    /* -----------------------------
       RECENT PRODUCTS (last 7 days)
    ----------------------------- */
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentProducts = allProducts
        .filter(item => item.updatedAt >= sevenDaysAgo)
        .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
        .slice(0, 10);

    /* -----------------------------
       INVENTORY TURNOVER RATE
    ----------------------------- */

    const sales = await prisma.sale.findMany({
        where: {
            createdById: userId,
            saleDate: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        include: {
            items: {
                include: {
                    product: {
                        select: { price: true },
                    },
                },
            },
        },
    });

    const costOfGoodsSold = sales.reduce((sum, sale) => {
        const saleTotal = sale.items.reduce((itemSum, item) => {
            return itemSum + (item.quantity * (item.product?.price || 0));
        }, 0);
        return sum + saleTotal;
    }, 0);

    const avgInventoryValue = totalValue; // Use your existing totalValue
    const turnoverRate = avgInventoryValue > 0 ? costOfGoodsSold / avgInventoryValue : 0;

    /* ----------------------------- STOCK VALUE TREND DATA ----------------------------- */
    const stockTrend = await prisma.inventory.findMany({
        where: { createdById: userId },
        include: { product: { select: { price: true } } },
        orderBy: { updatedAt: 'asc' },
    });

    const processedStockTrend = stockTrend.reduce((acc, item) => {
        const date = item.updatedAt.toISOString().split('T')[0];
        const value = (acc[date] || 0) + (item.quantity * (item.product?.price || 0));
        acc[date] = value;
        return acc;
    }, {});

    const stockTrendData = Object.entries(processedStockTrend).map(([date, value]) => ({
        date,
        value: parseFloat(value.toFixed(2)), // Round to 2 decimals
    }));

    /* ----------------------------- STOCK TONNAGE TREND DATA ----------------------------- */
    const tonnageTrend = await prisma.inventory.findMany({
        where: {
            createdById: userId,
            updatedAt: {
                gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
            },
        },
        orderBy: {
            updatedAt: 'asc',
        },
    });
    const processedTonnageTrend = tonnageTrend.reduce((acc, item) => {
        const date = item.updatedAt.toISOString().split('T')[0];
        const quantity = (acc[date] || 0) + item.quantity;
        acc[date] = quantity;
        return acc;
    }, {});
    const tonnageTrendData = Object.entries(processedTonnageTrend).map(([date, quantity]) => ({
        date,
        value: quantity,
    }));

    /* -----------------------------
      EXPIRING ITEMS
   ----------------------------- */
    const today = new Date();
    const fourteenDaysFromNow = new Date();
    fourteenDaysFromNow.setDate(today.getDate() + 14);

    const expiringItems = await prisma.inventory.findMany({
        where: {
            expiryDate: { lte: fourteenDaysFromNow, gte: today },
            quantity: { gt: 0 },
        },
        include: { product: true },
    });

    const expiredItems = await prisma.inventory.findMany({
        where: {
            expiryDate: { lt: today },
            quantity: { gt: 0 },
        },
        include: { product: true },
    });

    /* -----------------------------
      INVENTORY SUMMARY TABLE DATA
   ----------------------------- */
    const inventory = await prisma.inventory.findMany({
        where: { createdById: userId },
        include: {
            product: {
                select: {
                    id: true,
                    name: true,
                    sku: true,
                    price: true,
                    weightValue: true,
                    weightUnit: true,
                    packSize: true,
                    category: true,
                },
            },
            location: true,
        },
    });

    // Calculate tonnagee

    function weightToKg(value: number, unit: string) {
        switch (unit.toLowerCase()) {
            case "kg":
                return value;
            case "g":
                return value / 1000;
            case "lb":
                return value * 0.453592;
            case "ton":
            case "t":
                return value * 1000; // convert tons to kg
            default:
                return 0; // unknown unit
        }
    }

    const totalTonnageKg = allProducts.reduce((sum, item) => {
        const weightPerUnit = weightToKg(item.product.weightValue || 0, item.product.weightUnit || "kg");
        const packMultiplier = item.product.packSize ? Number(item.product.packSize) : 1;
        return sum + weightPerUnit * item.quantity * packMultiplier;
    }, 0);

    const totalTonnageTons = parseFloat((totalTonnageKg / 1000).toFixed(2));

    return (
        <div className="min-h-screen bg-gray-50">
            <DashboardLayout>

                {/* HEADER */}
                <div>
                    <h1 className="text-3xl font-bold">Inventory Dashboard</h1>
                    <p className="text-gray-500 mt-1 mb-2">
                        Inventory intelligence & risk monitoring
                    </p>
                </div>

                {/* KPIs */}
                <div className="grid grid-cols-2 xl:grid-cols-5 gap-6 mb-5">
                    <KPI title="Total Products" value={totalProducts} icon={<Package />} color="purple" />
                    <KPI title="Total Tonnage" value={totalTonnageKg.toFixed(2)} icon={<WeightIcon />} color="yellow" />
                    <KPI title="Inventory Value" value={`K${totalValue.toFixed(0)}`} icon={<DollarSign />} color="green" />
                    <KPI title="Low Stock" value={lowStock} icon={<AlertTriangle />} color="yellow" />
                    <KPI title="Out of Stock" value={outOfStock} icon={<XCircle />} color="red" />
                </div>

                {/* MAIN GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-5">

                    {/* STOCK HEALTH */}
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="flex items-center font-semibold mb-4">
                            <Package className="h-5 w-5 mr-2 text-purple-600" />
                            Stock Efficiency
                        </h3>
                        <StockHealthPie inStock={inStock} lowStock={lowStock} outOfStock={outOfStock} />
                    </div>

                    {/* RESTOCK ALERTS */}
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <Bell className="h-5 w-5 text-red-500" />
                            Restock Alerts
                        </h3>
                        {restockAlerts.length === 0 ? (
                            <p className="text-sm text-gray-500">No alerts 🎉</p>
                        ) : (
                            <ul className="space-y-3 text-sm max-h-60 overflow-y-auto">
                                {restockAlerts.map(item => (
                                    <li key={item.id} className="flex justify-between items-center">
                                        <span className="truncate w-1/3">{item.product.name}</span>
                                        <span className="text-xs text-gray-500 w-1/3 text-center">
                                            Low Stock At: {item.lowStockAt} units
                                        </span>
                                        <span className="font-bold text-red-600 w-1/3 text-right">
                                            {item.quantity} units left
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* RECENT PRODUCTS */}
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="flex items-center font-semibold mb-4">
                            <Clock className="h-5 w-5 mr-2 text-blue-500" />
                            Recent Updates
                        </h3>
                        <ul className="space-y-3 text-sm max-h-60 overflow-y-auto">
                            {recentProducts.map(item => (
                                <li key={item.id} className="flex justify-between mr-2">
                                    <span className="truncate">{item.product.name}</span>
                                    <span className="hidden md:inline text-xs text-gray-500 w-1/3 text-center">
                                        Low Stock At: {item.lowStockAt} units
                                    </span>
                                    <span className="text-gray-500">{item.quantity} units Added</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 mb-5">
                    <InventorySummary
                        title="Inventory Summary"
                        iconColor="text-blue-600"
                    />
                </div>
                {/* LOW STOCK BY LOCATION (COLUMNS) */}
                <div className="mb-5">
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow ">
                        <h3 className="font-semibold mb-6 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-yellow-500" />
                            Low Stock by Location
                        </h3>
                        {Object.keys(lowStockByLocation).length === 0 ? (
                            <p className="text-sm text-gray-500">All locations healthy 🎉</p>
                        ) : (
                            <div className="grid gap-6" style={{ gridTemplateColumns: `repeat(${Object.keys(lowStockByLocation).length}, minmax(0, 1fr))` }}>
                                {Object.entries(lowStockByLocation).map(([location, items]) => (
                                    <div key={location} className="border rounded-lg p-4 max-h-48 overflow-y-auto">
                                        <h4 className="font-semibold mb-3">{location}</h4>
                                        <ul className="space-y-2 text-sm">
                                            {items.slice(0, 5).map(item => (
                                                <li key={item.id} className="flex justify-between">
                                                    <span className="truncate">{item.product.name}</span>
                                                    <span className="text-xs text-gray-500 w-1/3 text-center">
                                                        Low Stock At: {item.lowStockAt} units
                                                    </span>
                                                    <span className="font-semibold text-yellow-600">{item.quantity} units</span>
                                                </li>
                                            ))}
                                        </ul>
                                        {items.length > 5 && <p className="text-xs text-gray-400 mt-2">+{items.length - 5} more</p>}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-5">
                    {/* EXPIRING ITEMS */}
                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-orange-500" /> Stocks Expiring in 14 Days
                        </h3>
                        {expiringItems.length === 0 ? (
                            <p className="text-sm text-gray-500">No items expiring soon.</p>
                        ) : (
                            <ul className="space-y-3 text-sm">
                                {expiringItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center">
                                        <span className="truncate font-medium">{item.product.name}</span>
                                        <span className="text-gray-600">Available Stock: {item.quantity} units</span>
                                        <span className="text-orange-500">Expires On: {new Date(item.expiryDate).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
                        <h3 className="font-semibold mb-4 flex items-center gap-2">
                            <AlertTriangle className="h-5 w-5 text-red-500" /> Expired Stocks
                        </h3>
                        {expiredItems.length === 0 ? (
                            <p className="text-sm text-gray-500">No items are expired.</p>
                        ) : (
                            <ul className="space-y-3 text-sm">
                                {expiredItems.map(item => (
                                    <li key={item.id} className="flex justify-between items-center">
                                        <span className="truncate font-medium">{item.product.name}</span>
                                        <span className="text-gray-600">Expired Stock: {item.quantity} units</span>
                                        <span className="text-red-500">Expired On: {new Date(item.expiryDate).toLocaleDateString()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </DashboardLayout>
        </div>
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

type Color = keyof typeof iconColors;

interface Props {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    color: Color;
}

function KPI({ title, value, icon, color }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border flex justify-between items-center">
            <div>
                <p className="text-sm text-gray-500">{title}</p>
                <h2 className="text-2xl font-bold">{value}</h2>
            </div>
            <div className={iconColors[color]} aria-label={`${title} indicator`}>
                {icon}
            </div>
        </div>
    );
}
