// services/sale.service.ts
import { recordInventoryTransaction } from "@/lib/inventory";

export async function handleSaleItem(saleItem: any) {
    await recordInventoryTransaction({
        productId: saleItem.productId,
        locationId: saleItem.sale.locationId,
        delta: -saleItem.quantity, // sale reduces stock
        source: "SALE",
        reference: `SALE-${saleItem.sale.invoiceNumber}`,
        createdById: saleItem.sale.createdById,
    });
}
