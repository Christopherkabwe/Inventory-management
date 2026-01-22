type TransferExportRow = {
    ibtNumber: string;
    status: string;
    from: string;
    to: string;
    quantity: number;
    tonnage: string;
    createdAt: string;
};

export function formatDateTime(value: string | Date) {
    const d = new Date(value);

    return `${d.toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "2-digit",
    })} ${d.toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
    })}`;
}

export const getItemTonnage = (item: any) =>
    (item.quantity * item.product.weightValue * item.product.packSize) / 1000;

export const getSubtotal = (items: any[]) => {
    return items.reduce(
        (acc, item) => {
            acc.qty += item.quantity;
            acc.tonnage += getItemTonnage(item);
            return acc;
        },
        { qty: 0, tonnage: 0 }
    );
};
export default function buildTransferSummaryExport(transfers: any[]): TransferExportRow[] {
    return transfers.map(t => {
        const subtotal = getSubtotal(t.items);

        return {
            ibtNumber: t.ibtNumber,
            status: t.status,
            from: t.fromLocation.name,
            to: t.toLocation.name,
            quantity: subtotal.qty,
            tonnage: subtotal.tonnage.toFixed(2),
            createdAt: formatDateTime(t.createdAt),
        };
    });
}
