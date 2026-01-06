"use server"

import { getCurrentUser } from "../auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";

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


export async function deleteFromInventory(
    _prevState: { success: boolean; message: string | null } | null,
    formData: FormData
) {
    const user = await getCurrentUser();
    if (!user) return { success: false, message: "Unauthorized" };

    const id = String(formData.get("id") || "");
    if (!id) return { success: false, message: "Inventory ID is required" };

    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id, createdById: user.id },
            include: { product: true },
        });

        if (!inventory) {
            return { success: false, message: "Inventory not found or unauthorized." };
        }

        await prisma.$transaction([
            prisma.inventory.delete({ where: { id, createdById: user.id } }),
            // Optional: Delete the product if you want to remove it entirely
            // prisma.productList.delete({
            //   where: { id: inventory.productId, createdById: user.id },
            // }),
        ]);

        revalidatePath("/inventory");
        return { success: true, message: `Inventory for "${inventory.product.name}" has been deleted!` };
    } catch (error) {
        console.error("Failed to delete inventory:", error);
        return { success: false, message: "Failed to delete inventory. Try again later." };
    }
}

export async function editInventory(prevState: any, formData: FormData) {
    const id = formData.get("id") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const lowStockAt = Number(formData.get("lowStockAt"));
    const locationId = formData.get("locationId") as string;

    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id },
            include: { product: true },
        });
        if (!inventory) {
            return { message: "Inventory not found.", success: false };
        }

        await prisma.$transaction([
            prisma.productList.update({
                where: { id: inventory.productId },
                data: { price },
            }),
            prisma.inventory.update({
                where: { id },
                data: { quantity, lowStockAt, locationId },
            }),
        ]);

        revalidatePath("/inventory");
        return { message: `Inventory updated for ${inventory.product.name}!`, success: true };
    } catch (e) {
        console.error(e);
        return { message: "Failed to update inventory.", success: false };
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
        location: formData.get("location"), // Update this line
        quantity: formData.get("quantity"),
        lowStockAt: formData.get("lowStockAt") || undefined,
    });

    if (!parsed.success) {
        return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors };
    }

    try {
        // Check if product with same SKU exists
        const existingProduct = await prisma.productList.findUnique({
            where: { sku: parsed.data.sku },
        });

        let product;
        if (existingProduct) {
            product = existingProduct;
        } else {
            // Create product if it doesn't exist
            product = await prisma.productList.create({
                data: {
                    name: parsed.data.name,
                    sku: parsed.data.sku,
                    price: parsed.data.price,
                    packSize: parsed.data.packSize,
                    weightValue: parsed.data.weightValue,
                    weightUnit: parsed.data.weightUnit,
                    createdById: user.id,
                },
            });
        }

        const location = await prisma.location.findUnique({
            where: { name: parsed.data.location },
        });

        if (!location) {
            return { success: false, message: "Location not found." };
        }

        // Add to inventory
        await prisma.inventory.create({
            data: {
                product: {
                    connect: {
                        id: product.id,
                    },
                },
                location: {
                    connect: {
                        id: location.id,
                    },
                },
                quantity: parsed.data.quantity,
                lowStockAt: parsed.data.lowStockAt || 5,
                createdById: user.id,
            },
        });

        return { success: true, message: "Product added to inventory!" };
    } catch (error) {
        console.error("Failed to create product:", error);
        return { success: false, message: "Failed to add product." };
    }
}

export async function getProducts() {
    const user = await getCurrentUser();
    if (!user) return [];

    const products = await prisma.inventory.findMany({
        where: {
            createdById: user.id,
        },
        include: {
            product: true,
            location: true,
        },
        orderBy: {
            createdAt: "desc",
        },
        take: 50, // limit list (important for performance)
    });

    return products;
}

