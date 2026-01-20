import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { buildCustomerRBACWhere } from "@/lib/rbac/customerRbac";
import { buildCustomerSearchWhere } from "@/lib/rbac/searchCustomer";

// -------------------- GET /api/customers --------------------//
export async function GET(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);

        // Pagination
        const page = Number(searchParams.get("page") || 1);
        const limit = Number(searchParams.get("limit") || 50);
        const skip = (page - 1) * limit;

        // Search (✅ define first)
        const search = searchParams.get("search") || "";

        // RBAC + Search
        const rbacWhere = await buildCustomerRBACWhere(user);
        const searchWhere = buildCustomerSearchWhere(search);

        // Final WHERE
        const where = {
            AND: [rbacWhere, searchWhere],
        };

        const total = await prisma.customer.count({ where });

        const customers = await prisma.customer.findMany({
            where,
            include: {
                location: { select: { id: true, name: true } },
                createdBy: { select: { id: true, fullName: true } },
                user: { select: { id: true, fullName: true } },
                sales: { select: { id: true } },
                orders: { select: { id: true } },
                quotations: { select: { id: true } },
            },
            orderBy: { createdAt: "desc" },
            skip,
            take: limit,
        });

        const customersWithCounts = customers.map((c) => ({
            id: c.id,
            name: c.name,
            tpinNumber: c.tpinNumber,
            email: c.email,
            phone: c.phone,
            country: c.country,
            city: c.city,
            address: c.address,
            locationId: c.location?.id || "",
            locationName: c.location?.name || "",
            createdByName: c.createdBy?.fullName || "",
            assignedUserId: c.user?.id || "",
            assignedUserName: c.user?.fullName || "",
            createdAt: c.createdAt,
            updatedAt: c.updatedAt,
            salesCount: c.sales.length,
            ordersCount: c.orders.length,
            quotationsCount: c.quotations.length,
        }));

        return NextResponse.json({
            success: true,
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            customers: customersWithCounts,
        });
    } catch (error) {
        console.error("Fetch customers failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch customers", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- POST /api/customers --------------------//
export async function POST(request: Request) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER can create
        if (!["ADMIN", "MANAGER"].includes(user.role)) {
            return NextResponse.json(
                { error: "Unauthorized: Admin or Manager required" },
                { status: 403 }
            );
        }

        const {
            name,
            tpinNumber,
            email,
            phone,
            country,
            city,
            address,
            locationId,
            assignedUserId, // <-- new field
        } = await request.json();

        if (!name || !country || !city || !locationId) {
            return NextResponse.json(
                { error: "Missing required fields: name, country, city, or locationId." },
                { status: 400 }
            );
        }

        // Check unique email if provided
        if (email) {
            const existing = await prisma.customer.findUnique({ where: { email } });
            if (existing) return NextResponse.json({ error: "Email already exists." }, { status: 409 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                tpinNumber,
                email,
                phone,
                country,
                city,
                address,
                location: { connect: { id: locationId } },
                createdBy: { connect: { id: user.id } },        // fix here
                user: assignedUserId ? { connect: { id: assignedUserId } } : undefined,
            },
            include: {
                location: { select: { id: true, name: true } },
                createdBy: { select: { id: true, fullName: true } },
                user: { select: { id: true, fullName: true } },
            },
        });

        return NextResponse.json(
            {
                success: true,
                customer: {
                    id: customer.id,
                    name: customer.name,
                    tpinNumber: customer.tpinNumber,
                    email: customer.email,
                    phone: customer.phone,
                    country: customer.country,
                    city: customer.city,
                    address: customer.address,
                    locationId: customer.location?.id || "",
                    locationName: customer.location?.name || "",
                    createdByName: customer.createdBy?.fullName || "",
                    assignedUserId: customer.user?.id || "",
                    assignedUserName: customer.user?.fullName || "",
                    createdAt: customer.createdAt,
                    updatedAt: customer.updatedAt,
                },
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Create customer failed:", error);
        return NextResponse.json(
            { error: "Failed to create customer", details: (error as Error).message },
            { status: 500 }
        );
    }
}
