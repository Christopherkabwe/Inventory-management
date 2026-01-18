import { prisma } from "@/lib/prisma";
import { getInventoryAccessControl } from "./Access-Control/InventoryAccessControl";

export type StockReportRow = {
    productName: string;
    sku: string;
    category: string | null;
    weightValue: number;
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
    inTransit: number;
    closingStock: number;
};
export async function getStockReport(): Promise<StockReportRow[]> {
    const whereClause = await getInventoryAccessControl();
    const inventories = await prisma.inventory.findMany({
        where: whereClause,
        include: {
            product: {
                include: {
                    productionItems: {
                        include: {
                            production: true,
                        },
                    },
                    transferItems: {
                        include: {
                            transfer: true,
                        },
                    },
                    adjustmentItems: {
                        include: {
                            adjustment: true,
                        },
                    },
                    saleItems: {
                        include: {
                            sale: true,
                        },
                    },
                },
            },
            location: true,
        },
    });

    const report = await Promise.all(
        inventories.map(async (inv) => {
            const product = inv.product;
            const location = inv.location;

            // Get the first day of the week
            const firstDayOfWeek = new Date();
            firstDayOfWeek.setDate(firstDayOfWeek.getDate() - firstDayOfWeek.getDay());

            // Get the opening stock from InventoryHistory
            const openingStockHistory = await prisma.inventoryHistory.findFirst({
                where: {
                    productId: product.id,
                    locationId: location.id,
                    date: {
                        lte: firstDayOfWeek,
                    },
                },
                orderBy: {
                    date: 'desc',
                },
            });

            const openingStock = openingStockHistory?.quantity || 0;

            const production = product.productionItems
                .filter((pi) => pi.production?.locationId === location.id)
                .reduce((sum, pi) => sum + (pi.quantity || 0), 0);

            const ibtIssued = product.transferItems
                .filter((ti) => ti.transfer?.fromLocationId === location.id)
                .reduce((sum, ti) => sum + (ti.quantity || 0), 0);

            const ibtReceived = product.transferItems
                .filter((ti) => ti.transfer?.toLocationId === location.id)
                .reduce((sum, ti) => sum + (ti.quantity || 0), 0);

            const adjustmentItems = product.adjustmentItems.filter(
                (ai) => ai.adjustment?.locationId === location.id
            );

            const rebagGain = adjustmentItems
                .filter((ai) => ai.adjustment?.type === "REBAG_GAIN")
                .reduce((sum, ai) => sum + (ai.quantity || 0), 0);

            const rebagLoss = adjustmentItems
                .filter((ai) => ai.adjustment?.type === "REBAG_LOSS")
                .reduce((sum, ai) => sum + (ai.quantity || 0), 0);

            const damaged = adjustmentItems
                .filter((ai) => ai.adjustment?.type === "DAMAGED")
                .reduce((sum, ai) => sum + (ai.quantity || 0), 0);

            const expired = adjustmentItems
                .filter((ai) => ai.adjustment?.type === "EXPIRED")
                .reduce((sum, ai) => sum + (ai.quantity || 0), 0);

            const saleItems = product.saleItems.filter((si) => si.sale?.locationId === location.id);

            const salesQty = saleItems.reduce((sum, si) => sum + (si.quantity || 0), 0);

            const returns = saleItems
                .filter((si) => si.sale?.isReturn)
                .reduce((sum, si) => sum + (si.quantity || 0), 0);

            const inTransit = product.transferItems
                .filter((ti) => ti.transfer?.toLocationId === location.id && ti.transfer?.status === 'PENDING')
                .reduce((sum, ti) => sum + (ti.quantity || 0), 0);

            const closingStock = openingStock + production + ibtReceived + rebagGain + returns - ibtIssued - salesQty - damaged - expired - rebagLoss;

            return {
                productName: product.name,
                sku: product.sku,
                category: product.category,
                weightValue: Number(product.weightValue.toFixed(2)),
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
                inTransit,
                closingStock,
            };
        })
    );

    return report;
}