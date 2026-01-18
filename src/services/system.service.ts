// services/system.service.ts
import { recordInventoryTransaction } from "@/lib/inventory";

export async function initializeInventory(item: any) {
    await recordInventoryTransaction({
        productId: item.productId,
        locationId: item.locationId,
        delta: item.quantity,
        source: "SYSTEM",
        reference: "INITIAL_STOCK",
        createdById: item.createdById,
    });
}
