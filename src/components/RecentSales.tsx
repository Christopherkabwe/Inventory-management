'use client';

import { useEffect, useState } from "react";
import { Clock } from "lucide-react";

type Sale = {
    id: string;
    customer: { name: string };
    location: { name: string };
    transporter: { name: string; vehicleNumber: string; driverName: string };
    items: {
        product: {
            name: string;
            packSize: string;
            weightUnit: string;
            weightValue: number;
        };
        quantity: number;
        price: number;
        total: number;
    }[];
    saleDate: string;
    isReturn: boolean;
    invoiceNumber: string;
    deliveryNote: string;
};

export default function RecentSales({ userId }: { userId?: string }) {
    const [sales, setSales] = useState<Sale[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSales = async () => {
            try {
                setLoading(true);
                const url = userId ? `/api/sales?userId=${userId}` : "/api/sales";
                const res = await fetch(url);
                const data = await res.json();
                const recent = (data.data || [])
                    .sort((a: Sale, b: Sale) => new Date(b.saleDate).getTime() - new Date(a.saleDate).getTime())
                    .slice(0, 20);
                setSales(recent);
            } catch (err) {
                console.error("Failed to fetch sales:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchSales();
    }, [userId]);

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow mb-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                Recent Sales Transactions
            </h3>

            {loading ? (
                <p className="text-sm text-gray-500 flex justify-center items-center h-24">
                    Loading...
                </p>
            ) : sales.length === 0 ? (
                <p className="text-sm text-gray-500">No recent sales.</p>
            ) : (
                <div className="overflow-auto max-h-[300px]">
                    <table className="min-w-full text-sm">
                        <thead className="bg-gray-300 top-0 sticky border-b">
                            <tr>
                                <th className="px-4 py-2 border text-left">#</th>
                                <th className="px-4 py-2 border text-left">Customer</th>
                                <th className="px-4 py-2 border text-left">Product</th>
                                <th className="px-4 py-2 border text-left">Pack Size</th>
                                <th className="px-4 py-2 border text-left">Weight</th>
                                <th className="px-4 py-2 border text-left">Location</th>
                                <th className="px-4 py-2 border text-center">Quantity</th>
                                <th className="px-4 py-2 border text-center">Price</th>
                                <th className="px-4 py-2 border text-center">Total</th>
                                <th className="px-4 py-2 border text-center">Tonnage</th>
                                <th className="px-4 py-2 border text-left">Invoice #</th>
                                <th className="px-4 py-2 border text-left">Delivery Note</th>
                                <th className="px-4 py-2 border text-left">Transporter</th>
                                <th className="px-4 py-2 border text-left">Vehicle #</th>
                                <th className="px-4 py-2 border text-left">Driver</th>
                                <th className="px-4 py-2 border text-center">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sales.map((s, index) => (
                                <tr
                                    key={s.id + index}
                                    className="border-b last:border-0 hover:bg-gray-50"
                                >
                                    <td className="px-4 py-2 text-center">{index + 1}</td>
                                    <td className="px-4 py-2 truncate">{s.customer.name}</td>
                                    <td className="px-4 py-2 truncate">{s.items.map(i => i.product.name).join(", ")}</td>
                                    <td className="px-4 py-2 truncate">{s.items.map(i => i.product.packSize).join(", ")}</td>
                                    <td className="px-4 py-2 truncate">{s.items.map(i => `${i.product.weightValue.toFixed(2)} ${i.product.weightUnit}`).join(", ")}</td>
                                    <td className="px-4 py-2">{s.location.name}</td>
                                    <td className="px-4 py-2 text-center">{s.items.map(i => i.quantity).join(", ")}</td>
                                    <td className="px-4 py-2 text-center">{s.items.map(i => i.price.toFixed(2)).join(", ")}</td>
                                    <td className="px-4 py-2 text-center">{s.items.map(i => i.total.toFixed(2)).join(", ")}</td>
                                    <td className="px-4 py-2 text-center">{s.items.map(i => {
                                        const weightInKg = i.product.weightUnit === 'kg' ? i.product.weightValue : i.product.weightValue / 1000;
                                        const tonnage = (weightInKg * i.quantity) / 1000;
                                        return tonnage.toFixed(2);
                                    }).join(", ")}</td>
                                    <td className="px-4 py-2">{s.invoiceNumber}</td>
                                    <td className="px-4 py-2">{s.deliveryNote}</td>
                                    <td className="px-4 py-2 truncate">{s.transporter.name}</td>
                                    <td className="px-4 py-2 truncate">{s.transporter.vehicleNumber}</td>
                                    <td className="px-4 py-2 truncate">{s.transporter.driverName}</td>
                                    <td className="px-4 py-2 text-center">{new Date(s.saleDate).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )
            }
        </div >
    );
}
