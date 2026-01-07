export async function nextSequence(
    tx: any,
    type: "INV" | "DN" | "IBT" | "SO" | "QUOTE" | "PROD" | "ADJ" | "CN" | "RETURN"
) {
    const year = new Date().getFullYear();

    const seq = await tx.sequence.upsert({
        where: {
            id_year: { id: type, year },
        },
        update: {
            value: { increment: 1 },
        },
        create: {
            id: type,
            year,
            value: 1,
        },
    });

    return `${type}-${year}-${String(seq.value).padStart(6, "0")}`;
}