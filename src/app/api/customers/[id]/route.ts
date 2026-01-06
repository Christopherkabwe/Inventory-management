import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

type Params = { params: { id: string } };

// -------------------- HELPER --------------------
function ensureAdminOrManager(user: { role: string }) {
    if (!["ADMIN", "MANAGER"].includes(user.role)) {
        throw new Error("Unauthorized: Admin or Manager required");
    }
}

// -------------------- PUT /api/customers/:id --------------------
export async function PUT(req: Request, { params }: Params) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER
        try { ensureAdminOrManager(user); }
        catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }

        const { name, email, phone, country, city } = await req.json();
        if (!name || !email || !phone || !country || !city) {
            return NextResponse.json(
                { error: "Missing required fields: name, email, phone, country, or city." },
                { status: 400 }
            );
        }

        // Check if email is being changed and already exists
        const existingCustomer = await prisma.customer.findUnique({ where: { email } });
        if (existingCustomer && existingCustomer.id !== params.id) {
            return NextResponse.json({ error: "Email already exists." }, { status: 409 });
        }

        const updatedCustomer = await prisma.customer.update({
            where: { id: params.id },
            data: { name, email, phone, country, city },
        });

        return NextResponse.json({ success: true, customer: updatedCustomer });
    } catch (error) {
        console.error("Update customer failed:", error);
        return NextResponse.json({ error: "Failed to update customer", details: (error as Error).message }, { status: 500 });
    }
}

// -------------------- DELETE /api/customers/:id --------------------
export async function DELETE(_req: Request, { params }: Params) {
    try {
        const user = await stackServerApp.getUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Only ADMIN or MANAGER
        try { ensureAdminOrManager(user); }
        catch (err: any) {
            return NextResponse.json({ error: err.message }, { status: 403 });
        }

        const customer = await prisma.customer.findUnique({ where: { id: params.id } });
        if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

        // Prevent deletion if customer has sales
        const salesCount = await prisma.sale.count({ where: { customerId: params.id } });
        if (salesCount > 0) {
            return NextResponse.json(
                { error: "Cannot delete customer with existing sales" },
                { status: 400 }
            );
        }

        await prisma.customer.delete({ where: { id: params.id } });

        return NextResponse.json({ success: true, message: "Customer deleted" });
    } catch (error) {
        console.error("Delete customer failed:", error);
        return NextResponse.json({ error: "Failed to delete customer", details: (error as Error).message }, { status: 500 });
    }
}
