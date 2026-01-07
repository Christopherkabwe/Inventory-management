
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const whereClause: any = {};

    // Apply RBAC
    if (user.role !== "ADMIN") {
        whereClause.inventories = {
            some: {
                locationId: user.locationId,
            },
        };
    }

    const products = await prisma.productList.findMany({
        where: whereClause,
        include: {
            createdBy: true,
            inventories: {
                include: {
                    location: true,
                    createdBy: true,
                },
            },
            saleItems: {
                include: {
                    sale: {
                        include: {
                            customer: true,
                            location: true,
                            transporter: true,
                            createdBy: true,
                        },
                    },
                },
            },
            transferItems: {
                include: {
                    transfer: {
                        include: {
                            fromLocation: true,
                            toLocation: true,
                            transporter: true,
                            createdBy: true,
                        },
                    },
                },
            },
            productionItems: {
                include: {
                    production: {
                        include: {
                            location: true,
                            createdBy: true,
                        },
                    },
                },
            },
            adjustmentItems: {
                include: {
                    adjustment: {
                        include: {
                            location: true,
                            createdBy: true,
                        },
                    },
                },
            },
            orderItems: {
                include: {
                    salesOrder: {
                        include: {
                            customer: true,
                            location: true,
                            createdBy: true,
                        },
                    },
                },
            },
            quotationItems: {
                include: {
                    quotation: {
                        include: {
                            customer: true,
                            location: true,
                            createdBy: true,
                        },
                    },
                },
            },
            saleReturns: {
                include: {
                    sale: {
                        include: {
                            customer: true,
                            location: true,
                        },
                    },
                    createdBy: true,
                },
            },
            deliveryNoteItems: {
                include: {
                    deliveryNote: {
                        include: {
                            sale: {
                                include: {
                                    customer: true,
                                    location: true,
                                },
                            },
                            location: true,
                            transporter: true,
                            createdBy: true,
                        },
                    },
                },
            },
            transferReceiptItems: {
                include: {
                    transferReceipt: {
                        include: {
                            transfer: {
                                include: {
                                    fromLocation: true,
                                    toLocation: true,
                                },
                            },
                            receivedBy: true,
                        },
                    },
                },
            },
        },
    });

    return NextResponse.json(products);
}