import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
    if (req.method === "POST") {
        const { productId, locationId, type, quantity, reason, targetProductId } = req.body;

        // Handle normal adjustments
        if (type !== "REBAG_LOSS") {
            const adj = await prisma.adjustment.create({
                data: { productId, locationId, type, quantity, reason, createdBy: "admin" },
            });

            // Update inventory
            await prisma.inventory.updateMany({
                where: { productId, locationId },
                data: { quantity: { increment: type === "REBAG_GAIN" ? quantity : -quantity } },
            });

            return res.status(201).json(adj);
        }

        // Handle Rebagging
        const result = await prisma.$transaction(async (tx) => {
            // 1️⃣ Reduce source product
            const rebagLoss = await tx.adjustment.create({
                data: { productId, locationId, type: "REBAG_LOSS", quantity, createdBy: "admin", reason },
            });

            await tx.inventory.updateMany({
                where: { productId, locationId },
                data: { quantity: { decrement: quantity } },
            });

            // 2️⃣ Increase target product
            const rebagGain = await tx.adjustment.create({
                data: { productId: targetProductId, locationId, type: "REBAG_GAIN", quantity, createdBy: "admin", reason },
            });

            await tx.inventory.updateMany({
                where: { productId: targetProductId, locationId },
                data: { quantity: { increment: quantity } },
            });

            return { rebagLoss, rebagGain };
        });

        return res.status(201).json(result);
    }

    res.status(405).end();
}
