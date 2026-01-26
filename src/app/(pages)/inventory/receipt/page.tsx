// src/app/inventory/receipt/page.tsx (Server Component)
import { logStockMovement } from '@/lib/stockMovement';

export const metadata = {
    title: "Stock Receipts",
};

export default async function ReceiveStock() {
    const movement = await logStockMovement({
        inventoryId: 'inv123',
        type: 'RECEIPT',
        quantity: 50,
        createdBy: 'user123',
        reason: 'New shipment',
    });

    return <div>Received {movement.quantity} items.</div>;
}
