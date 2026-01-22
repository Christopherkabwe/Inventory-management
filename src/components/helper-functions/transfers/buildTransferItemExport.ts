type TransferItemExportRow = {
    ibtNumber: string;
    status: string;
    from: string;
    to: string;
    sku: string;
    product: string;
    packSize: number;
    weight: string;
    quantity: number;
    tonnage: string;
    createdAt: string;
};


import { formatDateTime, getItemTonnage } from "./buildTransferSummaryExport";

export function buildTransferItemExport(transfers: any[]): TransferItemExportRow[] {
    return transfers.flatMap(t =>
        t.items.map((item: any) => ({
            ibtNumber: t.ibtNumber,
            status: t.status,
            from: t.fromLocation.name,
            to: t.toLocation.name,
            sku: item.product.sku,
            product: item.product.name,
            packSize: item.product.packSize,
            weight: `${item.product.weightValue} ${item.product.weightUnit}`,
            quantity: item.quantity,
            tonnage: getItemTonnage(item).toFixed(2),
            createdAt: formatDateTime(t.createdAt),
        }))
    );
}
