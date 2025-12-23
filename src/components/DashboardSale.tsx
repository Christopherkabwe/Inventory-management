export interface DashboardSale {
    id: string;
    customerId: string;
    customerName: string;
    address: { name: string };
    productId: string;
    quantity: number;
    salePrice: number;
    totalAmount: number;
    saleDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    location: { name: string };
    locationId: string;
    product: { id: string; name: string; price: number; category: string | null; packSize: number; weightValue: number; weightUnit: string };
}
