import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

type Params = {
    params: Promise<{ id: string }>;
};


// -------------------- HELPER --------------------
function ensureAdminOrManager(user: { role: string }) {
    if (!["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized: Admin or Manager required");
    }
}

// -------------------- PUT /api/customers/:id --------------------
export async function PUT(req: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        try { ensureAdminOrManager(user); }
        catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }

        const { id } = await params; // unwrap id here
        const {
            name,
            tpinNumber,
            email,
            phone,
            country,
            city,
            address,
            locationId,
            assignedUserId,
        } = await req.json();

        if (!name || !country || !city || !locationId) {
            return NextResponse.json(
                { error: "Missing required fields: name, country, city, or locationId." },
                { status: 400 }
            );
        }

        // Check unique email
        if (email) {
            const existingCustomer = await prisma.customer.findUnique({ where: { email } });
            // compare with unwrapped id
            if (existingCustomer && existingCustomer.id !== id) {
                return NextResponse.json({ error: "Email already exists." }, { status: 409 });
            }
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id },
            data: {
                name,
                tpinNumber,
                email,
                phone,
                country,
                city,
                address,
                location: { connect: { id: locationId } },
                assignedUser: assignedUserId || null,
            },
            include: {
                location: { select: { id: true, name: true } },
                createdBy: { select: { fullName: true } },
                user: { select: { id: true, fullName: true } },
                sales: { select: { id: true } },
                orders: { select: { id: true } },
                quotations: { select: { id: true } },
            },
        });

        return NextResponse.json({
            success: true,
            customer: {
                id: updatedCustomer.id,
                name: updatedCustomer.name,
                tpinNumber: updatedCustomer.tpinNumber,
                email: updatedCustomer.email,
                phone: updatedCustomer.phone,
                country: updatedCustomer.country,
                city: updatedCustomer.city,
                address: updatedCustomer.address,
                locationId: updatedCustomer.location?.id || "",
                locationName: updatedCustomer.location?.name || "",
                createdByName: updatedCustomer.createdBy?.fullName || "",
                assignedUserId: updatedCustomer.user?.id || "",
                assignedUserName: updatedCustomer.user?.fullName || "",
                createdAt: updatedCustomer.createdAt,
                updatedAt: updatedCustomer.updatedAt,
                salesCount: updatedCustomer.sales.length,
                ordersCount: updatedCustomer.orders.length,
                quotationsCount: updatedCustomer.quotations.length,
            },
        });
    } catch (error) {
        console.error("Update customer failed:", error);
        return NextResponse.json(
            { error: "Failed to update customer", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- DELETE /api/customers/:id --------------------
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        try { ensureAdminOrManager(user); }
        catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }

        const { id } = await params;

        const customer = await prisma.customer.findUnique({
            where: { id },
            include: {
                sales: { select: { id: true } },
                orders: { select: { id: true } },
                quotations: { select: { id: true } },
            },
        });
        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

        if (customer.sales.length > 0 || customer.orders.length > 0 || customer.quotations.length > 0) {
            return NextResponse.json({
                error: "Cannot delete customer with existing sales, orders, or quotations",
            }, { status: 400 });
        }

        await prisma.customer.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Customer deleted" });
    } catch (error) {
        console.error("Delete customer failed:", error);
        return NextResponse.json(
            { error: "Failed to delete customer", details: (error as Error).message },
            { status: 500 }
        );
    }
}
