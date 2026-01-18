// services/saleReturn.service.ts
import { recordInventoryTransaction } from "@/lib/inventory";

export async function handleSaleReturn(item: any) {
    await recordInventoryTransaction({
        productId: item.productId,
        locationId: item.locationId,
        delta: item.quantity,
        source: "RETURN",
        reference: `RETURN-${item.returnNumber}`,
        createdById: item.createdById,
    });
}
