import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

// -------------------- GET /api/customers --------------------//
export async function GET(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { searchParams } = new URL(request.url);

        // Pagination
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 20);
        const skip = (page - 1) * limit;

        // Search
        const search = searchParams.get("search") || "";

        // -------------------- ROLE-BASED ACCESS --------------------
        const where: any = {};

        if (user.role === "USER") {
            // USER can only see their own created customers
            where.createdById = user.id;
        }

        // Apply search filter
        if (search) {
            where.OR = [
                { name: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { phone: { contains: search, mode: "insensitive" } },
            ];
        }

        // Fetch total count for pagination
        const total = await prisma.customer.count({ where });

        // Fetch paginated customers
        const customers = await prisma.customer.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                country: true,
                city: true,
                createdAt: true,
                updatedAt: true,
                sales: { select: { id: true } }, // just fetch sales IDs for count
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        // Add sales count
        const customersWithCount = customers.map(c => ({
            ...c,
            salesCount: c.sales.length,
            sales: undefined, // remove full array to reduce payload
        }));

        return NextResponse.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            customers: customersWithCount,
        });
    } catch (error) {
        console.error("Fetch customers failed:", error);
        return NextResponse.json({ error: "Failed to fetch customers", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- POST /api/customers --------------------
export async function POST(request: Request) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can create customers
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json({ error: "Unauthorized: Admin or Manager required" }, { status: 403 });
        }

        const { name, email, phone, country, city } = await request.json();

        if (!name || !email || !phone || !country || !city) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, phone, country, or city." },
                { status: 400 }
            );
        }

        // Check for unique email
        const existingCustomer = await prisma.customer.findUnique({ where: { email } });
        if (existingCustomer) {
            return NextResponse.json({ error: "Email already exists." }, { status: 409 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                country,
                city,
                createdById: user.id, // track who created the customer
            },
        });

        return NextResponse.json({ success: true, customer }, { status: 201 });
    } catch (error) {
        console.error("Create customer failed:", error);
        return NextResponse.json({ error: "Failed to create customer", details: (error as Error).message }, { status: 500 });
    }
}
