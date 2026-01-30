"use client";
import { useEffect, useActionState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import { CreateProduct } from "@/lib/actions/products";
import ProductList from "./ProductList";
import { useFormStatus } from "react-dom";
import { ChevronLeft, Plus } from "lucide-react";

interface Product {
    id: string;
    sku: string;
    name: string;
    price: number;
    packSize: number;
    weightValue: number;
    weightUnit: string;
    category?: string | null;
    subCategory?: string | null;
}

interface Props {
    isAdmin: boolean;
    products: Product[];
    error?: string;
}
export default function AddProductClient({ isAdmin, products, error }: Props) {
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
            <div className="min-h-screen">
                <main className="ml-64 p-8">
                    <div className="mb-8">
                        <h1 className="text-2xl font-semibold">Add New Product</h1>
                        <p className="text-sm text-gray-500"> You do not have permission to add products. </p>
                    </div>
                </main>
            </div>
        );
    }


    return (
        <div className="min-h-screen items-center">
            <main className="p-5">
                <div className="flex justify-start mb-1">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 px-2 py-2
                                        text-sm font-medium text-black hover:cursor-pointer"
                    >
                        <ChevronLeft size={16} /> Back
                    </Link>
                </div>
                <div className="mb-5 bg-white p-5 rounded-md ">
                    <h1 className="text-2xl font-semibold">Add New Product</h1>
                    <p className="text-sm text-gray-500"> Add new products to your product list </p>
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

                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">Category (optional)</label>
                                    <input type="text" id="category" name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Category" />
                                </div>
                                <div>
                                    <label htmlFor="subCategory" className="block text-sm font-medium text-gray-700 mb-2">Sub-category (optional)</label>
                                    <input type="text" id="subCategory" name="subCategory" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Sub-Category" />
                                </div>
                                <div>
                                    <label htmlFor="lowStockAt" className="block text-sm font-medium text-gray-700 mb-2">Low Stock At (optional)</label>
                                    <input type="number" id="lowStockAt" name="lowStockAt" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter low stock threshold..." />
                                </div>

                                <div>
                                    <label htmlFor="isTaxable" className="block text-sm font-medium text-gray-700 mb-2">Is Taxable (optional)</label>
                                    <input type="text" id="isTaxable" name="isTaxable" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter yes | No" />
                                </div>
                                <div>
                                    <label htmlFor="taxRate" className="block text-sm font-medium text-gray-700 mb-2">Tax Rate (optional)</label>
                                    <input type="number" id="taxRate" name="taxRate" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Tax rate" />
                                </div>
                                <div>
                                    <label htmlFor="costPerBag" className="block text-sm font-medium text-gray-700 mb-2">Production Cost (optional)</label>
                                    <input type="number" id="costPerBag" name="costPerBag" min="0" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-transparent" placeholder="Enter Tax rate" />
                                </div>
                            </div>
                            <SubmitButton />
                            <Link href="/products" className="px-6 py-3 bg-red-500 text-white ml-4 rounded-lg hover:bg-red-600" > Cancel </Link>
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
