import { prisma } from "@/lib/prisma";
import { BOMStatus } from "@/generated/prisma";

export type CreateBOMInput = {
    productId: string;
    version?: number;
    status?: BOMStatus;
    components: {
        componentId: string;
        quantity: number;
        unit: string;
    }[];
    userId: string;
};

export async function createBOM({
    productId,
    version,
    status = "DRAFT",
    components,
    userId,
}: CreateBOMInput) {
    // -----------------------------
    // Validation (domain-level)
    // -----------------------------
    if (!productId) {
        throw new Error("productId is required");
    }

    if (!components || components.length === 0) {
        throw new Error("At least one BOM component is required");
    }

    for (const component of components) {
        if (component.quantity <= 0) {
            throw new Error("component quantity must be greater than 0");
        }
    }

    // -----------------------------
    // Versioning (deterministic)
    // -----------------------------
    const latestBOM = await prisma.bOM.findFirst({
        where: { productId },
        orderBy: { version: "desc" },
        select: { version: true },
    });

    const nextVersion =
        version ?? (latestBOM ? Number(latestBOM.version) + 1 : 1);

    // -----------------------------
    // Transaction (atomic)
    // -----------------------------
    return prisma.$transaction(async (tx) => {
        const bom = await tx.bOM.create({
            data: {
                productId,
                version: nextVersion,
                status,
                createdById: userId,
                components: {
                    create: components.map((component) => ({
                        componentId: component.componentId,
                        quantity: component.quantity,
                        unit: component.unit,
                    })),
                },
            },
            include: {
                product: true,
                components: {
                    include: {
                        component: true,
                    },
                },
                createdBy: {
                    select: {
                        id: true,
                        fullName: true,
                        email: true,
                    },
                },
            },
        });

        return bom;
    });
}
