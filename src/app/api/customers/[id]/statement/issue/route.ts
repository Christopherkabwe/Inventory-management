import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id: customerId } = await params;
    const { year, month, issuedById } = await req.json();

    if (!year || !month || !issuedById) {
        return NextResponse.json(
            { error: "year, month, issuedById required" },
            { status: 400 }
        );
    }

    // 🔒 Prevent re-issuing closed periods
    const period = await prisma.accountingPeriod.findUnique({
        where: { year_month: { year, month } },
    });

    if (period?.isClosed) {
        return NextResponse.json(
            { error: "Accounting period already closed" },
            { status: 409 }
        );
    }

    // 🔢 Calculate statement (reuse your existing logic)
    const {
        openingBalance,
        closingBalance,
        lines,
    } = await calculateCustomerStatement(customerId, year, month);

    const statement = await prisma.$transaction(async (tx) => {
        // 1️⃣ Remove draft statement
        await tx.customerStatement.deleteMany({
            where: {
                customerId,
                periodYear: year,
                periodMonth: month,
                locked: false,
            },
        });

        // 2️⃣ Create locked statement
        const statement = await tx.customerStatement.create({
            data: {
                customerId,
                periodYear: year,
                periodMonth: month,
                openingBalance,
                closingBalance,
                issuedById,
                locked: true,
                lines: {
                    create: lines,
                },
            },
        });

        // 3️⃣ Close accounting period
        await tx.accountingPeriod.upsert({
            where: { year_month: { year, month } },
            update: {
                isClosed: true,
                closedAt: new Date(),
                closedBy: issuedById,
            },
            create: {
                year,
                month,
                isClosed: true,
                closedAt: new Date(),
                closedBy: issuedById,
            },
        });

        return statement;
    });

    return NextResponse.json(statement);
}
