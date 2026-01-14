function normalizeInventory(raw: any[] = []) {
    return raw.map(inv => ({
        ...inv,
        product: inv.product ?? null,
        location: inv.location ?? null,
        assignedUser: inv.assignedUser ?? null,
        createdBy: inv.createdBy ?? null,
        expiryDate: inv.expiryDate ? new Date(inv.expiryDate) : null,
    }));
}

export async function fetchInventory(url = "/api/rbac/inventory") {
    const res = await fetch(url, {
        cache: "no-store",
        credentials: "include",
    });

    if (!res.ok) {
        throw new Error(`Failed to fetch inventory: ${res.status}`);
    }

    const data = await res.json();

    const inventory = Array.isArray(data)
        ? data
        : Array.isArray(data?.inventory)
            ? data.inventory
            : [];

    return normalizeInventory(inventory);
}
