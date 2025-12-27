import { fetchInventoryData } from "@/lib/server/fetchInventoryData";
import TestPageClient from "./TestPageClient";

export default async function Page() {
    const data = await fetchInventoryData();

    const categories = Array.from(
        new Set(data.products.map(p => p.category).filter(Boolean))
    ).map(category => ({
        id: category,
        name: category,
    }));


    return (
        <TestPageClient
            inventory={data.inventories}
            locations={data.locations}
            products={data.products}
            categories={categories}
        />
    );
}
