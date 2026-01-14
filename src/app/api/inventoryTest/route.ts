// /pages/api/inventory.ts
import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
    const { products, categories, users, locations, search, page = "1", pageSize = "10" } = req.query;

    const skip = (Number(page) - 1) * Number(pageSize);
    const take = Number(pageSize);

    const inventories = await prisma.inventory.findMany({
        where: {
            product: {
                AND: [
                    products ? { name: { in: Array.isArray(products) ? products : [products] } } : {},
                    categories ? { category: { in: Array.isArray(categories) ? categories : [categories] } } : {},
                    search ? { name: { contains: search, mode: "insensitive" } } : {},
                ],
            },
            location: locations ? { name: { in: Array.isArray(locations) ? locations : [locations] } } : {},
            assignedUser: users ? { fullName: { in: Array.isArray(users) ? users : [users] } } : {},
        },
        include: {
            product: true,
            location: true,
            assignedUser: true,
            createdBy: true,
        },
        skip,
        take,
    });

    const totalCount = await prisma.inventory.count({
        where: {
            product: {
                AND: [
                    products ? { name: { in: Array.isArray(products) ? products : [products] } } : {},
                    categories ? { category: { in: Array.isArray(categories) ? categories : [categories] } } : {},
                    search ? { name: { contains: search, mode: "insensitive" } } : {},
                ],
            },
            location: locations ? { name: { in: Array.isArray(locations) ? locations : [locations] } } : {},
            assignedUser: users ? { fullName: { in: Array.isArray(users) ? users : [users] } } : {},
        },
    });

    res.status(200).json({ inventories, totalCount });
}
