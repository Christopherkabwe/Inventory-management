
// lib/actions/users.ts
import { prisma } from "@/lib/prisma";

export async function getUsers() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                fullName: true,
                email: true,
            },
        });
        return users;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getLocations() {
    try {
        const locations = await prisma.location.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        return locations;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getCategories() {
    try {
        const categories = await prisma.productList.findMany({
            select: {
                category: true,
            },
            distinct: ['category'],
        });
        return categories.map((c) => c.category).filter((c) => c !== null);
    } catch (error) {
        console.error(error);
        return [];
    }
}

// ==================== PRODUCTS ====================
export async function getProducts() {
    try {
        return await prisma.productList.findMany({
            select: { id: true, name: true, sku: true },
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

// ==================== PRODUCTIONS ====================
export async function getProductions() {
    try {
        return await prisma.production.findMany({
            include: {
                items: { include: { product: true } },
                location: true,
                createdBy: true,
            },
            orderBy: { createdAt: "desc" },
        });
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function getProductionById(id: string) {
    try {
        return await prisma.production.findUnique({
            where: { id },
            include: { items: { include: { product: true } }, location: true, createdBy: true },
        });
    } catch (error) {
        console.error(error);
        return null;
    }
}

