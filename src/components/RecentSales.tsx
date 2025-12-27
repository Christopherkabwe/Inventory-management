import { Clock } from "lucide-react";

interface Sale {
    id: string;
    customerName: string | null;
    product: { name: string };
    location: { name: string };
    quantity: number;
    salePrice: number;
    saleDate: Date;
}

interface Props {
    sales: Sale[];
}

export default function RecentSales({ sales }: Props) {
    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" /> Recent Sales
            </h3>
            {sales.length === 0 ? (
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
                            {sales.slice(0, 10).map((sale) => (
                                <tr key={sale.id} className="border-b last:border-0 hover:bg-gray-50">
                                    <td className="px-4 py-3 truncate">{sale.customerName}</td>
                                    <td className="px-4 py-3 truncate">{sale.product.name}</td>
                                    <td className="px-4 py-3 truncate">{sale.location?.name || 'N/A'}</td>
                                    <td className="px-4 py-3 text-center">{sale.quantity}</td>
                                    <td className="px-4 py-3 text-center">K{sale.salePrice.toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">K{(sale.salePrice * sale.quantity).toFixed(2)}</td>
                                    <td className="px-4 py-3 text-center">
                                        {new Date(sale.saleDate).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}