export const unitToKg = (weight: number, unit?: string | null) => {
    const map: Record<string, number> = {
        kg: 1,
        g: 0.001,
        mg: 0.000001,
        lb: 0.453592,
        oz: 0.0283495,
        ton: 1000,
        // add more if needed
    };

    const u = typeof unit === "string" ? unit.toLowerCase() : "";
    const factor = map[u] ?? 1; // fallback to 1 if unknown

    return weight * factor;
};


// HOW TO USE //

//import { unitToKg } from "@/lib/unitToKg";

// Inside your aggregate calculation:
//map[p.id].tonnage +=
//    (item.quantity * p.packSize * unitToKg(item.product.weightValue, item.product.weightUnit)) / 1000;

