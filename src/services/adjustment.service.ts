// services/adjustment.service.ts
import { recordInventoryTransaction } from "@/lib/inventory";

export async function handleAdjustmentItem(item: any) {
    const delta = item.adjustment.type === "DAMAGED" || item.adjustment.type === "EXPIRED"
        ? -item.quantity
        : item.quantity;

    await recordInventoryTransaction({
        productId: item.productId,
        locationId: item.adjustment.locationId,
        delta,
        source: "ADJUSTMENT",
        reference: `ADJUSTMENT-${item.adjustment.adjustmentNo}`,
        createdById: item.adjustment.createdById,
    });
}
