import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const saleId = url.searchParams.get("saleId");

        if (!saleId) {
            return NextResponse.json(
                { error: "Sale ID is required" },
                { status: 400 }
            );
        }

        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const deliveryNote = await prisma.deliveryNote.findFirst({
            where: { saleId },
            include: {
                sale: { include: { customer: true } },
                items: { include: { product: true } },
                location: true,
                transporter: true,
                createdBy: { select: { fullName: true } },
            },
        });

        if (!deliveryNote) {
            return NextResponse.json(
                { error: "Delivery note not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(deliveryNote);
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
