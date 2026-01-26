import { BarChart3, Package, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardLayout from '@/components/DashboardLayout';

export default async function Dashboard() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/sign-in");
    }

    // Optional: Auto-redirect to inventory dashboard after 3 seconds

    return (
        <>
            <div className="p-8 min-h-screen">
                <h1 className="text-3xl font-bold mb-3">Dashboard</h1>
                <p className="text-gray-500 mb-8">Select dashboard to view:</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link
                        href="/dashboard/sales"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-purple-100 p-3 rounded-full">
                            <Package className="h-6 w-6 text-purple-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Sales Dashboard</h3>
                            <p className="text-sm text-gray-500">View sales trends, performance, and insights.</p>
                        </div>
                    </Link>

                    <Link
                        href="/dashboard/inventory"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Inventory Dashboard</h3>
                            <p className="text-sm text-gray-500">Track stock levels, low inventory, and more.</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Human Resource Dashboard</h3>
                            <p className="text-sm text-gray-500">View sales trends, performance, and insights.</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Accounting Dashboard</h3>
                            <p className="text-sm text-gray-500">View sales trends, performance, and insights.</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Finance Dashboard</h3>
                            <p className="text-sm text-gray-500">View sales trends, performance, and insights.</p>
                        </div>
                    </Link>
                    <Link
                        href="/dashboard/inventory"
                        className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow flex items-center space-x-4"
                    >
                        <div className="bg-green-100 p-3 rounded-full">
                            <ShoppingCart className="h-6 w-6 text-green-600" />
                        </div>
                        <div>
                            <h3 className="text-lg text-black font-semibold">Production Dashboard</h3>
                            <p className="text-sm text-gray-500">View sales trends, performance, and insights.</p>
                        </div>
                    </Link>
                </div>
            </div>
        </>
    );
}