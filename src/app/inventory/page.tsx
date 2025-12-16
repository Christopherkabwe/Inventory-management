//"use client";
import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/pagination";
import EditInventoryButton from "@/components/EditInventoryButton";
import Link from "next/link";
import DeleteInventoryButton from "@/components/DeleteInventoryButton";
import LocationDropdown from "@/components/LocationDropdown";



export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; locationName?: string[] }>;
}) {
    const user = await getCurrentUser();
    const userId = user.id;
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const locations = Array.isArray(params.locationName) ? params.locationName : params.locationName ? [params.locationName] : [];
    const where = {
        createdBy: userId,
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

    const [totalCount, items, allLocations] = await Promise.all([
        prisma.inventory.count({ where }),
        prisma.inventory.findMany({
            where,
            include: { product: true, location: true }, // Include location details
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
        prisma.location.findMany({
            where: { createdBy: userId },
            select: { id: true, name: true },
        }),
    ]);

    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const uniqueLocations = allLocations; // Now an array of { id, name }

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/inventory" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                            <p className="text-sm text-gray-500">Manage your stock products and track inventory levels</p>
                        </div>
                    </div>
                </div>
                <div className="space-y-6">
                    {/* Search and Filter */}
                    <div className="bg-white rounded-lg border-gray-200 p-6">
                        <form action="/inventory" method="GET" className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Search */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Search Products
                                    </label>
                                    <input
                                        name="q"
                                        placeholder="Search Products..."
                                        defaultValue={q}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                {/* Location Dropdown */}
                                <LocationDropdown uniqueLocations={uniqueLocations} selectedLocations={locations} />
                            </div>
                            <div className="flex gap-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Apply Filters
                                </button>
                                <Link
                                    href={{
                                        pathname: '/inventory',
                                        query: { page: params.page }, // Keep page if needed
                                    }}
                                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                                >
                                    Clear Filters
                                </Link>
                            </div>
                        </form>
                    </div>
                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">SKU</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Price</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Quantity</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Low Stock At</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {items.map((inventory, key) => (
                                    <tr key={key} className={`hover:bg-gray-50 ${key % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.product.name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.location.name}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.product.sku}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">K{Number(inventory.product.price).toFixed(2)}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.quantity}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.lowStockAt}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500 flex gap-2">
                                            <EditInventoryButton inventory={inventory} locations={uniqueLocations} />
                                            <DeleteInventoryButton inventory={inventory} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {totalPages > 1 && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6">
                            <Pagination
                                currentPage={page}
                                totalPages={totalPages}
                                baseUrl="/inventory"
                                SearchParams={{ q, location: locations.join(','), pageSize: String(pageSize) }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}