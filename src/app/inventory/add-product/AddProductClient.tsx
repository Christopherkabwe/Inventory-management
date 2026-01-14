"use client";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Sidebar from "@/components/sidebar";
import { CreateProduct } from "@/lib/actions/products";
import ProductList from "./ProductList";
import { useFormStatus } from "react-dom";

interface Props {
    isAdmin: boolean;
    products: any[] | { error: string };
    error?: string;
    users: any[];
    locations: any[];
    categories: any[];
}

export default function AddProductClient({ isAdmin, products, users, locations, categories, error }: Props) {
    const initialState = { message: null, success: false };
    const [state, dispatch] = useActionState(CreateProduct, initialState);
    const router = useRouter();

    useEffect(() => {
        if (state?.message) {
            if (state.success) {
                toast.success(state.message);
                router.refresh(); // refresh product list
            } else {
                toast.error(state.message);
            }
        }
    }, [state, router]);

    useEffect(() => {
        if (error) {
            toast.error(error);
        }
    }, [error]);

    if (!isAdmin) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Sidebar currentPath="/add-product" />
                <main className="ml-64 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold">Add Product</h1>
                        <p className="text-sm text-gray-500"> You do not have permission to add products. </p>
                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar currentPath="/add-product" />
            <main className="ml-64 p-8">
                <div className="mb-8">
                    <h1 className="text-2xl font-semibold">Add Product</h1>
                    <p className="text-sm text-gray-500"> Add new products to your inventory </p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* LEFT — FORM */}
                    <div className="lg:col-span-2 bg-white border rounded-lg p-6">
                        <form action={dispatch} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                                <input type="text" id="name" name="name" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Product Name" />
                            </div>
                            <div>
                                <label htmlFor="sku" className="block text-sm font-medium text-gray-700 mb-2">SKU *</label>
                                <input type="text" id="sku" name="sku" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Product SKU" />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                                    <input type="number" id="price" name="price" step="0.01" min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Price..." />
                                </div>
                                <div>
                                    <label htmlFor="packSize" className="block text-sm font-medium text-gray-700 mb-2">Pack Size *</label>
                                    <input type="number" id="packSize" name="packSize" step="1" min="1" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Pack Size..." />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="weightValue" className="block text-sm font-medium text-gray-700 mb-2">Weight Value *</label>
                                    <input type="number" id="weightValue" name="weightValue" step="0.01" min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Weight..." />
                                </div>
                                <div>
                                    <label htmlFor="weightUnit" className="block text-sm font-medium text-gray-700 mb-2">Weight Unit *</label>
                                    <select id="weightUnit" name="weightUnit" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent">
                                        <option value="kg">kg</option>
                                        <option value="lbs">lbs</option>
                                        <option value="g">g</option>
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">Location *</label>
                                    <select id="location" name="location" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent">
                                        <option value="">Select a location</option>
                                        {locations.map((location) => (
                                            <option key={location.id} value={location.name}>{location.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">Quantity *</label>
                                    <input type="number" id="quantity" name="quantity" step="1" min="0" required className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Quantity..." />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="lowStockAt" className="block text-sm font-medium text-gray-700 mb-2">Low Stock At (optional)</label>
                                <input type="number" id="lowStockAt" name="lowStockAt" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter low stock threshold..." />
                            </div>
                            <select id="category" name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent">
                                <option value="">Select a category</option>
                                {categories.map((category, index) => (
                                    <option key={index} value={category}>{category}</option>
                                ))}
                            </select>
                            <div>
                                <label htmlFor="assignedUserId" className="block text-sm font-medium text-gray-700 mb-2">Assigned User (optional)</label>
                                <select id="assignedUserId" name="assignedUserId" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent">
                                    <option value="">Select a user</option>
                                    {users.map((user) => (
                                        <option key={user.id} value={user.id}>{user.fullName}</option>
                                    ))}
                                </select>
                            </div>
                            <SubmitButton />
                            <Link href="/inventory/inventory" className="px-6 py-3 bg-red-500 text-white ml-4 rounded-lg hover:bg-red-600" > Cancel </Link>
                        </form>
                    </div>
                    {/* RIGHT — PRODUCT LIST */}
                    <ProductList products={products} />
                </div>
            </main>
        </div>
    );
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" disabled={pending} className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700" >
            {pending ? "Adding..." : "Add Product"}
        </button>
    );
}
