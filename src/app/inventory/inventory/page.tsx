//"use client";
import Sidebar from "@/components/sidebar2";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/pagination";
import EditInventoryButton from "@/components/EditInventoryButton";
import DeleteInventoryButton from "@/components/DeleteInventoryButton";
import InventoryFilters from "@/components/InventoryFilters";
import InventorySummary from "@/components/InventorySummary";
import { unitToKg } from "@/lib/UnitToKg";


export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; locationName?: string[], productId?: string; }>;
}) {
    const user = await getCurrentUser();
    const userId = user.id;
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const productId = params.productId;
    const locations = Array.isArray(params.locationName) ? params.locationName : params.locationName ? [params.locationName] : [];
    const where = {
        createdBy: userId,
        ...(productId && {
            productId,
        }),
        ...(q && {
            product: {
                name: { contains: q, mode: "insensitive" as const },
            },
        }),
        ...(locations.length && {
            location: {
                name: { in: locations },
            },
        }),
    };

    const pageSize = 10;
    const page = Math.max(1, Number(params.page ?? 1));

    const [totalCount, items, allLocations, inventory, sales] = await Promise.all([
        prisma.inventory.count({ where }),
        prisma.inventory.findMany({
            where,
            include: { product: true, location: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.location.findMany({
            where: { createdBy: userId },
            select: { id: true, name: true },
        }),
        prisma.inventory.findMany({
            where: { createdBy: userId },
            include: {
                product: {
                    select: {
                        id: true,
                        name: true,
                        sku: true,
                        price: true,
                        weightValue: true,
                        weightUnit: true,
                        packSize: true,
                        category: true,
                    },
                },
                location: true,
            },
        }),
        prisma.sale.findMany({
            where: {
                createdBy: userId,
                saleDate: {
                    gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
                },
            },
            include: {
                items: {
                    include: {
                        product: {
                            select: { price: true },
                        },
                    },
                },
            },
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const uniqueLocations = allLocations; // Now an array of { id, name }

    // Process the inventory data
    const processedInventory = inventory.map((item) => ({
        ...item,
        product: {
            ...item.product,
            // Add any additional processing here
        },
    }));

    // Process the sales data
    const processedSales = sales.map((sale) => ({
        ...sale,
        product: {
            ...sale.items,
            // Add any additional processing here
        },
    }));

    // Computed Items


    // After fetching `items`
    const computedItems = items.map((inventory) => {
        const quantity = inventory.quantity || 0;
        const packSize = inventory.product.packSize || 1;
        const weightValue = inventory.product.weightValue || 0;
        const weightUnit = inventory.product.weightUnit || "kg";
        const price = Number(inventory.product.price) || 0;

        const tonnage =
            (quantity * packSize * (unitToKg(weightValue, weightUnit))) / 1000;

        const value = quantity * price;

        return { ...inventory, tonnage, value };
    });

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/inventory/inventory" />
            <main className="ml-64 p-8">
                <div className="mb-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                            <p className="text-sm text-gray-500">Manage your stock products and track inventory levels</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8 mb-5">
                    <InventorySummary
                        inventory={processedInventory}
                        sales={processedSales}
                        title="Inventory Summary"
                        iconColor="text-green-600"
                    />
                </div>
                <div id="inventory-table" className="space-y-4 bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
                    <div className="">
                        {/* Search and Filter */}
                        <InventoryFilters
                            uniqueLocations={allLocations || []}
                            initialQ={q}
                            initialLocations={locations}
                        />
                    </div>
                    {/* Products Table */}
                    <div className="bg-white overflow-hidden">
                        <table className="w-full text-sm border border-gray-200">
                            <thead className="bg-gray-200">
                                <tr>
                                    <th className="py-2 px-3 border-r text-left font-semibold">#</th>
                                    <th className="py-2 px-3 border-r text-left font-semibold">Product Name</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">SKU</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Pack Size</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Weight Value</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Weight Unit</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Location</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Price</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Quantity</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Tonnage</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Value</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Low Stock At</th>
                                    <th className="py-2 px-3 border-r text-center font-semibold">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-300">
                                {computedItems.map((inventory, index) => (
                                    <tr key={inventory.id ?? index} className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                                        <td className="px-3 py-2 border-r">{index + 1}</td>
                                        <td className="px-3 py-2 border-r">{inventory.product.name}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.product.sku}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.product.packSize}</td>
                                        <td className="px-3 py-2 border-r">{inventory.product.weightValue}</td>
                                        <td className="px-3 py-2 border-r">{inventory.product.weightUnit}</td>
                                        <td className="px-3 py-2 border-r">{inventory.location.name}</td>
                                        <td className="px-3 py-2 border-r text-center">K{Number(inventory.product.price).toFixed(2)}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.quantity}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.tonnage.toFixed(2)}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.value.toFixed(2)}</td>
                                        <td className="px-3 py-2 border-r text-center">{inventory.lowStockAt}</td>
                                        <td className="flex px-3 py-2 border-r items-center justify-center  gap-2">
                                            <EditInventoryButton inventory={inventory} locations={uniqueLocations} />
                                            <DeleteInventoryButton inventory={inventory} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                {totalPages > 1 && (
                    <div className="bg-gray-100 rounded-lg border border-gray-200 p-6 mt-5">
                        <Pagination
                            currentPage={page}
                            totalPages={totalPages}
                            baseUrl="/inventory/inventory"
                            SearchParams={{ q, location: locations.join(','), pageSize: String(pageSize) }}
                        />
                    </div>
                )}
            </main >
        </div >
    );
}