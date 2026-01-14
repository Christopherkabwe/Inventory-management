import { prisma } from "@/lib/prisma";

export type Filters = {
    products: string[];
    categories: string[];
    users: string[];
    locations: string[];
    search?: string; // optional global search
};

export type Pagination = {
    page: number;
    pageSize: number;
};

export async function getFilteredData(
    model: "inventory" | "sale" | "salesOrder",
    filters: Filters,
    pagination: Pagination = { page: 1, pageSize: 20 }
) {
    const { products, categories, users, locations, search } = filters;
    const skip = (pagination.page - 1) * pagination.pageSize;
    const take = pagination.pageSize;

    switch (model) {
        case "inventory":
            return prisma.inventory.findMany({
                where: {
                    product: {
                        AND: [
                            products.length ? { name: { in: products } } : {},
                            categories.length ? { category: { in: categories } } : {},
                            search ? { name: { contains: search, mode: "insensitive" } } : {},
                        ],
                    },
                    location: locations.length ? { name: { in: locations } } : {},
                    assignedUser: users.length ? { fullName: { in: users } } : {},
                },
                include: {
                    product: true,
                    location: true,
                    assignedUser: true,
                },
                skip,
                take,
            });

        case "sale":
            return prisma.sale.findMany({
                where: {
                    items: {
                        some: {
                            product: {
                                AND: [
                                    products.length ? { name: { in: products } } : {},
                                    categories.length ? { category: { in: categories } } : {},
                                    search ? { name: { contains: search, mode: "insensitive" } } : {},
                                ],
                            },
                        },
                    },
                    location: locations.length ? { name: { in: locations } } : {},
                    createdBy: users.length ? { fullName: { in: users } } : {},
                },
                include: {
                    items: { include: { product: true } },
                    location: true,
                    createdBy: true,
                },
                skip,
                take,
            });

        case "salesOrder":
            return prisma.salesOrder.findMany({
                where: {
                    items: {
                        some: {
                            product: {
                                AND: [
                                    products.length ? { name: { in: products } } : {},
                                    categories.length ? { category: { in: categories } } : {},
                                    search ? { name: { contains: search, mode: "insensitive" } } : {},
                                ],
                            },
                        },
                    },
                    location: locations.length ? { name: { in: locations } } : {},
                    createdBy: users.length ? { fullName: { in: users } } : {},
                },
                include: {
                    items: { include: { product: true } },
                    location: true,
                    createdBy: true,
                },
                skip,
                take,
            });

        default:
            throw new Error(`Unsupported model: ${model}`);
    }
}
