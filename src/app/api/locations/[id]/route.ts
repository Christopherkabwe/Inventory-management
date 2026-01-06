import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = { params: { id: string } };

// -------------------- PUT /api/locations/:id --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        const { name, address } = await req.json();

        if (!name) {
            return NextResponse.json(
                { error: "Name is required" },
                { status: 400 }
            );
        }

        const updatedLocation = await prisma.location.update({
            where: { id },
            data: { name, address },
        });

        return NextResponse.json({ success: true, location: updatedLocation });
    } catch (e) {
        console.error("Update location failed:", e);
        return NextResponse.json(
            { error: "Failed to update location", details: (e as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- DELETE /api/locations/:id --------------------
export async function DELETE(_req: NextRequest, { params }: Params) {
    const { id } = params;
    try {
        // Check for related inventory, sales, or transfers
        const inventoryCount = await prisma.inventory.count({ where: { locationId: id } });
        const salesCount = await prisma.sale.count({ where: { locationId: id } });
        const transfersCount = await prisma.transfer.count({
            where: { OR: [{ fromLocationId: id }, { toLocationId: id }] }
        });

        if (inventoryCount > 0 || salesCount > 0 || transfersCount > 0) {
            return NextResponse.json(
                {
                    error: "Cannot delete location with related inventory, sales, or transfers."
                },
                { status: 400 }
            );
        }

        await prisma.location.delete({ where: { id } });

        return NextResponse.json({ success: true, message: "Location deleted" });
    } catch (e) {
        console.error("Delete location failed:", e);
        return NextResponse.json(
            { error: "Failed to delete location", details: (e as Error).message },
            { status: 500 }
        );
    }
}
