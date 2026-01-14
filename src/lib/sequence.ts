import { prisma } from "@/lib/prisma";

// Function to get the next sequence number for various types

export async function nextSequence(
    type: "INV" | "DN" | "IBT" | "SO" | "QUOTE" | "PROD" | "BATCH" | "ADJ" | "CN" | "RETURN",
    increment: boolean = false
) {
    const year = new Date().getFullYear();
    const seq = await prisma.sequence.findUnique({
        where: { id_year: { id: type, year } },
    });

    if (seq) {
        if (increment) {
            await prisma.sequence.update({
                where: { id_year: { id: type, year } },
                data: { value: { increment: 1 } },
            });
        }
        return `${type}${String(increment ? seq.value + 1 : seq.value).padStart(6, "0")}`;
    } else {
        await prisma.sequence.create({
            data: { id: type, year, value: 1 },
        });
        return `${type}000001`;
    }
}