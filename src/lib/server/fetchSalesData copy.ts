import { prisma } from "@/lib/prisma";

/**
 * Fetches sales data with all relevant relations.
 * Server-only (Prisma)
 */
export async function fetchSalesData() {
    const sales = await prisma.sale.findMany({
        include: {
            product: true,
            location: true,
            customer: true,
            stockMovements: true,
        },
        orderBy: {
            saleDate: "desc",
        },
    });

    return { sales };
}