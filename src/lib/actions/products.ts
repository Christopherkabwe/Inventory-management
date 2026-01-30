"use server";

import { getCurrentUser } from "@/lib/auth";
import { prisma } from "../prisma";
import { z } from "zod";
import { revalidatePath } from "next/cache";
import { UserRole, CurrentUser } from "../rbac";

// ==================== SCHEMA ====================
const ProductSchema = z.object({
    name: z.string().min(3, "Name is required"),
    sku: z.string().min(1, "SKU is required"),
    price: z.coerce.number().positive("Enter a valid price"),
    packSize: z.coerce.number().int().positive("Enter a valid pack size"),
    weightValue: z.coerce.number().positive("Enter a valid weight"),
    weightUnit: z.string().min(1, "Weight unit is required (e.g., kg, lbs)"),
    category: z.string().optional(),
    subCategory: z.string().optional(),
    costPerBag: z.coerce.number().int().min(0).optional(),
    location: z.string().min(1, "Location is required").optional(),
    quantity: z.coerce.number().int().min(0, "Quantity is required").optional(),
    lowStockAt: z.coerce.number().int().min(0).optional(),
    expiryDate: z.coerce.date().optional(),
    assignedUserId: z.string().optional(),
    isTaxable: z.string().optional(),
    taxRate: z.coerce.number().int().min(0).optional(),
});

// ADMIN PERMISSION //

function checkAdminPermission(user: CurrentUser) {
    if (!user || user.role !== UserRole.ADMIN) {
        throw new Error("Unauthorized: only admins are allowed to perform this action");
    }
}


// ==================== DELETE INVENTORY ====================
export async function deleteFromInventory(
    _prevState: { success: boolean; message: string | null } | null,
    formData: FormData
) {
    const user = await getCurrentUser();
    checkAdminPermission(user);

    const id = String(formData.get("id") || "");
    if (!id) return { success: false, message: "Inventory ID is required" };

    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id },
            include: { product: true },
        });

        if (!inventory || inventory.createdById !== user.id) {
            return { success: false, message: "Inventory not found or unauthorized." };
        }

        await prisma.inventory.delete({ where: { id } });

        revalidatePath("/inventory/inventory");
        return { success: true, message: `Inventory for "${inventory.product.name}" has been deleted!` };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to delete inventory. Try again later." };
    }
}
// ==================== EDIT INVENTORY ====================
export async function editInventory(
    _prevState: any,
    formData: FormData
) {
    const user = await getCurrentUser();
    checkAdminPermission(user);

    const id = formData.get("id") as string;
    const price = Number(formData.get("price"));
    const quantity = Number(formData.get("quantity"));
    const lowStockAt = Number(formData.get("lowStockAt")) || 0;
    const locationId = formData.get("locationId") as string;
    const expiryDateRaw = formData.get("expiryDate");
    const expiryDate = expiryDateRaw ? new Date(expiryDateRaw as string) : null;
    const assignedUserIdRaw = formData.get("assignedUserId");
    const assignedUserId = assignedUserIdRaw ? String(assignedUserIdRaw) : null;

    if (!id) return { success: false, message: "Inventory ID is required" };

    try {
        const inventory = await prisma.inventory.findUnique({
            where: { id },
            include: { product: true },
        });

        if (!inventory) return { success: false, message: "Inventory not found." };

        await prisma.$transaction([
            prisma.productList.update({
                where: { id: inventory.productId },
                data: { price },
            }),
            prisma.inventory.update({
                where: { id },
                data: {
                    quantity,
                    lowStockAt,
                    locationId,
                    expiryDate,
                    assignedUserId,
                },
            }),
        ]);

        // Revalidate page so client fetches fresh inventory
        revalidatePath("/inventory/inventory");

        return {
            success: true,
            message: `Inventory updated for ${inventory.product.name}!`,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to update inventory." };
    }
}

// ==================== CREATE PRODUCT + ADD TO INVENTORY ====================
export async function CreateProduct(
    _prevState: { success: boolean; message: string | null; errors?: Record<string, string[]> } | null,
    formData: FormData
) {
    const user = await getCurrentUser();
    checkAdminPermission(user);

    const parsed = ProductSchema.safeParse({
        name: formData.get("name"),
        sku: formData.get("sku"),
        price: formData.get("price"),
        packSize: formData.get("packSize"),
        weightValue: formData.get("weightValue"),
        weightUnit: formData.get("weightUnit"),
        category: formData.get("category") || undefined,
        subCategory: formData.get("subCategory") || undefined,
        location: formData.get("location") || undefined,
        quantity: formData.get("quantity"),
        lowStockAt: formData.get("lowStockAt") || undefined,
        isTaxable: formData.get("isTaxable") || undefined,
        taxRate: formData.get("taxRate") || 0,
        costPerBag: formData.get("costPerBag") || 0,
    });
    console.log(parsed);

    if (!parsed.success) {
        console.error(parsed.error);
        return { success: false, message: "Validation failed", errors: parsed.error.flatten().fieldErrors };
    }

    try {
        // Check if product with same SKU exists
        let product = await prisma.productList.findUnique({ where: { sku: parsed.data.sku } });
        if (!product) {
            product = await prisma.productList.create({
                data: {
                    name: parsed.data.name,
                    sku: parsed.data.sku,
                    price: parsed.data.price,
                    packSize: parsed.data.packSize,
                    weightValue: parsed.data.weightValue,
                    weightUnit: parsed.data.weightUnit,
                    category: parsed.data.category,
                    subCategory: parsed.data.subCategory,
                    createdById: user.id,
                    isTaxable: parsed.data.isTaxable,
                    taxRate: parsed.data.taxRate,
                    costPerBag: parsed.data.costPerBag,
                },
            });
        }

        revalidatePath("/products/product-management");
        return { success: true, message: "Product created Successfully!" };
    } catch (error) {
        console.error(error);
        return { success: false, message: "Failed to add product." };
    }
}

// ==================== GET INVENTORY ====================
export async function getProducts() {
    try {
        const products = await prisma.productList.findMany({
            orderBy: { createdAt: "desc" },
        });
        return products;
    } catch (error) {
        return { error: "Failed to fetch products" };
    }
}