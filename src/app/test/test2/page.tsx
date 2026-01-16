export async function getStockReport(): Promise<StockReportRow[]> {
    const whereClause = await getInventoryAccessControl();
    const inventories = await prisma.inventory.findMany({
        where: whereClause,
        include: {
            product: {
                include: {
                    productionItems: {
                        include: {
                            production: true
                        }
                    },
                    transferItems: {
                        include: {
                            transfer: true
                        }
                    },
                    adjustmentItems: {
                        include: {
                            adjustment: true
                        }
                    },
                    saleItems: {
                        include: {
                            sale: true
                        }
                    },
                },
            },
            location: true,
        },
    });

    const report = inventories.map((inv) => {
        const product = inv.product;
        const location = inv.location;

        // Get the first day of the month
        const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);

        // Get the inventory history for the first day of the month
        const openingStock = await getInventoryQuantityAsOfDate(inv.productId, inv.locationId, firstDayOfMonth);

        const production = product.productionItems
            .filter((pi) => pi.production?.locationId === location.id && pi.production?.date >= firstDayOfMonth)
            .reduce((sum, pi) => sum + (pi.quantity || 0), 0);

        const ibtIssued = product.transferItems
            .filter((ti) => ti.transfer?.fromLocationId === location.id && ti.transfer?.date >= firstDayOfMonth)
            .reduce((sum, ti) => sum + (ti.quantity || 0), 0);

        const ibtReceived = product.transferItems
            .filter((ti) => ti.transfer?.toLocationId === location.id && ti.transfer?.date >= firstDayOfMonth)
            .reduce((sum, ti) => sum + (ti.quantity || 0), 0);

        const adjustmentItems = product.adjustmentItems.filter(
            (ai) => ai.adjustment?.locationId === location.id && ai.adjustment?.date >= firstDayOfMonth
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

        const saleItems = product.saleItems.filter((si) => si.sale?.locationId === location.id && si.sale?.date >= firstDayOfMonth);

        const salesQty = saleItems.reduce((sum, si) => sum + (si.quantity || 0), 0);

        const returns = saleItems
            .filter((si) => si.sale?.isReturn)
            .reduce((sum, si) => sum + (si.quantity || 0), 0);

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
            closingStock,
        };
    });

    return report;
}

// Helper function to get inventory quantity as of a specific date
async function getInventoryQuantityAsOfDate(productId: string, locationId: string, date: Date) {
    const inventoryHistory = await prisma.inventoryHistory.findFirst({
        where: {
            productId,
            locationId,
            date: {
                lte: date,
            },
        },
        orderBy: {
            date: 'desc',
        },
    });

    return inventoryHistory ? inventoryHistory.quantity : 0;
}