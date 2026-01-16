// app/api/inventory/update/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stackServerApp } from "@/stack/server";

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        // 1️⃣ Authenticate user
        const user = await stackServerApp.getUser();
        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }
        const userId = user.id;

        // 2️⃣ Get product ID and request body
        const productId = params.id;
        const { locationId, quantity } = await req.json();

        if (!productId || !locationId || !quantity || quantity <= 0) {
            return NextResponse.json(
                { error: "productId, locationId and positive quantity are required" },
                { status: 400 }
            );
        }

        // 3️⃣ Find the inventory item
        const inventory = await prisma.inventory.findFirst({
            where: { productId, locationId },
        });

        if (!inventory) {
            return NextResponse.json(
                { error: `Inventory not found for product ${productId} at location ${locationId}` },
                { status: 404 }
            );
        }

        if (inventory.quantity < quantity) {
            return NextResponse.json(
                {
                    error: `Not enough stock in location. Available: ${inventory.quantity}`,
                },
                { status: 400 }
            );
        }

        // 4️⃣ Update inventory
        const updated = await prisma.inventory.update({
            where: { id: inventory.id },
            data: {
                quantity: { decrement: quantity },
                updatedAt: new Date(),
                updatedById: userId, // matches schema
            },
        });

        return NextResponse.json({ success: true, updatedInventory: updated });
    } catch (error) {
        console.error("Inventory update failed:", error);
        return NextResponse.json({ error: "Failed to update inventory" }, { status: 500 });
    }
}
