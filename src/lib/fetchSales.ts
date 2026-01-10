function normalizeSales(raw: any[] = []) {
    return raw.map(sale => ({
        ...sale,
        items:
            sale.items?.length
                ? sale.items
                : sale.salesOrder?.items ?? [],
        customer:
            sale.customer ?? sale.salesOrder?.customer ?? null,
        location:
            sale.location ?? sale.salesOrder?.location ?? null,
    }));
}

export async function fetchSales(url = "/api/rbac/sales") {
    const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch sales: ${res.status}`);
    }

    const data = await res.json();

    const sales = Array.isArray(data)
        ? data
        : Array.isArray(data?.sales)
            ? data.sales
            : [];

    return normalizeSales(sales);
}
