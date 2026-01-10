import { prisma } from "@/lib/prisma";
import { CurrentUser, UserRole } from "@/lib/rbac";

export async function fetchKPIs(user: CurrentUser) {
    const now = new Date();
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday

    // ------------------- RBAC FILTERS -------------------
    let locationFilter: any = {};
    let userFilter: any = {};

    if (user.role === UserRole.ADMIN) {
        locationFilter = {};
        userFilter = {};
    } else if (user.role === UserRole.MANAGER) {
        locationFilter = { OR: [{ locationId: user.locationId }, { createdById: user.id }] };
        userFilter = { OR: [{ locationId: user.locationId }, { id: user.id }] };
    } else {
        locationFilter = { locationId: user.locationId };
        userFilter = { locationId: user.locationId };
    }

    // ------------------- SALES -------------------
    const sales = await prisma.sale.findMany({
        where: locationFilter,
        include: {
            items: { include: { product: true } },
            customer: true,
            location: true,
            transporter: true,
            deliveryNotes: true,
        },
    });

    const totalSales = sales.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0) * (i.price || 0), 0) || 0),
        0
    );
    const totalOrders = sales.length;
    const avgOrderValue = totalOrders ? totalSales / totalOrders : 0;

    const totalItems = sales.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0), 0) || 0),
        0
    );
    const avgItemsPerOrder = totalOrders ? totalItems / totalOrders : 0;

    const cancelledOrders = sales.filter(s => s.status === "CANCELLED").length;

    const salesByLocation: Record<string, number> = {};
    const salesByTransporter: Record<string, number> = {};
    sales.forEach(s => {
        const loc = s.location?.name ?? "Unknown";
        const total = s.items?.reduce((sum, i) => sum + (i.quantity || 0) * (i.price || 0), 0) || 0;
        salesByLocation[loc] = (salesByLocation[loc] || 0) + total;

        const transporter = s.transporter?.name ?? "Unknown";
        salesByTransporter[transporter] = (salesByTransporter[transporter] || 0) + total;
    });

    // Top / Least Selling Product
    const salesLast30Days = sales.filter(s => new Date(s.saleDate) >= thirtyDaysAgo);
    const productSalesMap: Record<string, number> = {};
    salesLast30Days.forEach(s =>
        s.items?.forEach(i => {
            productSalesMap[i.productId] = (productSalesMap[i.productId] || 0) + (i.quantity || 0);
        })
    );

    const products = await prisma.productList.findMany();
    const productMap = Object.fromEntries(products.map(p => [p.id, p]));
    const totalProducts = products.length;

    const topSellingProductId = Object.entries(productSalesMap).sort((a, b) => b[1] - a[1])[0]?.[0];
    const topSellingProduct = topSellingProductId ? productMap[topSellingProductId]?.name : "N/A";

    const leastSellingProductId = Object.entries(productSalesMap).sort((a, b) => a[1] - b[1])[0]?.[0];
    const leastSellingProduct = leastSellingProductId ? productMap[leastSellingProductId]?.name : "N/A";

    // YTD & Monthly Growth
    const salesThisMonth = sales.filter(s => new Date(s.saleDate) >= startOfMonth);
    const totalSalesThisMonth = salesThisMonth.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0) * (i.price || 0), 0) || 0),
        0
    );

    const salesLastMonth = sales.filter(s => {
        const d = new Date(s.saleDate);
        return d.getMonth() === now.getMonth() - 1 && d.getFullYear() === now.getFullYear();
    });
    const totalSalesLastMonth = salesLastMonth.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0) * (i.price || 0), 0) || 0),
        0
    );
    const monthlyGrowth = totalSalesLastMonth ? ((totalSalesThisMonth - totalSalesLastMonth) / totalSalesLastMonth) * 100 : 0;

    const startOfLastYear = new Date(now.getFullYear() - 1, 0, 1);
    const endOfLastYear = new Date(now.getFullYear() - 1, 11, 31);
    const salesLastYear = sales.filter(s => new Date(s.saleDate) >= startOfLastYear && new Date(s.saleDate) <= endOfLastYear);
    const totalSalesLastYear = salesLastYear.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0) * (i.price || 0), 0) || 0),
        0
    );
    const yoyGrowth = totalSalesLastYear ? ((totalSales - totalSalesLastYear) / totalSalesLastYear) * 100 : 0;

    const salesVelocity = salesLast30Days.reduce(
        (sum, s) => sum + (s.items?.reduce((isum, i) => isum + (i.quantity || 0) * (i.price || 0), 0) || 0),
        0
    ) / 30;

    // ------------------- CUSTOMERS -------------------
    const customers = await prisma.customer.findMany({
        where: userFilter,
        include: { sales: { include: { items: true } } },
    });

    const totalCustomers = customers.length;
    const revenuePerCustomer = totalCustomers ? totalSales / totalCustomers : 0;
    const repeatCustomerRate = totalCustomers ? (customers.filter(c => c.sales?.length > 1).length / totalCustomers) * 100 : 0;
    const newCustomers30Days = customers.filter(c => new Date(c.createdAt) >= thirtyDaysAgo).length;
    const churnCustomers = customers.filter(c => !c.sales?.some(s => new Date(s.saleDate) >= ninetyDaysAgo)).length;
    const customerChurnRate = totalCustomers ? (churnCustomers / totalCustomers) * 100 : 0;
    const customerLifetimeValue = customers.reduce(
        (sum, c) =>
            sum +
            (c.sales?.reduce(
                (isum, s) => isum + (s.items?.reduce((ii, i) => ii + (i.quantity || 0) * (i.price || 0), 0) || 0),
                0
            ) || 0),
        0
    );

    // ------------------- LOCATION / OPERATIONS -------------------
    const ordersPerLocation: Record<string, number> = {};
    const deliveryTimes: number[] = [];
    sales.forEach(s => {
        const loc = s.location?.name ?? "Unknown";
        ordersPerLocation[loc] = (ordersPerLocation[loc] || 0) + 1;

        if (s.deliveryNotes?.length) {
            const deliveryDate = new Date(s.deliveryNotes[0].dispatchedAt);
            const orderDate = new Date(s.saleDate);
            deliveryTimes.push((deliveryDate.getTime() - orderDate.getTime()) / (1000 * 60 * 60 * 24));
        }
    });
    const avgDeliveryTime = deliveryTimes.length ? deliveryTimes.reduce((a, b) => a + b, 0) / deliveryTimes.length : 0;

    const totalOrderedQty = sales.reduce(
        (sum, s) => sum + (s.items?.reduce((iSum, i) => iSum + (i.quantity || 0), 0) || 0),
        0
    );
    const totalDeliveredQty = sales.reduce(
        (sum, s) => sum + (s.items?.reduce((iSum, i) => iSum + (i.quantityDelivered || 0), 0) || 0),
        0
    );
    const fulfillmentRate = totalOrderedQty ? (totalDeliveredQty / totalOrderedQty) * 100 : 0;
    const topLocation = Object.entries(salesByLocation).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "None";

    // ------------------- INVENTORY / PRODUCTS -------------------
    const inventories = await prisma.inventory.findMany({ where: locationFilter, include: { product: true } });
    const tonnageSold = salesLast30Days.reduce((sum, s) => {
        return sum + (s.items?.reduce((iSum, i) => {
            const product = productMap[i.productId];
            return product ? iSum + (product.weightValue * product.packSize * (i.quantity || 0)) / 1000 : iSum;
        }, 0) || 0);
    }, 0);

    const lowStockItems = inventories.filter(inv => inv.quantity <= inv.lowStockAt).length;
    const expiredProducts = inventories.filter(inv => inv.expiryDate && new Date(inv.expiryDate) < now).length;

    const damagedStock = await prisma.adjustmentItem.count({
        where: { adjustment: { type: "DAMAGED", locationId: user.role === UserRole.ADMIN ? undefined : user.locationId } },
    });

    const stockTurnoverRate =
        inventories.length
            ? totalSales / (inventories.reduce((sum, inv) => sum + (inv.quantity || 0) * (inv.product?.price || 0), 0) || 1)
            : 0;

    const stockRiskItems = Object.entries(productSalesMap).filter(([_, qty]) => qty < 5).length;

    // ------------------- USERS / TRANSPORTERS -------------------
    const totalUsers = user.role === UserRole.ADMIN ? await prisma.user.count() : await prisma.user.count({ where: userFilter });
    const activeUsers = user.role === UserRole.ADMIN ? await prisma.user.count({ where: { isActive: true } }) : totalUsers;

    const totalTransporters = await prisma.transporter.count();

    // ------------------- ORDERS / DELIVERIES / QUOTATIONS / RETURNS / TRANSFERS / PRODUCTION -------------------
    const pendingOrders = await prisma.salesOrder.count({ where: { status: "PENDING", ...locationFilter } });
    const partiallyFilledOrders = await prisma.salesOrder.count({ where: { status: "PARTIALLY_INVOICED", ...locationFilter } });

    const dailyDeliveries = await prisma.deliveryNote.count({ where: { dispatchedAt: { gte: startOfDay }, ...locationFilter } });
    const weeklyDeliveries = await prisma.deliveryNote.count({ where: { dispatchedAt: { gte: startOfWeek }, ...locationFilter } });

    const pendingQuotations = await prisma.quotation.count({ where: { status: "PENDING", ...locationFilter } });
    const rejectedQuotations = await prisma.quotation.count({ where: { status: "REJECTED", ...locationFilter } });

    const mtdReturns = await prisma.saleReturn.count();
    const transfersPending = await prisma.transfer.count({ where: { status: "PENDING" } });
    const totalProduction = await prisma.production.count({ where: locationFilter });

    // ------------------- SALES (FTD/WTD/MTD/YTD) -------------------
    const sumSales = (from: Date) =>
        sales
            .filter(s => s.saleDate >= from)
            .reduce((acc, s) => acc + s.items.reduce((sum, i) => sum + i.quantity * i.price, 0), 0);

    const salesFTD = sumSales(startOfDay);
    const salesWTD = sumSales(startOfWeek);
    const salesMTD = sumSales(startOfMonth);
    const salesYTD = sumSales(startOfYear);

    const tonnage = (from: Date) =>
        sales
            .filter(s => s.saleDate >= from)
            .reduce((acc, s) => acc + s.items.reduce((sum, i) => sum + (i.product.weightValue * i.quantity) / 1000, 0), 0);

    const tonnageFTD = tonnage(startOfDay);
    const tonnageWTD = tonnage(startOfWeek);
    const tonnageMTD = tonnage(startOfMonth);
    const tonnageYTD = tonnage(startOfYear);

    return {
        // Sales
        totalSales,
        totalOrders,
        avgOrderValue,
        avgItemsPerOrder,
        cancelledOrders,
        salesByLocation,
        salesByTransporter,
        topSellingProduct,
        leastSellingProduct,
        yoyGrowth,
        monthlyGrowth,
        salesVelocity,

        // Customers
        totalCustomers,
        revenuePerCustomer,
        repeatCustomerRate,
        newCustomers30Days,
        customerChurnRate,
        customerLifetimeValue,

        // Locations / Ops
        ordersPerLocation,
        fulfillmentRate,
        avgDeliveryTime,
        topLocation,

        // Inventory / Products
        tonnageSold,
        lowStockItems,
        expiredProducts,
        damagedStock,
        stockRiskItems,
        stockTurnoverRate,

        // Users / Transporters
        totalUsers,
        activeUsers,
        totalProducts,
        totalTransporters,

        // Orders / Deliveries / Quotations / Returns / Transfers / Production
        pendingOrders,
        partiallyFilledOrders,
        dailyDeliveries,
        weeklyDeliveries,
        salesFTD,
        salesWTD,
        salesMTD,
        salesYTD,
        tonnageFTD,
        tonnageWTD,
        tonnageMTD,
        tonnageYTD,
        pendingQuotations,
        rejectedQuotations,
        mtdReturns,
        transfersPending,
        totalProduction,
    };
}
