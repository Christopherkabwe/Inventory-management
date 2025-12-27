export interface ProductList {
    id: string;
    name: string;
    price: number;
    packSize: number;
    weightValue: number;
    weightUnit: string;
}

export interface Sale {
    id: string;
    customerId: string;
    productId: string;
    quantity: number;
    salePrice: number;
    totalAmount: number;
    saleDate: Date;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    customerName: string;

    product?: {
        id: string;
        productId: string;
        name: string;
        price: number;
        category: string | null;
        packSize: number;
        weightValue: number;
        weightUnit: string;
        //weightUnit?: "kg" | "g" | "lb";
    };

    // Add location relation
    locationId: string;
    location: {
        id: string;
        name: string;
        address?: string;

        //product?: ProductList;
        product?: {
            id: string;
            name: string;
            price: number;
            category: string | null;
            packSize: number;
            weightValue: number;
            weightUnit: string;
            //weightUnit?: "kg" | "g" | "lb";
        };
    };
}