import Sidebar from "@/components/sidebar";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Pagination from "@/components/pagination";
import EditInventoryButton from "@/components/EditInventoryButton";
import Link from "next/link";
import DeleteInventoryButton from "@/components/DeleteInventoryButton";

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string }>;
}) {
    const user = await getCurrentUser();
    const userId = user.id;
    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const where = {
        createdBy: userId,
        ...(q ? { product: { name: { contains: q, mode: "insensitive" as const } } } : {}),
    };
    const pageSize = 10;
    const page = Math.max(1, Number(params.page ?? 1));
    const [totalCount, items] = await Promise.all([
        prisma.inventory.count({ where }),
        prisma.inventory.findMany({
            where,
            include: { product: true },
            orderBy: { createdAt: "desc" },
            skip: (page - 1) * pageSize,
            take: pageSize,
        }),
    ]);
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

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
                    {/* Search */}
                    <div className="bg-white rounded-lg border-gray-200 p-6">
                        <form action="/inventory" method="GET" className="flex gap-2">
                            <input
                                name="q"
                                placeholder="Search Products..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent"
                            />
                            <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                                Search
                            </button>
                        </form>
                    </div>
                    {/* Products Table */}
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Name</th>
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
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.product.sku}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">K{Number(inventory.product.price).toFixed(2)}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.quantity}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500">{inventory.lowStockAt}</td>
                                        <td className="px-6 py-3 text-sm text-gray-500 flex gap-2">
                                            <EditInventoryButton
                                                inventory={{
                                                    id: inventory.id,
                                                    product: {
                                                        name: inventory.product.name,
                                                        price: inventory.product.price,
                                                    },
                                                    quantity: inventory.quantity,
                                                    lowStockAt: inventory.lowStockAt,
                                                    location: inventory.location,
                                                }}
                                            />
                                            {/*<DeleteProductButton id={inventory.id} />*/}
                                            <DeleteInventoryButton
                                                inventory={{
                                                    id: inventory.id,
                                                    product: {
                                                        name: inventory.product.name,
                                                        price: inventory.product.price,
                                                    },
                                                    quantity: inventory.quantity,
                                                    lowStockAt: inventory.lowStockAt,
                                                    location: inventory.location,
                                                }}
                                            />
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
                                SearchParams={{ q, pageSize: String(pageSize) }}
                            />
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}