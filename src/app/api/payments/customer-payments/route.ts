import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { Prisma } from "@/generated/prisma";

export async function POST(req: Request) {
    const user = await getCurrentUser();

    if (!user || !user.id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { customerId, amount, method, reference, paymentDate } = body;

    if (!customerId || !amount || amount <= 0 || !method) {
        return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    // ✅ Ensure customer exists
    const customerExists = await prisma.customer.findUnique({
        where: { id: customerId },
        select: { id: true },
    });

    if (!customerExists) {
        return NextResponse.json({ error: "Customer not found" }, { status: 404 });
    }

    // ✅ Create payment
    const payment = await prisma.customerPayment.create({
        data: {
            amount: new Prisma.Decimal(amount), // safer decimal
            method,
            reference: reference || null,
            paymentDate: paymentDate ? new Date(paymentDate) : new Date(),

            customer: { connect: { id: customerId } },
            createdBy: { connect: { id: user.id } },
        },
    });

    // 🔹 Return unallocated balance = total amount initially
    return NextResponse.json({
        payment: {
            ...payment,
            unallocatedBalance: Number(payment.amount),
        },
    });
}
