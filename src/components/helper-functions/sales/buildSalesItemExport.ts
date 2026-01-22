import { formatDate, getItemTonnage } from "./buildSalesSummaryExport";

export type SalesItemExportRow = {
    invoiceNumber: string;
    status: string;
    customer: string;
    sku: string;
    product: string;
    packSize: number;
    weight: string;
    quantity: number;
    delivered: number;
    tonnage: string;
    price: string;
    value: string;
    saleDate: string;
};

export function buildSalesItemExport(sales: any[]): SalesItemExportRow[] {
    return sales.flatMap((s) =>
        (s.items || []).map((item: any) => {
            if (!item.product) return null;
            return {
                invoiceNumber: s.invoiceNumber,
                status: s.status,
                customer: s.customer.name,
                sku: item.product.sku,
                product: item.product.name,
                packSize: item.product.packSize,
                weight: `${item.product.weightValue} ${item.product.weightUnit}`,
                quantity: item.quantity,
                delivered: item.quantityDelivered,
                tonnage: getItemTonnage(item).toFixed(2),
                price: (item.price),
                value: (item.quantityDelivered * item.price),
                saleDate: formatDate(s.saleDate),
            };
        }).filter(Boolean)
    );
}