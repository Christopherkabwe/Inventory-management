import { prisma } from "@/lib/prisma";

// Function to get the next sequence number for various types

export async function nextSequence(
    type: "INV" | "DN" | "IBT" | "SO" | "QUOTE" | "PROD" | "BATCH" | "ADJ" | "CN" | "SR" | "RETURN" | "PO" | "GRN",
    increment: boolean = false
) {
    const year = new Date().getFullYear();
    const seq = await prisma.sequence.findUnique({
        where: { id_year: { id: type, year } },
    });

    if (seq) {
        return `${type}${String(seq.value).padStart(6, "0")}`;
    } else {
        await prisma.sequence.create({
            data: { id: type, year, value: 1 },
        });
        return `${type}000001`;
    }
}

// Function to increment the sequence number
export async function incrementSequence(
    type: "INV" | "DN" | "IBT" | "SO" | "QUOTE" | "PROD" | "BATCH" | "ADJ" | "CN" | "SR" | "RETURN" | "PO" | "GRN"
) {
    const year = new Date().getFullYear();
    await prisma.sequence.update({
        where: { id_year: { id: type, year } },
        data: { value: { increment: 1 } },
    });
}
