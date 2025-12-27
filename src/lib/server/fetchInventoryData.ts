import { prisma } from "@/lib/prisma";

/**
 * Fetches all inventory-related data needed by dashboards,
 * tables, charts, exports, etc.
 *
 * ⚠️ Server-only (Prisma)
 */
export async function fetchInventoryData() {
    const [
        products,
        inventories,
        locations,
        customers,
        sales,
        stockMovements,
    ] = await Promise.all([
        prisma.productList.findMany({
            include: {
                inventories: {
                    include: {
                        location: true,
                    },
                },
            },
            orderBy: { createdAt: "desc" },
        }),

        prisma.inventory.findMany({
            include: {
                product: true,
                location: true,
                stockMovements: {
                    orderBy: { createdAt: "desc" },
                },
            },
        }),

        prisma.location.findMany({
            include: {
                inventories: {
                    include: {
                        product: true,
                    },
                },
            },
            orderBy: { name: "asc" },
        }),

        prisma.customer.findMany({
            include: {
                sales: true,
            },
            orderBy: { name: "asc" },
        }),

        prisma.sale.findMany({
            include: {
                product: true,
                location: true,
                customer: true,
                stockMovements: true,
            },
            orderBy: { saleDate: "desc" },
        }),

        prisma.stockMovement.findMany({
            include: {
                inventory: {
                    include: {
                        product: true,
                        location: true,
                    },
                },
                fromLocation: true,
                toLocation: true,
                sale: true,
                customer: true,
            },
            orderBy: { createdAt: "desc" },
        }),
    ]);

    return {
        products,
        inventories,
        locations,
        customers,
        sales,
        stockMovements,
    };
}
