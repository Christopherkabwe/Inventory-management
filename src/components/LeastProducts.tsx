import { AlertTriangle } from "lucide-react";
import TopProducts from "./TopProducts";
import { Product } from "./Product";

interface Props {
    products: Product[];
}

export default function LeastProducts({ products }: Props) {
    const sortedProducts = products.sort((a, b) => a.qty - b.qty);

    return (
        <TopProducts
            products={sortedProducts}
            title="Least Selling Products (Last 30 Days)"
            iconColor="text-red-500"
        />
    );
}
