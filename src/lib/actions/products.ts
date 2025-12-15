"use server"

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";

const ProductSchema = z.object({
    name: z.string().min(3, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.coerce.number().positive("Enter a valid price"),
    packSize: z.coerce.number().int().positive("Enter a valid pack size"),
    weightValue: z.coerce.number().positive("Enter a valid weight"),
    weightUnit: z.string().min(1, "Weight unit is required (e.g., kg, lbs)"),
    location: z.string().min(1, "Location is required"),
    quantity: z.coerce.number().int().min(0, "Quantity is required"),
    lowStockAt: z.coerce.number().int().min(0).optional(),
});


export async function deleteProduct(
    _prevState: { success: boolean; message: string | null } | null,
    formData: FormData
) {
    const user = await getCurrentUser();
    const id = String(formData.get("id") || "");
    if (!id) return { success: false, message: "Product ID is required" };

    try {
        await prisma.$transaction([
            prisma.inventory.deleteMany({ where: { productId: id, createdBy: user.id } }),
            prisma.productList.delete({ where: { id, createdBy: user.id } }),
        ]);
        return { success: true, message: "Product has been deleted!" };
    } catch (error) {
        console.error("Failed to delete product:", error);
        return { success: false, message: "Failed to delete product." };
    }
}

//export async function CreateProduct(formData: FormData) {

export async function CreateProduct(
    _prevState: { success: boolean; message: string | null; errors?: Record<string, string[]> } | null,
    formData: FormData
) {
    const user = await getCurrentUser();
    const parsed = ProductSchema.safeParse({
        name: formData.get("name"),
        sku: formData.get("sku"),
        price: formData.get("price"),
        packSize: formData.get("packSize"),
        weightValue: formData.get("weightValue"),
        weightUnit: formData.get("weightUnit"),
        location: formData.get("location"),
        quantity: formData.get("quantity"),
        lowStockAt: formData.get("lowStockAt") || undefined,
    });

    if (!parsed.success) {
        return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors };
    }

    try {
        // Create product
        const product = await prisma.productList.create({
            data: {
                name: parsed.data.name,
                sku: parsed.data.sku,
                price: parsed.data.price,
                packSize: parsed.data.packSize,
                weightValue: parsed.data.weightValue,
                weightUnit: parsed.data.weightUnit,
                createdBy: user.id,
            },
        });
        // Add to inventory
        await prisma.inventory.create({
            data: {
                productId: product.id,
                productName: product.name,
                location: parsed.data.location,
                quantity: parsed.data.quantity,
                lowStockAt: parsed.data.lowStockAt || 5,
                createdBy: user.id,
            },
        });
        return { success: true, message: "Product added to inventory!" };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, message: "Failed to add product." };
    }
}
