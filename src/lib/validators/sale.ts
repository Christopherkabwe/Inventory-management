// lib/validators/sale.ts
import { z } from "zod";

export const createSaleSchema = z.object({
    salesOrderId: z.string(),
    customerId: z.string(),
    locationId: z.string(),

    transporterName: z.string().optional(),
    driverName: z.string().optional(),
    vehicleNumber: z.string().optional(),

    items: z.array(
        z.object({
            productId: z.string(),
            quantity: z.number().int().positive(),
            price: z.number().nonnegative(),
        })
    ).min(1),
});

export type CreateSaleInput = z.infer<typeof createSaleSchema>;
