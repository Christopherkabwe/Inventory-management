import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ProductType } from "@/lib/enums/enums";

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const allowedFields = ['sku', 'name', 'costPerBag', 'packSize', 'category', 'subCategory', 'type', 'isTaxable', 'taxRate', 'weightValue', 'weightUnit'];
        const dataToUpdate: Record<string, any> = {};

        for (const key of allowedFields) {
            if (body[key] !== undefined) {
                if (key === "taxRate") {
                    const taxRate = parseFloat(body[key]);
                    if (isNaN(taxRate)) return NextResponse.json({ message: "Invalid tax rate" }, { status: 400 });
                    dataToUpdate[key] = taxRate;
                } else if (key === 'type') {
                    dataToUpdate[key] = body[key] as ProductType;
                } else {
                    dataToUpdate[key] = body[key];
                }
            }
        }
        const existing = await prisma.productList.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        const updated = await prisma.productList.update({ where: { id }, data: dataToUpdate });
        return NextResponse.json(updated);
    } catch (error) {
        console.error("PUT /product-management/[id] error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;

        const existing = await prisma.productList.findUnique({ where: { id } });
        if (!existing) {
            return NextResponse.json({ message: "Product not found" }, { status: 404 });
        }

        await prisma.productList.delete({ where: { id } });
        return NextResponse.json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("DELETE /product-management/[id] error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
