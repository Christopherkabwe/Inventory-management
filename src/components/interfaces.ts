// interfaces.ts
export interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    packSize: number;
    category?: string;
    weightValue: number;
    weightUnit: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface Inventory {
    id: string;
    product: Product;
    location: Location;
    quantity: number;
    lowStockAt: number;
    expiryDate?: string | null;
    createdBy: string;
    createdAt: string;
    updatedAt: string;
}
export interface Location {
    id: string;
    name: string;
    address?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
    country: string;
    city: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Transporter {
    id: string;
    name: string;
    vehicleNumber?: string;
    driverName?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface Sale {
    id: string;
    invoiceNumber: string;
    deliveryNote?: string;
    customerId: string;
    locationId: string;
    transporterId?: string;
    saleDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    items: SaleItem[];
}

export interface SaleItem {
    id: string;
    saleId: string;
    productId: string;
    quantity: number;
    price: number;
    total: number;
}

export interface Props {
    sales: Sale[];
    productList: Product[];
}