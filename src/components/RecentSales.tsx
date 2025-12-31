import { Clock } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { Sale } from "./Sale";

interface Props {
    userId: string;
}

export default async function RecentSales({ userId }: Props) {
    const sales: Sale[] = await prisma.sale.findMany({
        where: { createdBy: userId },
        orderBy: { createdAt: "desc" },
        include: {
            product: true,
            location: true,
        },
    });

    const recentSales = sales.slice(0, 10);

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow mb-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" /> Recent Sales
            </h3>
            {recentSales.length === 0 ? (
                <p className="text-sm text-gray-500">No recent sales.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-200 border-b">
                            <tr>
                                <th className="px-4 py-2 border-r text-left">Customer</th>
                                <th className="px-4 py-2 border-r text-left">Product</th>
                                <th className="px-4 py-2 border-r text-left">Location</th>
                                <th className="px-4 py-2 border-r text-center">Quantity</th>
                                <th className="px-4 py-2 border-r text-center">Price</th>
                                <th className="px-4 py-2 border-r text-center">Revenue</th>
                                <th className="px-4 py-2 border-r text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentSales.map((sale) => (
                                <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-3 truncate">{sale.customerName || "N/A"}</td>
                                    <td className="px-4 py-3 truncate">{sale.product?.name || "N/A"}</td>
                                    <td className="px-4 py-3 truncate">{sale.location?.name || "N/A"}</td>
                                    <td className="px-4 py-3 text-center">{sale.quantity}</td>
                                    <td className="px-4 py-3 text-center">K{sale.salePrice.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">K{(sale.salePrice * sale.quantity).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">{new Date(sale.saleDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
