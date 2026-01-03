import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page") || 1);
        const limitParam = searchParams.get("limit");
        const limit = limitParam ? Number(limitParam) : undefined;
        const skip = limit ? (page - 1) * limit : undefined;

        const aggregate = searchParams.get("aggregate");

        let where = {};
        const start = searchParams.get("start");
        const end = searchParams.get("end");

        if (start && end) {
            where = {
                createdAt: {
                    gte: new Date(start),
                    lte: new Date(end),
                },
            };
        }

        if (aggregate === "category") {
            const grouped = await prisma.saleItem.groupBy({
                by: ["productId"],
                _sum: { quantity: true },
                where: {
                    sale: where,
                },
            });

            const products = await prisma.product.findMany({
                where: { id: { in: grouped.map(g => g.productId) } },
                select: { id: true, category: true, weightValue: true, packSize: true },
            });

            const productMap = Object.fromEntries(products.map(p => [p.id, p]));
            const categoryMap: Record<string, number> = {};

            for (const row of grouped) {
                const product = productMap[row.productId];
                if (!product) continue;
                const category = product.category || "Uncategorized";
                const tonnage = (product.weightValue * (row._sum.quantity || 0) * product.packSize) / 1000;
                categoryMap[category] = (categoryMap[category] || 0) + tonnage;
            }

            const data = Object.entries(categoryMap).map(([category, tonnage]) => ({
                category,
                tonnage: Number(tonnage.toFixed(2)),
            }));

            return NextResponse.json({ success: true, data });
        }

        const [sales, total] = await Promise.all([
            prisma.sale.findMany({
                orderBy: { createdAt: "desc" },
                ...(limit ? { skip, take: limit } : {}),
                where,
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    location: true,
                    transporter: true,
                },
            }),
            prisma.sale.count({ where }),
        ]);

        if (limit) {
            return NextResponse.json({
                success: true,
                data: sales,
                pagination: {
                    page,
                    limit,
                    total,
                    totalPages: Math.ceil(total / limit),
                },
            });
        }

        return NextResponse.json({ success: true, data: sales, total });
    } catch (error) {
        console.error("Fetch sales failed:", error);
        return NextResponse.json({ error: "Failed to fetch sales" }, { status: 500 });
    }
}

// -------------------- CREATE SALE --------------------
export async function POST(req: Request) {
    try {
        const {
            customerId,
            locationId,
            transporterName,
            driverName,      // always manual per sale
            vehicleNumber,
            items,
            createdBy,
        } = await req.json();

        if (!customerId || !locationId || !items?.length || !driverName) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const sale = await prisma.$transaction(async (tx) => {
            // 1️⃣ Generate Invoice Number
            const invSeq = await tx.sequence.upsert({
                where: { id: "INV" },
                update: { value: { increment: 1 } },
                create: { id: "INV", value: 1 },
            });
            const invoiceNumber = `INV${invSeq.value.toString().padStart(6, "0")}`;

            // 2️⃣ Generate Delivery Note Number
            const dnSeq = await tx.sequence.upsert({
                where: { id: "DN" },
                update: { value: { increment: 1 } },
                create: { id: "DN", value: 1 },
            });
            const deliveryNote = `DN${dnSeq.value.toString().padStart(6, "0")}`;

            // 3️⃣ Find or create transporter (unique by name + vehicleNumber)
            let transporterId: string | null = null;
            if (transporterName && vehicleNumber) {
                const existingTransporter = await tx.transporter.findFirst({
                    where: { name: transporterName, vehicleNumber },
                });

                if (existingTransporter) {
                    transporterId = existingTransporter.id;
                } else {
                    const newTransporter = await tx.transporter.create({
                        data: { name: transporterName, vehicleNumber },
                    });
                    transporterId = newTransporter.id;
                }
            }

            // 4️⃣ Create Sale
            const newSale = await tx.sale.create({
                data: {
                    customerId,
                    locationId,
                    transporterId,
                    driverName,       // manual per sale
                    vehicleNumber,    // snapshot
                    invoiceNumber,
                    deliveryNote,
                    createdBy,
                },
            });

            // 5️⃣ Create SaleItems and update inventory
            for (const item of items) {
                const { productId, quantity, price } = item;

                if (!productId || quantity <= 0 || price < 0) {
                    throw new Error("Invalid sale item");
                }

                // Check inventory
                const inventory = await tx.inventory.findFirst({
                    where: { productId, locationId },
                });
                if (!inventory || inventory.quantity < quantity) {
                    throw new Error(`Insufficient stock for product ${productId}`);
                }

                // Decrement inventory
                await tx.inventory.update({
                    where: { id: inventory.id },
                    data: { quantity: { decrement: quantity } },
                });

                // Create SaleItem
                await tx.saleItem.create({
                    data: {
                        saleId: newSale.id,
                        productId,
                        quantity,
                        price,
                        total: price * quantity,
                    },
                });
            }

            // 6️⃣ Return full sale with relations
            return tx.sale.findUnique({
                where: { id: newSale.id },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    location: true,
                    transporter: true,
                },
            });
        });

        return NextResponse.json(sale, { status: 201 });
    } catch (error) {
        console.error("Create sale failed:", error);
        return NextResponse.json(
            {
                error: "Failed to create sale",
                details: error instanceof Error ? error.message : String(error),
            },
            { status: 500 }
        );
    }
}