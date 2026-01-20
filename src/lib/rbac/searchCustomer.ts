export function buildCustomerSearchWhere(search?: string) {
    if (!search) return {};

    return {
        OR: [
            { name: { contains: search, mode: "insensitive" } },
            { email: { contains: search, mode: "insensitive" } },
            { phone: { contains: search, mode: "insensitive" } },
            { tpinNumber: { contains: search, mode: "insensitive" } },
            { country: { contains: search, mode: "insensitive" } },
            { city: { contains: search, mode: "insensitive" } },
            { address: { contains: search, mode: "insensitive" } },
            {
                user: { is: { fullName: { contains: search, mode: "insensitive" } } },
            },
            {
                createdBy: { is: { fullName: { contains: search, mode: "insensitive" } } },
            },
        ],
    };
}
