import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function fetchDashboardData() {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const now = new Date();
    const startOfDay = new Date(now);
    startOfDay.setHours(0, 0, 0, 0);
    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const last30Days = new Date(Date.now() - 30 * 86400000);
    const lastYearStart = new Date(now.getFullYear() - 1, 0, 1);
    const lastYearEnd = new Date(now.getFullYear() - 1, 11, 31);

    /* ==================== RBAC LOGIC ==================== */
    let saleWhere: any = {};
    let customerWhere: any = {};
    let inventoryWhere: any = {};
    let deliveryWhere: any = {};
    let productionWhere: any = {};
    let adjustmentWhere: any = {};

    if (user.role === "ADMIN") {
        // Admin sees everything
        saleWhere = {};
        customerWhere = {};
        inventoryWhere = {};
        deliveryWhere = {};
        productionWhere = {};
        adjustmentWhere = {};
    } else if (user.role === "MANAGER") {
        const managedUserIds = await prisma.user
            .findMany({ where: { managerId: user.id }, select: { id: true } })
            .then(res => res.map(u => u.id));

        saleWhere = {
            OR: [
                { createdById: user.id },
                { customer: { userId: { in: managedUserIds } } },
                { locationId: user.locationId },
            ],
        };

        customerWhere = {
            OR: [
                { createdById: user.id },
                { userId: { in: managedUserIds } },
                { locationId: user.locationId },
            ],
        };

        inventoryWhere = {
            OR: [
                { createdById: user.id },
                { assignedUserId: { in: managedUserIds } },
                { locationId: user.locationId },
            ],
        };

        deliveryWhere = {
            OR: [
                { createdById: user.id },
                { locationId: user.locationId },
                { sale: { customer: { userId: { in: managedUserIds } } } },
            ],
        };

        productionWhere = { locationId: user.locationId };
        adjustmentWhere = { locationId: user.locationId };
    } else if (user.role === "USER") {
        saleWhere = {
            OR: [
                { createdById: user.id },
                { customer: { userId: user.id } },
            ],
        };

        customerWhere = {
            OR: [
                { createdById: user.id },
                { userId: user.id },
            ],
        };

        inventoryWhere = {
            OR: [
                { createdById: user.id },
                { assignedUserId: user.id },
            ],
        };

        deliveryWhere = {
            OR: [
                { createdById: user.id },
                { sale: { customer: { userId: user.id } } },
            ],
        };

        productionWhere = { createdById: user.id };
        adjustmentWhere = { createdById: user.id };
    }

    /* ==================== DATA FETCH ==================== */
    const [
        sales,
        orders,
        deliveries,
        customers,
        quotations,
        returns,
        transfers,
        users,
        productions,
        inventories,
        adjustments,
        transportersCount
    ] = await Promise.all([
        prisma.sale.findMany({
            where: saleWhere,
            include: {
                items: { include: { product: true } },
                customer: { include: { user: true } },
                location: true,
                createdBy: true,
                creditNotes: { include: { createdBy: true } },
                returns: { include: { product: true, createdBy: true } },
                deliveryNotes: {
                    include: {
                        transporter: true,
                        createdBy: true,
                        items: { include: { product: true } },
                    },
                },
                transporter: true,
            },
        }),

        prisma.salesOrder.findMany({ where: saleWhere }),
        prisma.deliveryNote.findMany({ where: deliveryWhere }),
        prisma.customer.findMany({ where: customerWhere, include: { sales: true } }),
        prisma.quotation.findMany(),
        prisma.saleReturn.findMany(),
        prisma.transfer.findMany({ where: { status: "PENDING" } }),
        prisma.user.findMany(),
        prisma.production.findMany({ where: productionWhere, include: { items: true } }),
        prisma.inventory.findMany({ where: inventoryWhere }),
        prisma.adjustment.findMany({ where: adjustmentWhere, include: { items: true } }),
        prisma.transporter.count()
    ]);

    /* ==================== SALES KPIs ==================== */
    const totalSales = sales.reduce(
        (sum, s) => sum + s.items.reduce((i, it) => i + it.quantity * it.price, 0),
        0
    );

    const totalOrders = sales.length;
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;
    const salesVelocity = avgOrderValue;
    const avgItemsPerOrder =
        totalOrders === 0
            ? 0
            : sales.reduce((sum, s) => sum + s.items.length, 0) / totalOrders;

    const cancelledOrders = orders.filter(o => o.status === "CANCELLED").length;

    const salesBetween = (from: Date) =>
        sales
            .filter(s => s.saleDate >= from)
            .reduce((sum, s) => sum + s.items.reduce((i, it) => i + it.quantity * it.price, 0), 0);

    const salesFTD = salesBetween(startOfDay);
    const salesWTD = salesBetween(startOfWeek);
    const salesMTD = salesBetween(startOfMonth);
    const salesYTD = salesBetween(startOfYear);

    const salesLastYear = sales
        .filter(s => s.saleDate >= lastYearStart && s.saleDate <= lastYearEnd)
        .reduce((sum, s) => sum + s.items.reduce((i, it) => i + it.quantity * it.price, 0), 0);

    const yoyGrowth = salesLastYear === 0 ? 0 : ((salesYTD - salesLastYear) / salesLastYear) * 100;
    const monthlyGrowth = salesMTD === 0 ? 0 : ((salesMTD - salesFTD) / salesMTD) * 100;

    /* ==================== TONNAGE ==================== */
    const tonnageBetween = (from: Date) =>
        sales
            .filter(s => new Date(s.saleDate) >= from)
            .reduce((sum, sale) => {
                return (
                    sum +
                    sale.items.reduce((itemSum, item) => {
                        const product = item.product;
                        if (!product) return itemSum;

                        const weightKg =
                            (product.weightValue ?? 0) *
                            (product.packSize ?? 1) *
                            item.quantity;

                        // convert KG → TONS
                        return itemSum + weightKg / 1000;
                    }, 0)
                );
            }, 0);

    const tonnageFTD = tonnageBetween(startOfDay);
    const tonnageWTD = tonnageBetween(startOfWeek);
    const tonnageMTD = tonnageBetween(startOfMonth);
    const tonnageYTD = tonnageBetween(startOfYear);
    const tonnageSold30Days = tonnageBetween(last30Days);

    /* ==================== CUSTOMERS ==================== */
    const totalCustomers = customers.length;
    const repeatCustomerRate = totalCustomers === 0
        ? 0
        : (customers.filter(c => c.sales.length > 1).length / totalCustomers) * 100;

    const newCustomers30Days = customers.filter(c => c.createdAt >= last30Days).length;
    const revenuePerCustomer = totalCustomers === 0 ? 0 : totalSales / totalCustomers;
    const customerChurnRate = totalCustomers === 0
        ? 0
        : (customers.filter(c => c.sales.length === 0).length / totalCustomers) * 100;
    const customerLifetimeValue = revenuePerCustomer * 12;

    /* ==================== LOCATION ==================== */
    const locationMap: Record<string, number> = {};
    sales.forEach(s => {
        const name = s.location?.name ?? "Unknown";
        locationMap[name] = (locationMap[name] || 0) + 1;
    });

    const topLocation = Object.entries(locationMap).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "N/A";
    const ordersPerLocation =
        Object.values(locationMap).reduce((a, b) => a + b, 0) / Math.max(Object.keys(locationMap).length, 1);
    const fulfillmentRate = orders.length === 0 ? 0 : (deliveries.length / orders.length) * 100;

    /* ==================== INVENTORY ==================== */
    const lowStockItems = inventories.filter(i => i.quantity <= i.lowStockAt).length;
    const expiredProducts = inventories.filter(i => i.expiryDate && i.expiryDate < now).length;
    const damagedStock = adjustments.filter(a => a.type === "DAMAGED").length;
    const stockRiskItems = lowStockItems + expiredProducts;

    /* ==================== PRODUCTS ==================== */
    const productSalesMap: Record<string, number> = {};
    sales.forEach(s => {
        s.items.forEach(i => {
            const name = i.product?.name ?? "Unknown";
            productSalesMap[name] = (productSalesMap[name] || 0) + i.quantity;
        });
    });

    const productSales = Object.entries(productSalesMap).map(([name, sold]) => ({ name, sold }));
    const topSellingProduct = productSales.sort((a, b) => b.sold - a.sold)[0]?.name ?? "N/A";
    const leastSellingProduct = productSales.sort((a, b) => a.sold - b.sold)[0]?.name ?? "N/A";

    const totalUnitsSold = productSales.reduce((sum, p) => sum + p.sold, 0);
    const totalStock = inventories.reduce((sum, i) => sum + i.quantity, 0);
    const stockTurnoverRate = totalStock === 0 ? 0 : totalUnitsSold / totalStock;
    const totalProducts = Object.keys(productSalesMap).length;

    /* ==================== ORDERS / OPS ==================== */
    const pendingOrders = orders.filter(o => o.status === "PENDING").length;
    const partiallyFilledOrders = orders.filter(o => o.status === "PARTIALLY_INVOICED").length;
    const pendingQuotations = quotations.filter(q => q.status === "PENDING").length;
    const rejectedQuotations = quotations.filter(q => q.status === "REJECTED").length;
    const mtdReturns = returns.filter(r => r.createdAt >= startOfMonth).length;

    /* ==================== DELIVERIES ==================== */
    const avgDeliveryTime = 0; // placeholder
    const dailyDeliveries = deliveries.filter(d => d.createdAt >= startOfDay).length;
    const weeklyDeliveries = deliveries.filter(d => d.createdAt >= startOfWeek).length;

    /* ==================== USERS ==================== */
    const totalUsers = users.length;
    const activeUsers = users.filter(u => u.isActive).length;

    /* ==================== TRANSPORT ==================== */
    const totalTransporters = transportersCount;
    const pendingTransfers = transfers.length;

    /* ==================== PRODUCTION ==================== */
    const totalProduction = productions.reduce(
        (sum, p) => sum + p.items.reduce((i, it) => i + it.quantity, 0),
        0
    );

    return {
        totalSales,
        totalOrders,
        avgOrderValue,
        salesVelocity,
        avgItemsPerOrder,
        cancelledOrders,

        yoyGrowth,
        monthlyGrowth,

        salesFTD,
        salesWTD,
        salesMTD,
        salesYTD,

        tonnageFTD,
        tonnageWTD,
        tonnageMTD,
        tonnageYTD,
        tonnageSold30Days,

        totalCustomers,
        repeatCustomerRate,
        newCustomers30Days,
        revenuePerCustomer,
        customerChurnRate,
        customerLifetimeValue,

        topLocation,
        ordersPerLocation,
        fulfillmentRate,

        lowStockItems,
        expiredProducts,
        damagedStock,
        stockTurnoverRate,
        stockRiskItems,
        totalProducts,
        topSellingProduct,
        leastSellingProduct,

        pendingOrders,
        partiallyFilledOrders,
        pendingQuotations,
        rejectedQuotations,
        mtdReturns,

        avgDeliveryTime,
        dailyDeliveries,
        weeklyDeliveries,

        totalUsers,
        activeUsers,

        totalTransporters,
        pendingTransfers,

        totalProduction,
    };
}
