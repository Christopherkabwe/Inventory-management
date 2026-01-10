// types/Sale.ts
export interface Product {
    id: string;
    name: string;
    packSize: number;
    category?: string | null;
    weightValue: number;
    weightUnit: string;
}

export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    product: Product;
    quantity: number;
    price: number;
    total: number;
}

export interface Location {
    id: string;
    name: string;
    address?: string | null;
}

export interface Customer {
    id: string;
    name: string;
    user: string;
}

export interface Sale {
    id: string;
    invoiceNumber: string;
    deliveryNote?: string | null;
    customerId: string;
    customer: Customer;
    locationId: string;
    location: Location;
    transporterId?: string | null;
    saleDate: string; // ISO string
    createdBy: string;
    createdById: string;
    createdAt: string;
    updatedAt: string;
    items: SaleItem[];
}

// Aggregated row
interface AggregatedRow {
    id: string;
    name: string;
    saleCount: number;
    quantity: number;
    totalTonnage: number;
    totalSalesValue: number;
    avgOrderValue: number;
    contribution: number;
}

