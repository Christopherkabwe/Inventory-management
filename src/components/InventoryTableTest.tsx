import Pagination from "@/components/pagination";
import EditInventoryButton from "@/components/EditInventoryButton";
import DeleteInventoryButton from "@/components/DeleteInventoryButton";
import InventoryFilters from "@/components/InventoryFilters";
import { unitToKg } from "@/lib/UnitToKg";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { fetchDashboardData } from "@/lib/fetchData";
import DashboardLayout from "@/components/DashboardLayout";

export const metadata = { title: "Inventory Summary" };

export default async function InventoryPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string; page?: string; locationName?: string[]; productId?: string }>;
}) {
    const user = await getCurrentUser();
    if (!user) throw new Error("Unauthorized");

    const params = await searchParams;
    const q = (params.q ?? "").trim();
    const productId = params.productId;
    const locations = Array.isArray(params.locationName)
        ? params.locationName
        : params.locationName
            ? [params.locationName]
            : [];

    const pageSize = 10;
    const page = Math.max(1, Number(params.page ?? 1));

    // ==================== FETCH DASHBOARD DATA ====================
    const dashboardData = await fetchDashboardData();

    const inventories = await prisma.inventory.findMany({
        include: {
            product: true,
            location: true,
            assignedUser: true,
            createdBy: true,
        },
    });
    const sales = dashboardData.totalSales ? dashboardData.totalSales : [];

    // ==================== FILTER INVENTORY FOR TABLE ====================
    const filteredInventory = inventories.filter((inv) => {
        const matchProduct = productId ? inv.productId === productId : true;
        const matchQuery = q ? inv.product?.name.toLowerCase().includes(q.toLowerCase()) : true;
        const matchLocation = locations.length ? locations.includes(inv.location?.name) : true;
        return matchProduct && matchQuery && matchLocation;
    });

    const totalCount = filteredInventory.length;
    const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
    const paginatedItems = filteredInventory.slice((page - 1) * pageSize, page * pageSize);

    // ==================== COMPUTE TONNAGE & VALUE ====================
    const computedItems = paginatedItems.map((inventory) => {
        const quantity = inventory.quantity || 0;
        const packSize = inventory.product?.packSize || 1;
        const weightValue = inventory.product?.weightValue || 0;
        const weightUnit = inventory.product?.weightUnit || "kg";
        const price = Number(inventory.product?.price) || 0;

        const tonnage = (quantity * packSize * unitToKg(weightValue, weightUnit)) / 1000;
        const value = quantity * price;

        return { ...inventory, tonnage, value };
    });

    // ==================== UNIQUE LOCATIONS ====================
    const uniqueLocations = Array.from(new Set(inventories.map((i) => i.location?.name))).map((name) => ({
        id: inventories.find((inv) => inv.location?.name === name)?.location?.id,
        name,
    }));

    return (
        <DashboardLayout>
            <div className="mb-5">
                <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                <p className="text-sm text-gray-500">Manage your stock products and track inventory levels</p>
            </div>

            <div id="inventory-table" className="space-y-4 bg-white p-4 rounded-xl border hover:shadow-md transition-shadow">
                {/* Search and Filter */}
                <InventoryFilters
                    uniqueLocations={uniqueLocations}
                    initialQ={q}
                    initialLocations={locations} />

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
                                <tr
                                    key={inventory.id ?? index}
                                    className={`hover:bg-gray-50 ${index % 2 === 0 ? "bg-white" : "bg-gray-50"}`}
                                >
                                    <td className="px-3 py-2 border-r">{index + 1}</td>
                                    <td className="px-3 py-2 border-r">{inventory.product?.name}</td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.product?.sku}</td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.product?.packSize}</td>
                                    <td className="px-3 py-2 border-r">{inventory.product?.weightValue}</td>
                                    <td className="px-3 py-2 border-r">{inventory.product?.weightUnit}</td>
                                    <td className="px-3 py-2 border-r">{inventory.location?.name}</td>
                                    <td className="px-3 py-2 border-r text-center">
                                        K{Number(inventory.product?.price).toFixed(2)}
                                    </td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.quantity}</td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.tonnage.toFixed(2)}</td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.value.toFixed(2)}</td>
                                    <td className="px-3 py-2 border-r text-center">{inventory.lowStockAt}</td>
                                    <td className="flex px-3 py-2 border-r items-center justify-center gap-2">
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
                        SearchParams={{ q, location: locations.join(","), pageSize: String(pageSize) }}
                    />
                </div>
            )}
        </DashboardLayout >
    );
}