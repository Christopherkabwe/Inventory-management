import { Sale } from "./Sale";
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    createdBy: string;
    createdAt: Date;
    updatedAt: Date;
    sales: {
        product: {
            id: string;
            name: string;
            createdBy: string;
            createdAt: Date;
            updatedAt: Date;
            sku: string;
            price: number;
            packSize: number;
            category: string | null;
            weightValue: number;
            weightUnit: string;
        };
        // other properties...
    }[];
}