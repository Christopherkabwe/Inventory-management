import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return;
        const products = await prisma.productList.findMany({
            select: {
                id: true,
                name: true,
                sku: true,
                category: true,
                subCategory: true,
                packSize: true,
                weightValue: true,
                weightUnit: true,
                costPerBag: true,
                createdAt: true,
                updatedAt: true,
                price: true,
                isTaxable: true,
                taxRate: true,
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
        const user = await getCurrentUser();
        if (!user) return;
        const body = await req.json();
        const { sku, name, costPerBag, packSize, price, category, subCategory, isTaxable, taxRate, weightValue, weightUnit } = body;

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
                subCategory: subCategory || undefined,
                weightValue,
                weightUnit,
                isTaxable: isTaxable || undefined,
                taxRate: taxRate || undefined,
                price: price || undefined,
                createdById: user.id
            },
        });

        return NextResponse.json(product, { status: 201 });
    } catch (error) {
        console.error("POST /product-management error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
