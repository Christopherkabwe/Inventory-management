// src/lib/queries/transfers.ts
import { prisma } from "@/lib/prisma";

export async function getAllTransfersRaw() {
    return prisma.transfer.findMany({
        orderBy: {
            createdAt: "desc",
        },
        include: {
            fromLocation: true,
            toLocation: true,
            transporter: true,
            createdBy: {
                select: {
                    id: true,
                    fullName: true,
                    email: true,
                },
            },
            items: {
                include: {
                    product: {
                        select: {
                            sku: true,
                            name: true,
                            category: true,
                            packSize: true,
                            weightValue: true,
                            weightUnit: true,
                        },
                    },
                },
            },
            receipt: {
                include: {
                    receivedBy: {
                        select: {
                            id: true,
                            fullName: true,
                        },
                    },
                    items: {
                        include: {
                            product: {
                                select: {
                                    sku: true,
                                    name: true,
                                },
                            },
                        },
                    },
                },
            },
        },
    });
}
