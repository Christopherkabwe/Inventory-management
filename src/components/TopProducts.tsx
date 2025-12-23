import { Star } from "lucide-react";
import { Product } from "./Product";

interface Props {
    products: Product[];
    title: string;
    iconColor: string;
    limit?: number;
}

export default function TopProducts({ products, title, iconColor, limit = 5 }: Props) {
    const displayedProducts = products.slice(0, limit);

    return (
        <div className="bg-white p-6 rounded-xl border hover:shadow-md transition-shadow">
            <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Star className={`h-5 w-5 ${iconColor}`} />
                {title}
            </h3>
            {displayedProducts.length === 0 ? (
                <p className="text-sm text-gray-500">No products sold yet.</p>
            ) : (
                <ul className="space-y-3 text-sm">
                    {displayedProducts.map((product, index) => (
                        <li key={product.id} className="flex justify-between items-center">
                            <span className="truncate font-medium">
                                {index + 1}. {product.name}
                            </span>
                            <span className="text-gray-600">{product.qty} units</span>
                            <span className="font-bold text-purple-600">
                                K{product.totalValue.toFixed(2)}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
            {products.length > limit && (
                <p className="text-sm text-gray-500 mt-2">
                    Showing top {limit} products. <a href="#" className="text-blue-500">View all</a>
                </p>
            )}
        </div>
    );
}