import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const search = searchParams.get('search');

    try {
        const where = {
            createdBy: userId || undefined,
            ...(search && {
                OR: [
                    { name: { contains: search, mode: "insensitive" } },
                    { email: { contains: search, mode: "insensitive" } },
                ],
            }),
        };

        const customers = await prisma.customer.findMany({
            where,
            include: {
                sales: true,
            },
            orderBy: { createdAt: 'desc' },
        });

        return NextResponse.json({ customers });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { name, email, phone, country, city, userId } = await request.json();

        // Basic validation
        if (!name || !email || !phone || !country || !city || !userId) {
            return NextResponse.json(
                { error: 'Missing required fields: name, email, phone, country, city, or userId.' },
                { status: 400 }
            );
        }

        // Check for unique email
        const existingCustomer = await prisma.customer.findUnique({ where: { email } });
        if (existingCustomer) {
            return NextResponse.json({ error: 'Email already exists.' }, { status: 409 });
        }

        const customer = await prisma.customer.create({
            data: {
                name,
                email,
                phone,
                country,
                city,
                createdBy: userId,
            },
        });

        return NextResponse.json(customer, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
    }
}
