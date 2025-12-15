"use client";
import { useState, useEffect } from "react";
import { Product } from "@/types/sales";
import { SubmitButton } from "./SubmitButton";

interface CreateSaleFormProps {
    products: Product[];
    customers: { id: string; name: string }[];
    isLoadingProducts: boolean;
    isLoadingCustomers: boolean;
    onSubmit: (formData: FormData) => void;
    isSubmitting: boolean;
}

export function CreateSaleForm({
    products,
    customers,
    isLoadingProducts,
    isLoadingCustomers,
    onSubmit,
    isSubmitting,
}: CreateSaleFormProps) {
    const [selectedProductId, setSelectedProductId] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [salePrice, setSalePrice] = useState<number | null>(null);

    useEffect(() => {
        if (selectedProductId) {
            const product = products.find((p) => p.id === selectedProductId);
            setSalePrice(product?.price || null);
        }
    }, [selectedProductId, products]);

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSubmit(new FormData(e.currentTarget));
            }}
            className="bg-white rounded-lg border-gray-200 p-6"
        >
            <div className="grid grid-cols-5 gap-4 items-end">
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Customer</label>
                    {isLoadingCustomers ? (
                        <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                            <svg className="animate-spin h-5 w-5 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading customers...
                        </div>
                    ) : (
                        <select
                            name="customerId"
                            value={selectedCustomerId}
                            onChange={(e) => setSelectedCustomerId(e.target.value)}
                            className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                            required
                        >
                            <option value="">Select Customer</option>
                            {customers.map((c) => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Product</label>
                    {isLoadingProducts ? (
                        <div className="flex items-center justify-center py-2 text-sm text-gray-500">
                            <svg className="animate-spin h-5 w-5 text-purple-600 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Loading products...
                        </div>
                    ) : (
                        <select
                            name="productId"
                            value={selectedProductId}
                            onChange={(e) => {
                                const id = e.target.value;
                                setSelectedProductId(id);
                                const p = products.find((p) => p.id === id);
                                setSalePrice(p?.price || null);
                            }}
                            className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                            required
                        >
                            <option value="">Select Product</option>
                            {products.map((p) => (
                                <option key={p.id} value={p.id} disabled={p.quantity <= 0}>
                                    {p.name} | K{p.price} | ({p.quantity > 0 ? `${p.quantity} in stock` : "Out of stock"})
                                </option>
                            ))}
                        </select>
                    )}
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Quantity</label>
                    <input
                        type="number"
                        name="quantity"
                        value={quantity}
                        onChange={(e) => setQuantity(Number(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price (K)</label>
                    <input
                        type="number"
                        name="salePrice"
                        value={salePrice || ""}
                        onChange={(e) => setSalePrice(Number(e.target.value))}
                        min="0"
                        step="0.01"
                        required
                        className="w-full px-2 py-2 border border-gray-600 rounded-lg"
                    />
                </div>
                <div>
                    <SubmitButton isSubmitting={isSubmitting} />
                </div>
            </div>
        </form>
    );
}
