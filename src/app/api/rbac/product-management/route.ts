import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const products = await prisma.productList.findMany({
            select: {
                id: true,
                name: true,
                sku: true,
                category: true,
                packSize: true,
                weightValue: true,
                weightUnit: true,
                costPerBag: true,
                createdAt: true,
                updatedAt: true,
                price: true,
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                    },
                },
                createdById: true,
            },
            orderBy: {
                sku: "asc",
            },
        });
        return NextResponse.json(products);
    } catch (error) {
        console.error("GET /product-management error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { sku, name, costPerBag, packSize, category, weightValue, weightUnit } = body;

        // Basic validation
        if (!sku || !name || !packSize || !weightValue || !weightUnit) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const product = await prisma.productList.create({
            data: {
                sku,
                name,
                costPerBag: costPerBag || undefined,
                packSize,
                category: category || undefined,
                weightValue,
                weightUnit,
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("POST /product-management error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
