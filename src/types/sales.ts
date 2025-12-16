export interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
    quantity: number;
}

export interface Customer {
    id: string;
    name: string;
    email: string;
}

export interface Sale {
    id: string;
    product: { name: string };
    customer: { name: string };
    quantity: number;
    salePrice: number;
    totalAmount: number;
    createdAt: string;
}
