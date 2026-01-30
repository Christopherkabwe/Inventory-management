"use client";
import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";

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


export default function ProductList({ products }: { products: Product[] }) {
    const [query, setQuery] = useState("");

    const filteredProducts = useMemo(() => {
        const q = query.toLowerCase();
        return products
            .filter((item) =>
                item.name.toLowerCase().includes(q) ||
                item.sku.toLowerCase().includes(q)
            )
            .reduce((acc: Product[], item) => {
                if (!acc.find((p) => p.id === item.id)) {
                    acc.push(item);
                }
                return acc;
            }, []);
    }, [products, query]);

    // Handle click: ask for confirmation and redirect/scroll
    const handleProductClick = (item: Product) => {
        const confirmRedirect = confirm(
            "Do you want to view this product in the Inventory table?"
        );
        if (confirmRedirect) {
            // Use the actual product ID
            window.location.href = "/products/product-management";
        }
    };

    return (
        <div className="bg-white border rounded-sm flex flex-col h-full">
            <div className="bg-white sticky top-0 z-10 border-b p-4">
                <h2 className="text-sm font-semibold mb-3">Existing Products</h2>
                <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full h-8 pl-8 pr-8 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={() => setQuery("")}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    )}
                </div>
            </div>
            <div className="flex-1 p-4 h-170 overflow-y-auto">
                {filteredProducts.length === 0 ? (
                    <p className="text-sm text-gray-400">
                        {query ? "No matching products" : "No products yet"}
                    </p>
                ) : (
                    <ul className="space-y-2">
                        {filteredProducts.map((item) => (
                            <li
                                key={item.id}
                                onClick={() => handleProductClick(item)}
                                className="cursor-pointer border rounded-md px-3 py-2 hover:bg-gray-50 transition"
                            >
                                <div className="text-sm font-medium">
                                    {item.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Sku: {item.sku}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Pack Size: {item.packSize}
                                </div>
                                <div className="text-xs text-gray-500">
                                    Weight: {item.weightValue} {item.weightUnit}
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}