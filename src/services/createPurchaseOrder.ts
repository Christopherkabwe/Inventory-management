export async function createPurchaseOrder(data: {
    supplierId: string;
    locationId: string;
    createdById: string;
    notes?: string;
    items: {
        productId: string;
        quantity: number;
        unitPrice: number;
        uom: string;
    }[];
}) {
    return prisma.$transaction(async (tx) => {
        const po = await tx.purchaseOrder.create({
            data: {
                poNumber: `PO-${Date.now()}`,
                status: "DRAFT",
                notes: data.notes,
                createdById: data.createdById,

                // ✅ REQUIRED RELATION CONNECTS (THIS FIXES THE ERROR)
                supplier: {
                    connect: { id: data.supplierId },
                },
                location: {
                    connect: { id: data.locationId },
                },

                items: {
                    create: data.items.map(i => ({
                        product: { connect: { id: i.productId } },
                        quantity: i.quantity,
                        unitPrice: i.unitPrice,
                        uom: i.uom,
                    })),
                },
            },
            include: {
                supplier: true,
                location: true,
                items: { include: { product: true } },
            },
        });

        return po;
    });
}
