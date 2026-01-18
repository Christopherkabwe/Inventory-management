// services/production.service.ts
import { recordInventoryTransaction } from "@/lib/inventory";

export async function handleProductionItem(item: any) {
    await recordInventoryTransaction({
        productId: item.productId,
        locationId: item.production.locationId,
        delta: item.quantity,
        source: "PRODUCTION",
        reference: `PRODUCTION-${item.production.productionNo}`,
        createdById: item.production.createdById,
    });
}
