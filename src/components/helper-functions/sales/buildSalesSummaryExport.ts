import { ExportHeader } from "@/lib/ExportUtils";

export type SalesSummaryExportRow = {
    invoiceNumber: string;
    status: string;
    customer: string;
    location: string;
    quantity: number;
    delivered: number;
    tonnage: string;
    salesValue: string;
    invoiceValue: string;
    saleDate: string;
};

export function formatDate(value: string | Date) {
    const d = new Date(value);
    return d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    });
}
export const getItemTonnage = (item: any) =>
    (item.quantity * item.product.weightValue * item.product.packSize) / 1000;

const getSubtotal = (items: SaleItemType[]) => {
    if (!items) return { qty: 0, delivered: 0, tonnage: 0, salesValue: 0, invoiceValue: 0 };
    return items.reduce(
        (acc, i) => {
            acc.qty += i.quantity;
            acc.delivered += i.quantityDelivered;
            acc.tonnage += getItemTonnage(i);
            acc.salesValue += i.quantity * i.price;
            acc.invoiceValue += i.quantityDelivered * i.price;
            return acc;
        },
        { qty: 0, delivered: 0, tonnage: 0, salesValue: 0, invoiceValue: 0 }
    );
};

export default function buildSalesSummaryExport(sales: any[]): SalesSummaryExportRow[] {
    return sales.map((s) => {
        const subtotal = getSubtotal(s.items);

        return {
            invoiceNumber: s.invoiceNumber,
            status: s.status,
            customer: s.customer.name,
            location: s.location.name,
            quantity: subtotal.qty,
            delivered: subtotal.delivered,
            tonnage: subtotal.tonnage,
            salesValue: subtotal.salesValue,
            invoiceValue: (subtotal.invoiceValue),
            saleDate: formatDate(s.saleDate),
        };
    });
}
