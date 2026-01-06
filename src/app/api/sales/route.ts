// app/api/sales/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { UserRole, requireRole } from "@/lib/rbac";
import { createSaleSchema } from "@/lib/validators/sale";
import { nextSequence } from "@/lib/sequence";

// -------------------- GET ALL SALES --------------------
export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Optional filters
        const { searchParams } = new URL(req.url);
        const locationId = searchParams.get("locationId");
        const customerId = searchParams.get("customerId");
        const status = searchParams.get("status");

        const where: any = {};
        if (locationId) where.locationId = locationId;
        if (customerId) where.customerId = customerId;
        if (status) where.status = status;

        // USER role restriction: only sales created by them
        if (user.role === UserRole.USER) where.createdById = user.id;

        const sales = await prisma.sale.findMany({
            where,
            include: {
                items: { include: { product: true } },
                customer: true,
                location: true,
                transporter: true,
                deliveryNotes: true, // includes full objects
            },
            orderBy: { createdAt: "desc" },
        });

        // Map deliveryNoteNo to top-level for frontend
        const mappedSales = sales.map((s) => ({
            ...s,
            deliveryNoteNo: s.deliveryNotes[0]?.deliveryNoteNo ?? null, // pick first DN
        }));
        return NextResponse.json({ success: true, sales: mappedSales });

    } catch (error) {
        console.error("Fetch sales failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch sales", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// -------------------- CREATE SALE --------------------
export async function POST(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);



        const rawBody = await req.json();

        const body = createSaleSchema.parse(rawBody);

        const {
            salesOrderId,
            customerId,
            locationId,       // ✅ REQUIRED & validated
            driverName,
            vehicleNumber,
            items,
            transporterName,
        } = body;

        if (!items?.length) return NextResponse.json({ error: "No items provided" }, { status: 400 });

        const newSale = await prisma.$transaction(async (tx) => {
            // Handle transporter
            let transporterId: string | undefined;
            let resolvedDriverName: string | null = null;

            if (transporterName && vehicleNumber) {
                const existing = await tx.transporter.findFirst({
                    where: { name: transporterName, vehicleNumber }
                });

                if (existing) {
                    transporterId = existing.id;
                    resolvedDriverName = driverName ?? existing.driverName ?? null;
                } else {
                    const created = await tx.transporter.create({
                        data: { name: transporterName, vehicleNumber, driverName }
                    });
                    transporterId = created.id;
                    resolvedDriverName = driverName ?? created.driverName ?? null;
                }
            } else {
                // No transporter specified, just use driverName from request or null
                resolvedDriverName = driverName ?? null;
            }
            // Handle invoice Number
            const invoiceNumber = await nextSequence(tx, "INV");

            // Create Sale

            const sale = await tx.sale.create({
                data: {
                    invoiceNumber,
                    salesOrderId,
                    customerId,
                    locationId,
                    transporterId,
                    driverName: resolvedDriverName,
                    vehicleNumber,
                    createdById: user.id,
                },
            });

            // Deduct inventory & create sale items
            for (const item of items) {
                const { productId, quantity, price } = item;
                if (!productId || quantity <= 0 || price < 0) throw new Error("Invalid sale item");

                const inventory = await tx.inventory.findFirst({ where: { productId, locationId } });
                if (!inventory || inventory.quantity < quantity) throw new Error(`Insufficient stock for product ${productId}`);

                await tx.inventory.update({ where: { id: inventory.id }, data: { quantity: { decrement: quantity } } });

                await tx.saleItem.create({
                    data: {
                        saleId: sale.id,
                        productId,
                        quantity,
                        price,
                        total: price * quantity,
                    },
                });
            }

            return tx.sale.findUnique({
                where: { id: sale.id },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    location: true,
                    transporter: true,
                    deliveryNotes: true,
                },
            });
        });

        return NextResponse.json({ success: true, sale: newSale });
    } catch (error) {
        console.error("Create sale failed:", error);
        return NextResponse.json(
            { error: "Failed to create sale", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

// -------------------- GET / PUT / DELETE SINGLE SALE --------------------
export async function GETSingle(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        const user = await getCurrentUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const { id } = params;

        const sale = await prisma.sale.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                customer: true,
                location: true,
                transporter: true,
                deliveryNotes: true,
            },
        });

        if (!sale) return NextResponse.json({ error: "Sale not found" }, { status: 404 });

        // USER role: only own sales
        if (user.role === UserRole.USER && sale.createdById !== user.id) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        return NextResponse.json({ success: true, sale });
    } catch (error) {
        console.error("Fetch sale failed:", error);
        return NextResponse.json(
            { error: "Failed to fetch sale", details: error instanceof Error ? error.message : String(error) },
            { status: 500 }
        );
    }
}

