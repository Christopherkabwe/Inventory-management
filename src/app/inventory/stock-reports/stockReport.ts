// lib/reports.ts
import { prisma } from "@/lib/prisma";

export type StockReportRow = {
    productName: string;
    location: string;
    openingStock: number;
    production: number;
    ibtReceived: number;
    ibtIssued: number;
    rebagGain: number;
    rebagLoss: number;
    damaged: number;
    expired: number;
    returns: number;
    salesQty: number;
    closingStock: number;
};

export async function getStockReport(): Promise<StockReportRow[]> {
    // Fetch all inventories with product and location
    const inventories = await prisma.inventory.findMany({
        include: {
            product: {
                include: {
                    productions: true,
                    adjustments: true,
                    transfers: true,
                    sales: true,
                },
            },
            location: true,
        },
    });

    // Build report row by row
    const report = inventories.map((inv) => {
        const product = inv.product;
        const location = inv.location;

        // Opening stock is current inventory quantity
        const openingStock = inv.quantity;

        // Production received
        const production = product.productions.reduce((acc, p) => acc + p.quantity, 0);

        // IBT (Internal Transfers)
        const ibtIssued = product.transfers
            .filter((t) => t.fromLocationId === location.id)
            .reduce((acc, t) => acc + t.quantity, 0);

        const ibtReceived = product.transfers
            .filter((t) => t.toLocationId === location.id)
            .reduce((acc, t) => acc + t.quantity, 0);

        // Adjustments
        const rebagGain = product.adjustments
            .filter(a => a.locationId === location.id && a.type === "REBAG_GAIN")
            .reduce((acc, a) => acc + a.quantity, 0);

        const rebagLoss = product.adjustments
            .filter(a => a.locationId === location.id && a.type === "REBAG_LOSS")
            .reduce((acc, a) => acc + a.quantity, 0);

        const damaged = product.adjustments
            .filter((a) => a.locationId === location.id && a.type === "DAMAGED")
            .reduce((acc, a) => acc + a.quantity, 0);

        const expired = product.adjustments
            .filter((a) => a.locationId === location.id && a.type === "EXPIRED")
            .reduce((acc, a) => acc + a.quantity, 0);

        // Sales
        const salesQty = product.sales
            .filter((s) => s.locationId === location.id && !s.isReturn)
            .reduce((acc, s) => acc + s.quantity, 0);

        const returns = product.sales
            .filter((s) => s.locationId === location.id && s.isReturn)
            .reduce((acc, s) => acc + s.quantity, 0);

        // Closing stock
        const closingStock =
            openingStock +
            production +
            ibtReceived +
            rebagGain +
            returns -
            ibtIssued -
            salesQty -
            damaged -
            expired -
            rebagLoss;

        return {
            productName: product.name,
            location: location.name,
            openingStock,
            production,
            ibtReceived,
            ibtIssued,
            rebagGain,
            rebagLoss,
            damaged,
            expired,
            returns,
            salesQty,
            closingStock,
        };
    });

    return report;
}
