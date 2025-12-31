export interface Sale {
    id: string;
    customerId: string;
    customerName: string;
    productId: string;
    locationId: string;
    quantity: number;
    salePrice: number;
    totalAmount: number;
    saleDate: Date; // <-- change to Date
    isReturn: boolean;
    createdBy: string;
    createdAt: Date; // <-- change to Date
    updatedAt: Date; // <-- change to Date
    customer?: {
        id: string;
        name: string;
        email: string;
        phone: string;
        country: string;
        city: string;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    };
    product?: {
        id: string;
        sku: string;
        name: string;
        price: number;
        packSize: number;
        category: string | null;
        weightValue: number;
        weightUnit: string;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    };
    location?: {
        id: string;
        name: string;
        address: string | null;
        createdBy: string;
        createdAt: Date;
        updatedAt: Date;
    };
}
