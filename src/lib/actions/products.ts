"use server"

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { redirect } from "next/navigation";

const ProductSchema = z.object({
    name: z.string().min(3, "Name is required"),
    price: z.coerce.number().nonnegative("Enter valid price"),
    quantity: z.coerce.number().int().min(0, "Quantity is required"),
    sku: z.string().optional(),
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
        await prisma.product.deleteMany({ where: { id, userId: user.id } });
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

    //Check that the correct data is collected from the form
    const parsed = ProductSchema.safeParse({
        name: formData.get("name"),
        price: formData.get("price"),
        quantity: formData.get("quantity"),
        sku: formData.get("sku") || undefined,
        lowStockAt: formData.get("lowStockAt") || undefined,
    });

    if (!parsed.success) {
        return {
            success: false,
            message: "Validation failed",
            errors: parsed.error.flatten().fieldErrors,
        };
    }

    try {
        await prisma.product.create({
            data: { ...parsed.data, userId: user.id },
        });
        return { success: true, message: "New product has been added!" };


    } catch (error) {
        console.error("Failed to create product:", error);
        //throw new Error("Failed to create product")
        return { success: false, message: "Failed to create product." };
    }

    //redirect('/inventory');
}