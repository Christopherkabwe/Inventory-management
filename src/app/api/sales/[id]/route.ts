// app/api/sales/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { requireRole, UserRole } from "@/lib/rbac";
import { recordInventoryTransaction } from "@/lib/inventory";

type Params = { params: { id: string } };

// -------------------- UPDATE SALE --------------------
export async function PUT(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        const { items, transporterName, driverName, vehicleNumber } = await req.json();

        if (!items?.length && !transporterName && !driverName && !vehicleNumber) {
            return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
        }

        const updatedSale = await prisma.$transaction(async (tx) => {
            // 1️⃣ Fetch sale and current items
            const sale = await tx.sale.findUnique({
                where: { id },
                include: { items: true },
            });
            if (!sale) throw new Error("Sale not found");

            // 2️⃣ Prevent editing locked/confirmed/cancelled sales
            if (sale.isLocked || sale.status === "CANCELLED") {
                throw new Error("Cannot update a confirmed, partially invoiced, or cancelled sale");
            }

            // 3️⃣ Handle transporter update
            let transporterId = sale.transporterId;
            if (transporterName && vehicleNumber) {
                const existing = await tx.transporter.findFirst({
                    where: { name: transporterName, vehicleNumber },
                });
                transporterId =
                    existing?.id ||
                    (await tx.transporter.create({ data: { name: transporterName, vehicleNumber } })).id;
            }

            // 4️⃣ Update sale info
            await tx.sale.update({
                where: { id },
                data: {
                    transporterId,
                    driverName: driverName ?? sale.driverName,
                    vehicleNumber: vehicleNumber ?? sale.vehicleNumber,
                },
            });

            // 5️⃣ Update items if provided
            if (items?.length) {
                // Restore inventory for old items
                for (const oldItem of sale.items) {
                    const inventory = await tx.inventory.findFirst({
                        where: { productId: oldItem.productId, locationId: sale.locationId },
                    });
                    if (inventory) {
                        await tx.inventory.update({
                            where: { id: inventory.id },
                            data: { quantity: { increment: oldItem.quantity } },
                        });

                        await recordInventoryTransaction({
                            productId: oldItem.productId,
                            locationId: sale.locationId,
                            delta: oldItem.quantity,
                            source: "SALE",
                            reference: sale.id,
                            createdById: user.id,
                        });
                    }
                }

                // Delete old sale items
                await tx.saleItem.deleteMany({ where: { saleId: id } });

                // Add new items & decrement inventory
                for (const item of items) {
                    const { productId, quantity, price } = item;
                    if (!productId || quantity <= 0 || price < 0) throw new Error("Invalid sale item");

                    const inventory = await tx.inventory.findFirst({
                        where: { productId, locationId: sale.locationId },
                    });
                    if (!inventory || inventory.quantity < quantity)
                        throw new Error(`Insufficient stock for product ${productId}`);

                    await tx.inventory.update({
                        where: { id: inventory.id },
                        data: { quantity: { decrement: quantity } },
                    });

                    await recordInventoryTransaction({
                        productId,
                        locationId: sale.locationId,
                        delta: -quantity,
                        source: "SALE",
                        reference: sale.id,
                        createdById: user.id,
                    });

                    await tx.saleItem.create({
                        data: {
                            saleId: id,
                            productId,
                            quantity,
                            quantityInvoiced: 0,
                            quantityDelivered: 0,
                            quantityReturned: 0,
                            price,
                            total: price * quantity,
                        },
                    });
                }
            }

            // 6️⃣ Return updated sale with relations
            return tx.sale.findUnique({
                where: { id },
                include: {
                    items: { include: { product: true } },
                    customer: true,
                    location: true,
                    transporter: true,
                },
            });
        });

        return NextResponse.json({ success: true, sale: updatedSale });
    } catch (error) {
        console.error("Update sale failed:", error);
        return NextResponse.json(
            { error: "Failed to update sale", details: (error as Error).message },
            { status: 500 }
        );
    }
}

// -------------------- DELETE SALE --------------------
export async function DELETE(req: NextRequest, { params }: Params) {
    const { id } = params;

    try {
        const user = await getCurrentUser();
        requireRole(user, [UserRole.ADMIN, UserRole.MANAGER]);

        await prisma.$transaction(async (tx) => {
            const sale = await tx.sale.findUnique({ where: { id }, include: { items: true } });
            if (!sale) throw new Error("Sale not found");

            if (sale.isLocked || sale.status === "CONFIRMED" || sale.status === "PARTIALLY_INVOICED") {
                throw new Error("Cannot delete confirmed, partially invoiced, or locked sale");
            }

            // Restore inventory & record
            for (const item of sale.items) {
                const inventory = await tx.inventory.findFirst({
                    where: { productId: item.productId, locationId: sale.locationId },
                });
                if (inventory) {
                    await tx.inventory.update({
                        where: { id: inventory.id },
                        data: { quantity: { increment: item.quantity } },
                    });

                    await recordInventoryTransaction({
                        productId: item.productId,
                        locationId: sale.locationId,
                        delta: item.quantity,
                        source: "SALE",
                        reference: sale.id,
                        createdById: user.id,
                    });
                }
            }

            await tx.saleItem.deleteMany({ where: { saleId: id } });
            await tx.sale.delete({ where: { id } });
        });

        return NextResponse.json({ success: true, message: "Sale deleted" });
    } catch (error) {
        console.error("Delete sale failed:", error);
        return NextResponse.json(
            { error: "Failed to delete sale", details: (error as Error).message },
            { status: 500 }
        );
    }
}
