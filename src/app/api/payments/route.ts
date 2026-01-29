
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const payments = await prisma.customerPayment.findMany({
            orderBy: { paymentDate: "desc" },
            include: {
                customer: true,
                allocations: true,
            },
        });

        const creditNotes = await prisma.creditNote.findMany({
            include: {
                sale: {
                    select: { customerId: true },
                },
            },
        });

        const creditNoteTotals = creditNotes.reduce<Record<string, number>>(
            (acc, cn) => {
                const customerId = cn.sale.customerId;
                acc[customerId] = (acc[customerId] || 0) + cn.amount;
                return acc;
            },
            {}
        );

        const result = payments.map((p) => {
            const allocated =
                p.allocations?.reduce((sum, a) => sum + Number(a.amount), 0) ?? 0;

            return {
                id: p.id,
                customerId: p.customerId,
                customer: p.customer,
                amount: Number(p.amount),
                method: p.method,
                reference: p.reference,
                paymentDate: p.paymentDate,
                allocated,
                balance: Number(p.amount) - allocated,
                creditNotes: creditNoteTotals[p.customerId] ?? 0,
            };
        });

        return NextResponse.json(result);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to fetch payments" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    try {
        const user = await getCurrentUser();

        if (!user || !user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { customerId, amount, method, reference } = await req.json();

        if (!customerId || !amount || amount <= 0 || !method) {
            return NextResponse.json(
                { error: "Invalid input" },
                { status: 400 }
            );
        }

        // Optional: ensure customer exists
        const customerExists = await prisma.customer.findUnique({
            where: { id: customerId },
            select: { id: true },
        });

        if (!customerExists) {
            return NextResponse.json(
                { error: "Customer not found" },
                { status: 404 }
            );
        }

        // Create the payment record
        const payment = await prisma.customerPayment.create({
            data: {
                customerId,
                amount: Number(amount),
                method,
                reference: reference || null,
                createdById: user.id,
            },
        });

        return NextResponse.json({ payment });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Failed to create payment" },
            { status: 500 }
        );
    }
}
