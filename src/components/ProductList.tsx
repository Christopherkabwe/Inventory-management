interface Product {
    id: string;
    name: string;
    sku: string;
    price: number;
}

export default function ProductList({ products }: { products: Product[] }) {


    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 h-[calc(100vh-180px)] overflow-y-auto">
            <h2 className="text-sm font-semibold text-gray-700 mb-3">
                Existing Products
            </h2>

            {products.length === 0 ? (
                <p className="text-sm text-gray-400">No products found</p>
            ) : (
                <ul className="space-y-2">
                    {products.map((product) => (
                        <li
                            key={product.id}
                            className="border rounded-md px-3 py-2 hover:bg-gray-50"
                        >
                            <div className="text-sm font-medium">
                                {product.name}
                            </div>
                            <div className="text-xs text-gray-500">
                                SKU: {product.sku}
                            </div>
                            <div className="text-xs text-gray-500">
                                K{product.price.toFixed(2)}
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
