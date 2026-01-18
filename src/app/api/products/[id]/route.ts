import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET single product
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    const product = await prisma.productList.findUnique({
        where: { id: params.id },
    });

    return product
        ? NextResponse.json(product)
        : NextResponse.json({ message: "Product not found" }, { status: 404 });
}

// PUT / update product
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    const { id } = params; // This is your product ID
    const body = await req.json(); // Only the updated fields go in the body

    const updatedProduct = await prisma.productList.update({
        where: { id },
        data: body,
    });

    return NextResponse.json(updatedProduct);
}

// DELETE product
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    if (!params.id) {
        return new Response("Missing product id", { status: 400 });
    }

    await prisma.productList.delete({ where: { id: params.id } });
    return new Response(null, { status: 204 });
}
