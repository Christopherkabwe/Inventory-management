import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// -------------------- GET /api/transfers --------------------
export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const skip = limit ? (page - 1) * limit : undefined;

        const [transfers, total] = await Promise.all([
            prisma.transfer.findMany({
                orderBy: { createdAt: "desc" },
                ...(limit ? { skip, take: limit } : {}),
                include: {
                    items: { include: { product: true } },
                    fromLocation: true,
                    toLocation: true,
                    transporter: true,
                },
            }),
            prisma.transfer.count(),
        ]);

        if (limit) {
            return NextResponse.json({
                success: true,
                data: transfers,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }

        return NextResponse.json({ success: true, data: transfers, total });
    } catch (error) {
        console.error("Fetch transfers failed:", error);
        return NextResponse.json({ error: "Failed to fetch transfers" }, { status: 500 });
    }
}

// -------------------- POST /api/transfers --------------------
export async function POST(req: Request) {
    try {
        const { fromLocationId, toLocationId, transporterId, items, createdBy } = await req.json();

        if (!fromLocationId || !toLocationId || !items?.length) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const result = await prisma.$transaction(async (tx) => {
            // Generate IBT number
            const seq = await tx.sequence.upsert({
                where: { id: "IBT" },
                update: { value: { increment: 1 } },
                create: { id: "IBT", value: 1 },
            });
            const ibtNumber = `IBT${seq.value.toString().padStart(8, "0")}`;

            // Create transfer
            const transfer = await tx.transfer.create({
                data: {
                    ibtNumber,
                    fromLocationId,
                    toLocationId,
                    transporterId,
                    createdBy,
                },
            });

            for (const item of items) {
                const { productId, quantity } = item;
                if (!productId || quantity <= 0) throw new Error("Invalid item");

                // Check inventory in source location
                const inventory = await tx.inventory.findFirst({ where: { productId, locationId: fromLocationId } });
                if (!inventory || inventory.quantity < quantity) {
                    throw new Error(`Insufficient stock for product ${productId} at source location`);
                }

                // Create TransferItem
                await tx.transferItem.create({
                    data: {
                        transferId: transfer.id,
                        productId,
                        quantity,
                    },
                });

                // Decrement source inventory
                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { decrement: quantity } },
                });

                // Increment destination inventory
                await tx.inventory.upsert({
                    where: { productId_locationId: { productId, locationId: toLocationId } },
                    update: { quantity: { increment: quantity } },
                    create: { productId, locationId: toLocationId, quantity, lowStockAt: 0, createdBy },
                });
            }

            return transfer;
        });

        return NextResponse.json(result, { status: 201 });
    } catch (error) {
        console.error("Create transfer failed:", error);
        return NextResponse.json({ error: "Failed to create transfer" }, { status: 500 });
    }
}
